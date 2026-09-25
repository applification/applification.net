import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "@/lib/contact-draft";
import { contactDeliveryAcceptedSchema } from "@/lib/public-api-schema";
import { contactAttachmentOwnerFolder } from "@/lib/contact-attachment-owner";

const mocks = vi.hoisted(() => ({
  start: vi.fn(),
  getRun: vi.fn(),
  head: vi.fn(),
}));
vi.mock("workflow/api", () => ({ start: mocks.start, getRun: mocks.getRun }));
vi.mock("@vercel/blob", () => ({ head: mocks.head }));
vi.mock("@/workflows/contact-delivery", () => ({
  deliverContactEnquiryWorkflow: {},
}));

import { GET, POST } from "./route";

const draft = {
  ...createContactDraft({ route: "general" }),
  topic: "Speaking request",
  message: "A conference invitation",
  replyName: "Alex Example",
  replyEmail: "alex@example.com",
};

function post(
  body: Record<string, unknown>,
  headers: Record<string, string> = {},
  address = "203.0.113.10",
) {
  return POST(
    new Request("https://example.com/api/contact/deliver", {
      method: "POST",
      headers: {
        "content-type": "application/json",
        origin: "https://example.com",
        "x-contact-session": "ea7735e0-5e9c-4ea0-9486-183223a26700",
        "x-forwarded-for": address,
        ...headers,
      },
      body: JSON.stringify({
        consent: true,
        draft,
        startedAt: Date.now() - 10_000,
        website: "",
        ...body,
      }),
    }),
  );
}

describe("contact delivery async job", () => {
  let runCount = 0;
  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    runCount = 0;
    mocks.start.mockImplementation(async () => ({ runId: `wrun_${++runCount}` }));
    mocks.getRun.mockImplementation(() => ({ status: Promise.resolve("running") }));
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("accepts an Idempotency-Key header and returns 202 with a Location to poll", async () => {
    const key = crypto.randomUUID();
    const response = await post({}, { "Idempotency-Key": key });
    const body = await response.json();
    expect(response.status).toBe(202);
    expect(contactDeliveryAcceptedSchema.safeParse(body).success).toBe(true);
    expect(body.replayed).toBe(false);
    expect(response.headers.get("location")).toBe(
      `https://example.com/api/contact/deliver?runId=${body.runId}`,
    );
    expect(body.statusUrl).toBe(response.headers.get("location"));
    expect(mocks.start.mock.calls[0][1][0].idempotencyKey).toBe(key);
  });

  it("replays the original job for a retried request instead of sending twice", async () => {
    const key = crypto.randomUUID();
    const first = await (await post({}, { "Idempotency-Key": key }, "203.0.113.20")).json();
    const retry = await post({}, { "Idempotency-Key": key }, "203.0.113.20");
    const body = await retry.json();
    expect(retry.status).toBe(202);
    expect(body.runId).toBe(first.runId);
    expect(body.replayed).toBe(true);
    expect(mocks.start).toHaveBeenCalledTimes(1);
  });

  it("rejects a reused key with a different brief", async () => {
    const key = crypto.randomUUID();
    await post({}, { "Idempotency-Key": key }, "203.0.113.30");
    const response = await post(
      { draft: { ...draft, message: "Something else" } },
      { "Idempotency-Key": key },
      "203.0.113.30",
    );
    expect(response.status).toBe(409);
    expect((await response.json()).code).toBe("idempotency_conflict");
  });

  it("still honours the legacy body key and rejects mismatches or missing keys", async () => {
    const key = crypto.randomUUID();
    expect((await post({ idempotencyKey: key }, {}, "203.0.113.40")).status).toBe(202);

    const mismatch = await post(
      { idempotencyKey: key },
      { "Idempotency-Key": crypto.randomUUID() },
      "203.0.113.41",
    );
    expect(mismatch.status).toBe(400);
    expect((await mismatch.json()).code).toBe("idempotency_mismatch");

    const missing = await post({}, {}, "203.0.113.42");
    expect(missing.status).toBe(400);
    expect((await missing.json()).code).toBe("idempotency_required");

    const invalid = await post({}, { "Idempotency-Key": "not-a-uuid" }, "203.0.113.43");
    expect(invalid.status).toBe(400);
    expect((await invalid.json()).code).toBe("idempotency_invalid");
  });

  it("reports job status as JSON from the polling endpoint", async () => {
    mocks.getRun.mockImplementation(() => ({
      status: Promise.resolve("completed"),
      returnValue: Promise.resolve({
        route: "contract",
        sentFields: ["Role", "Reply email"],
        deliveryId: "email-1",
        cvFollowUpRequiresApproval: true,
        cvReviewRunId: "wrun_private_review",
      }),
    }));
    const response = await GET(
      new Request("https://example.com/api/contact/deliver?runId=wrun_1"),
    );
    // Internal run and provider IDs must not leak to whoever holds the run ID.
    expect(await response.json()).toEqual({
      status: "completed",
      result: { route: "contract", sentFields: ["Role", "Reply email"], cvFollowUpRequiresApproval: true },
    });

    const bad = await GET(new Request("https://example.com/api/contact/deliver?runId=nope"));
    expect(bad.status).toBe(400);
    expect((await bad.json()).code).toBe("invalid_run");
  });
});

