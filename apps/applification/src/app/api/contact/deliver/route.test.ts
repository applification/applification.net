import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "@/lib/contact-draft";
import { contactDeliveryAcceptedSchema } from "@/lib/public-api-schema";

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
