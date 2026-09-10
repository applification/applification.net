import { guardContactRequest, readContactJson } from "@/lib/contact-request-guard";
import { head } from "@vercel/blob";
import { getRun, start } from "workflow/api";
import {
  checkContactAbuse,
  contactDeliveryRequestSchema,
  deliveryPayloadDigest,
  resolveContactIdempotencyKey,
  validateDeliveryDraft,
} from "@/lib/contact-delivery";
import { deliverContactEnquiryWorkflow } from "@/workflows/contact-delivery";
import type { ContactDraft } from "@/lib/contact-draft";

type StartedDelivery = { digest: string; runId: string };
const startedDeliveries = new Map<string, StartedDelivery>();

const idempotencyMessages = {
  idempotency_required:
    "Send an Idempotency-Key header (UUID) so a retried request cannot send the enquiry twice.",
  idempotency_invalid: "The Idempotency-Key header must be a UUID.",
  idempotency_mismatch:
    "The Idempotency-Key header and the body idempotencyKey differ. Send one key, preferably the header.",
} as const;

/** 202 Accepted: delivery runs durably; poll the Location URL for the outcome. */
function accepted(request: Request, runId: string, route: string | null, replayed: boolean) {
  const statusUrl = new URL("/api/contact/deliver", request.url);
  statusUrl.searchParams.set("runId", runId);
  return Response.json(
    { status: "accepted", runId, statusUrl: statusUrl.toString(), route, replayed },
    {
      status: 202,
      headers: { Location: statusUrl.toString() },
    },
  );
}

export async function POST(request: Request) {
  const blocked = await guardContactRequest(request, "deliver");
  if (blocked) return blocked;
  const payload: unknown = await readContactJson(request);
  const checked = contactDeliveryRequestSchema.safeParse(payload);

  if (!checked.success) {
    return Response.json(
      { code: "invalid_request", message: "Review the brief and consent before sending." },
      { status: 400 },
    );
  }

  const resolvedKey = resolveContactIdempotencyKey(request, checked.data.idempotencyKey);
  if (!resolvedKey.ok) {
    return Response.json(
      { code: resolvedKey.code, message: idempotencyMessages[resolvedKey.code] },
      { status: 400 },
    );
  }
  const idempotencyKey = resolvedKey.key;

  const existing = startedDeliveries.get(idempotencyKey);
  const digest = deliveryPayloadDigest(checked.data.draft);
  if (existing) {
    if (existing.digest !== digest) {
      return Response.json(
        {
          code: "idempotency_conflict",
          message: "This Idempotency-Key was already used for a different brief. Use a new key for a new brief.",
        },
        { status: 409 },
      );
    }
    try {
      const existingStatus = await getRun(existing.runId).status;
      if (existingStatus !== "failed") {
        return accepted(request, existing.runId, checked.data.draft.route, true);
      }
      startedDeliveries.delete(idempotencyKey);
    } catch {
      startedDeliveries.delete(idempotencyKey);
    }
  }

  const abuse = checkContactAbuse({
    clientAddress: request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local",
    startedAt: checked.data.startedAt,
    website: checked.data.website,
  });
  if (!abuse.allowed) {
    return Response.json(
      { code: "rate_limited", message: "This enquiry cannot be sent yet. Wait and try again." },
      { status: 429, headers: { "Retry-After": "900", "Cache-Control": "no-store" } },
    );
  }

  const deliveryDraft = validateDeliveryDraft(checked.data.draft);
  if (!deliveryDraft.valid) {
    return Response.json(
      { code: "invalid_brief", message: deliveryDraft.message },
      { status: 400 },
    );
  }

  if (deliveryDraft.draft.attachment) {
    const verified = await verifyPrivateAttachment(deliveryDraft.draft.attachment);
    if (!verified) {
      return Response.json(
        {
          code: "invalid_attachment",
          message: "The private document could not be verified. Remove or replace it before sending.",
        },
        { status: 400 },
      );
    }
  }

  try {
    const run = await start(deliverContactEnquiryWorkflow, [
      {
        enquiryId: crypto.randomUUID(),
        idempotencyKey,
        approvedAt: new Date().toISOString(),
        draft: deliveryDraft.draft,
      },
    ]);
    startedDeliveries.set(idempotencyKey, { digest, runId: run.runId });
    return accepted(request, run.runId, deliveryDraft.draft.route, false);
  } catch {
    return Response.json(
      {
        code: "workflow_unavailable",
        message: "The durable handoff could not start. Your reviewed brief is still here; retry it.",
      },
      { status: 503 },
    );
  }
}

export async function GET(request: Request) {
  const runId = new URL(request.url).searchParams.get("runId");
  if (!runId || !/^wrun_[A-Za-z0-9_-]+$/.test(runId)) {
    return Response.json(
      { code: "invalid_run", message: "Provide the runId returned by POST /api/contact/deliver." },
      { status: 400 },
    );
  }

  try {
    const run = getRun(runId);
    const status = await run.status;
    if (status === "completed") {
      return Response.json({ status, result: await run.returnValue });
    }
    if (status === "failed") {
      return Response.json(
        {
          status,
          message: "Delivery failed without sending a false success. Your reviewed brief is still available to retry.",
        },
        { status: 503 },
      );
    }
    return Response.json({ status });
  } catch {
    return Response.json(
      { status: "failed", message: "Delivery status is temporarily unavailable. Retry the status check." },
      { status: 503 },
    );
  }
}

async function verifyPrivateAttachment(
  attachment: NonNullable<ContactDraft["attachment"]>,
) {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  if (!token || !attachment.pathname.startsWith("contact/unsubmitted/")) return false;

  try {
    const blob = await head(attachment.pathname, { token });
    return (
      blob.pathname === attachment.pathname &&
      blob.size === attachment.size &&
      blob.contentType === attachment.contentType
    );
  } catch {
    return false;
  }
}