describe("contact delivery safeguards", () => {
  const session = "ea7735e0-5e9c-4ea0-9486-183223a26700";
  const otherSession = "0b8a3c1e-2f4d-4a6b-9c8d-7e6f5a4b3c2d";
  const ownerSecret = "attachment-owner-secret-for-tests";
  const blobToken = "vercel_blob_rw_store_secret";

  function attachmentFor(owner: string) {
    return {
      pathname: `${contactAttachmentOwnerFolder(owner, ownerSecret)}/brief-Xy12ab.pdf`,
      filename: "brief.pdf",
      contentType: "application/pdf" as const,
      size: 1_234,
    };
  }

  function contractDraft(attachment: ReturnType<typeof attachmentFor>) {
    return {
      ...createContactDraft({ route: "contract" }),
      company: "Example Ltd",
      need: "A senior React engineer for an AI product workflow.",
      timing: "October for three months",
      workingArrangement: "Remote UK",
      replyName: "Alex Recruiter",
      replyEmail: "alex@example.com",
      attachment,
    };
  }

  // The abuse check counts attempts per address, so each test uses a fresh one.
  let addressCount = 0;
  function address() {
    addressCount += 1;
    return `198.51.100.${addressCount}`;
  }

  beforeEach(() => {
    vi.stubEnv("NODE_ENV", "test");
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", blobToken);
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", ownerSecret);
    mocks.start.mockResolvedValue({ runId: "wrun_attachment" });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("refuses an attachment uploaded by another session without checking storage or starting delivery", async () => {
    const response = await post(
      { draft: contractDraft(attachmentFor(otherSession)) },
      { "Idempotency-Key": crypto.randomUUID(), "x-contact-session": session },
      address(),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_attachment");
    expect(mocks.head).not.toHaveBeenCalled();
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("starts delivery for the session's own attachment once the stored blob matches", async () => {
    const attachment = attachmentFor(session);
    mocks.head.mockResolvedValue({
      pathname: attachment.pathname,
      size: attachment.size,
      contentType: attachment.contentType,
    });

    const response = await post(
      { draft: contractDraft(attachment) },
      { "Idempotency-Key": crypto.randomUUID(), "x-contact-session": session },
      address(),
    );

    expect(response.status).toBe(202);
    expect(mocks.head).toHaveBeenCalledWith(attachment.pathname, { token: blobToken });
    expect(mocks.start).toHaveBeenCalledOnce();
    expect(mocks.start.mock.calls[0][1][0].draft.attachment).toEqual(attachment);
  });

  it.each([
    ["size", { size: 999 }],
    ["content type", { contentType: "application/octet-stream" }],
    ["pathname", { pathname: "contact/unsubmitted/elsewhere.pdf" }],
  ])("refuses an owned attachment whose stored %s differs", async (_label, difference) => {
    const attachment = attachmentFor(session);
    mocks.head.mockResolvedValue({
      pathname: attachment.pathname,
      size: attachment.size,
      contentType: attachment.contentType,
      ...difference,
    });

    const response = await post(
      { draft: contractDraft(attachment) },
      { "Idempotency-Key": crypto.randomUUID() },
      address(),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_attachment");
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("refuses an owned attachment that is missing from storage or can't be checked", async () => {
    mocks.head.mockRejectedValue(new Error("not found"));
    const missing = await post(
      { draft: contractDraft(attachmentFor(session)) },
      { "Idempotency-Key": crypto.randomUUID() },
      address(),
    );
    expect(missing.status).toBe(400);

    vi.stubEnv("BLOB_READ_WRITE_TOKEN", undefined);
    const unconfigured = await post(
      { draft: contractDraft(attachmentFor(session)) },
      { "Idempotency-Key": crypto.randomUUID() },
      address(),
    );
    expect(unconfigured.status).toBe(400);
    expect((await unconfigured.json()).code).toBe("invalid_attachment");
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("rate-limits a brief submitted faster than a person could review it", async () => {
    const response = await post(
      { startedAt: Date.now() },
      { "Idempotency-Key": crypto.randomUUID() },
      address(),
    );

    expect(response.status).toBe(429);
    expect(response.headers.get("retry-after")).toBe("900");
    expect(response.headers.get("cache-control")).toBe("no-store");
    expect((await response.json()).code).toBe("rate_limited");
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("rate-limits the sixth enquiry from one address within the window", async () => {
    const client = "192.0.2.77";
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const accepted = await post({}, { "Idempotency-Key": crypto.randomUUID() }, client);
      expect(accepted.status).toBe(202);
    }

    const limited = await post({}, { "Idempotency-Key": crypto.randomUUID() }, client);
    expect(limited.status).toBe(429);
    expect(mocks.start).toHaveBeenCalledTimes(5);
  });

  it("rejects a filled honeypot field as an invalid request", async () => {
    const response = await post(
      { website: "https://spam.test" },
      { "Idempotency-Key": crypto.randomUUID() },
      address(),
    );

    expect(response.status).toBe(400);
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("starts a fresh run when a retried key's original run failed or can't be read", async () => {
    const key = crypto.randomUUID();
    const client = address();
    mocks.start.mockResolvedValueOnce({ runId: "wrun_first" });
    await post({}, { "Idempotency-Key": key }, client);

    mocks.getRun.mockReturnValueOnce({ status: Promise.resolve("failed") });
    mocks.start.mockResolvedValueOnce({ runId: "wrun_second" });
    const afterFailure = await post({}, { "Idempotency-Key": key }, client);
    expect(afterFailure.status).toBe(202);
    expect(await afterFailure.json()).toMatchObject({ runId: "wrun_second", replayed: false });

    mocks.getRun.mockReturnValueOnce({ status: Promise.reject(new Error("world down")) });
    mocks.start.mockResolvedValueOnce({ runId: "wrun_third" });
    const afterLookupError = await post({}, { "Idempotency-Key": key }, client);
    expect(await afterLookupError.json()).toMatchObject({ runId: "wrun_third", replayed: false });
    expect(mocks.start).toHaveBeenCalledTimes(3);
  });

  it("rejects a brief that is missing required answers", async () => {
    const response = await post(
      { draft: { ...createContactDraft({ route: "general" }), replyName: "Alex Example" } },
      { "Idempotency-Key": crypto.randomUUID() },
      address(),
    );

    expect(response.status).toBe(400);
    expect((await response.json()).code).toBe("invalid_brief");
    expect(mocks.start).not.toHaveBeenCalled();
  });

  it("reports a failed or unreadable run from the polling endpoint as unavailable", async () => {
    mocks.getRun.mockReturnValueOnce({ status: Promise.resolve("failed") });
    const failed = await GET(new Request("https://example.com/api/contact/deliver?runId=wrun_1"));
    expect(failed.status).toBe(503);
    expect((await failed.json()).status).toBe("failed");

    mocks.getRun.mockImplementationOnce(() => {
      throw new Error("world down");
    });
    const unreadable = await GET(new Request("https://example.com/api/contact/deliver?runId=wrun_1"));
    expect(unreadable.status).toBe(503);

    mocks.getRun.mockReturnValueOnce({ status: Promise.resolve("running") });
    const running = await GET(new Request("https://example.com/api/contact/deliver?runId=wrun_1"));
    expect(running.status).toBe(200);
    expect(await running.json()).toEqual({ status: "running" });
  });

  it("keeps the brief when the durable workflow can't start", async () => {
    mocks.start.mockRejectedValue(new Error("workflow down"));
    const response = await post({}, { "Idempotency-Key": crypto.randomUUID() }, address());

    expect(response.status).toBe(503);
    expect((await response.json()).code).toBe("workflow_unavailable");
  });
});
