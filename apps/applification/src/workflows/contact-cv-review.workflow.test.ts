import { createRequire } from "node:module";
import { getHookByToken, getRun, resumeHook, start } from "workflow/api";
import { getWorld } from "workflow/runtime";
import { waitForHook, waitForSleep } from "@workflow/vitest";
import { afterAll, afterEach, beforeAll, beforeEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "@/lib/contact-draft";
import {
  contactCvDecisionHook,
  contactCvHookToken,
  contractCvReviewWorkflow,
  type ContractCvReviewInput,
} from "./contact-delivery";

/*
 * These tests run the production contractCvReviewWorkflow in the in-process
 * Workflow world. Step code is loaded natively from the pre-built bundle, so
 * vi.mock cannot reach it. External I/O is replaced at the network edge
 * instead:
 * - Vercel Blob uses its own undici `fetch`, so blob traffic is answered by an
 *   undici MockAgent installed as the global dispatcher (loaded from the same
 *   undici copy @vercel/blob uses). Unmatched hosts fail instead of reaching
 *   the network.
 * - Resend is called through the global `fetch`, which is stubbed.
 */

type Interceptor = {
  reply(
    callback: (options: { path: string; method: string }) => {
      statusCode: number;
      data?: string | Buffer;
      responseOptions?: { headers?: Record<string, string> };
    },
  ): { persist(): void };
};
type MockAgentInstance = {
  disableNetConnect(): void;
  get(origin: string): { intercept(options: { path: (path: string) => boolean; method: string }): Interceptor };
  close(): Promise<void>;
};
type Undici = {
  MockAgent: new () => MockAgentInstance;
  getGlobalDispatcher(): unknown;
  setGlobalDispatcher(dispatcher: unknown): void;
};

const requireHere = createRequire(import.meta.url);
const undici = createRequire(requireHere.resolve("@vercel/blob"))("undici") as Undici;

const storeId = "teststore";
const blobToken = `vercel_blob_rw_${storeId}_secret`;
const cvPathname = "contact/cv/dave-hudson.pdf";
const cvBytes = Buffer.from("%PDF-1.7 test CV");

type ResendCall = { url: string; headers: Headers; body: Record<string, unknown> };

let agent: MockAgentInstance;
let originalDispatcher: unknown;
let blobHeads: string[];
let blobReads: string[];
let cvBlobStatus: number;
let resendCalls: ResendCall[];
let resendResponses: Array<() => Response>;

function installBlobMocks() {
  agent = new undici.MockAgent();
  agent.disableNetConnect();
  agent
    .get("https://vercel.com")
    .intercept({ path: (path) => path.startsWith("/api/blob"), method: "GET" })
    .reply(({ path }) => {
      const pathname = new URL(path, "https://vercel.com").searchParams.get("url") ?? "";
      blobHeads.push(pathname);
      return {
        statusCode: 200,
        data: JSON.stringify({
          url: `https://${storeId}.private.blob.vercel-storage.com/${pathname}`,
          downloadUrl: `https://${storeId}.private.blob.vercel-storage.com/${pathname}?download=1`,
          pathname,
          size: cvBytes.length,
          contentType: "application/pdf",
          contentDisposition: "attachment",
          cacheControl: "private",
          uploadedAt: "2026-09-01T00:00:00.000Z",
          etag: "etag-1",
        }),
        responseOptions: { headers: { "content-type": "application/json" } },
      };
    })
    .persist();
  agent
    .get(`https://${storeId}.private.blob.vercel-storage.com`)
    .intercept({ path: () => true, method: "GET" })
    .reply(({ path }) => {
      blobReads.push(new URL(path, "https://blob.test").pathname.slice(1));
      if (cvBlobStatus !== 200) return { statusCode: cvBlobStatus, data: "" };
      return {
        statusCode: 200,
        data: cvBytes,
        responseOptions: {
          headers: {
            "content-type": "application/pdf",
            "content-length": String(cvBytes.length),
          },
        },
      };
    })
    .persist();
  undici.setGlobalDispatcher(agent);
}

function stubResend() {
  const realFetch = globalThis.fetch;
  vi.stubGlobal("fetch", async (input: RequestInfo | URL, init?: RequestInit) => {
    const url = input instanceof Request ? input.url : String(input);
    if (!url.startsWith("https://api.resend.com/")) return realFetch(input, init);
    resendCalls.push({
      url,
      headers: new Headers(init?.headers),
      body: JSON.parse(String(init?.body)) as Record<string, unknown>,
    });
    const next = resendResponses.shift();
    if (!next) throw new Error("Unexpected Resend call");
    return next();
  });
}

function createInput(overrides: Partial<ContractCvReviewInput> = {}): ContractCvReviewInput {
  return {
    enquiryId: `enquiry-${crypto.randomUUID()}`,
    idempotencyKey: "59aa12a4-91ee-41d2-b5ce-c61d905ddaf1",
    // Expiry is 14 days after approval, so approval has to be "now" for the
    // review to be open.
    approvedAt: new Date().toISOString(),
    deliveryId: "email-contract-1",
    deliveredAt: new Date().toISOString(),
    draft: {
      ...createContactDraft({ route: "contract" }),
      company: "Example Ltd",
      need: "A senior React product engineer for an agent-assisted delivery workflow.",
      timing: "October for three months",
      workingArrangement: "Remote UK",
      replyName: "Alex Recruiter",
      replyEmail: "alex@example.com",
    },
    ...overrides,
  };
}

async function listEvents(runId: string) {
  const { data } = await getWorld().events.list({
    runId,
    pagination: { limit: 1000 },
    resolveData: "none",
  });
  return data;
}

/** Waits for a pending sleep that isn't in `seen` (the expiry sleep stays pending after a decision). */
async function waitForNewSleep(runId: string, seen: Set<string>) {
  const deadline = Date.now() + 30_000;
  while (Date.now() < deadline) {
    const events = await listEvents(runId);
    const completed = new Set(
      events.filter((event) => event.eventType === "wait_completed").map((event) => event.correlationId),
    );
    const pending = events.find(
      (event) =>
        event.eventType === "wait_created" &&
        event.correlationId &&
        !completed.has(event.correlationId) &&
        !seen.has(event.correlationId),
    );
    if (pending?.correlationId) {
      seen.add(pending.correlationId);
      return pending.correlationId;
    }
    await new Promise((resolve) => setTimeout(resolve, 50));
  }
  throw new Error("No new sleep was scheduled");
}

async function startAndWaitForDecision(input: ContractCvReviewInput) {
  const run = await start(contractCvReviewWorkflow, [input]);
  const token = contactCvHookToken(input.enquiryId);
  await waitForHook(run, { token });
  const expirySleep = await waitForSleep(run);
  return { run, token, seenSleeps: new Set([expirySleep]) };
}

function decide(token: string, decision: "approve" | "decline") {
  return contactCvDecisionHook.resume(token, { decision, decidedAt: "2026-09-01T11:00:00.000Z" });
}

describe("contract CV review workflow", () => {
  beforeAll(() => {
    originalDispatcher = undici.getGlobalDispatcher();
  });

  beforeEach(() => {
    blobHeads = [];
    blobReads = [];
    cvBlobStatus = 200;
    resendCalls = [];
    resendResponses = [];
    vi.stubEnv("BLOB_READ_WRITE_TOKEN", blobToken);
    vi.stubEnv("VERCEL_BLOB_API_URL", undefined);
    vi.stubEnv("NEXT_PUBLIC_VERCEL_BLOB_API_URL", undefined);
    vi.stubEnv("CONTACT_CV_BLOB_PATHNAME", cvPathname);
    vi.stubEnv("CONTACT_CV_VERSION", "2026-09");
    vi.stubEnv("CONTACT_CV_FILENAME", "Dave-Hudson-CV.pdf");
    vi.stubEnv("RESEND_API_KEY", "re_test");
    vi.stubEnv("CONTACT_DELIVERY_TO", "dave@example.com");
    vi.stubEnv("CONTACT_DELIVERY_FROM", "Applification <contact@example.com>");
    installBlobMocks();
    stubResend();
  });

  afterEach(async () => {
    vi.unstubAllGlobals();
    vi.unstubAllEnvs();
    undici.setGlobalDispatcher(originalDispatcher);
    await agent.close();
  });

  afterAll(() => {
    undici.setGlobalDispatcher(originalDispatcher);
  });

  it("publishes verified review metadata on the hook and sends nothing on decline", async () => {
    const input = createInput();
    const { run, token } = await startAndWaitForDecision(input);

    const hook = await getHookByToken(token);
    expect(hook.metadata).toEqual(
      expect.objectContaining({
        kind: "contract_cv_review",
        enquiryId: input.enquiryId,
        cv: expect.objectContaining({ pathname: cvPathname, size: cvBytes.length, version: "2026-09" }),
        expiresAt: Date.parse(input.approvedAt) + 14 * 24 * 60 * 60 * 1_000,
      }),
    );
    expect(blobHeads).toEqual([cvPathname]);

    await decide(token, "decline");
    await expect(run.returnValue).resolves.toEqual({
      status: "declined",
      decidedAt: "2026-09-01T11:00:00.000Z",
    });
    expect(blobReads).toEqual([]);
    expect(resendCalls).toEqual([]);
  });

  it("rejects decisions that don't match the hook schema", async () => {
    const input = createInput();
    const { run, token } = await startAndWaitForDecision(input);

    await expect(
      contactCvDecisionHook.resume(token, {
        decision: "maybe" as "approve",
        decidedAt: "2026-09-01T11:00:00.000Z",
      }),
    ).rejects.toThrow();
    await decide(token, "decline");
    await expect(run.returnValue).resolves.toMatchObject({ status: "declined" });
  });

  it("sends the reviewed CV once after approval and consumes the hook", async () => {
    resendResponses.push(() => Response.json({ id: "email-cv-1" }));
    const input = createInput();
    const { run, token } = await startAndWaitForDecision(input);

    await decide(token, "approve");
    await expect(run.returnValue).resolves.toEqual({
      status: "cv_sent",
      deliveryId: "email-cv-1",
      cvVersion: "2026-09",
      decidedAt: "2026-09-01T11:00:00.000Z",
    });

    expect(blobReads).toEqual([cvPathname]);
    expect(resendCalls).toHaveLength(1);
    const [call] = resendCalls;
    expect(call?.headers.get("Idempotency-Key")).toBe(`contact-cv/${input.enquiryId}/2026-09`);
    expect(call?.headers.get("Authorization")).toBe("Bearer re_test");
    expect(call?.body).toMatchObject({
      to: ["alex@example.com"],
      reply_to: "dave@example.com",
      attachments: [{ filename: "Dave-Hudson-CV.pdf", content: cvBytes.toString("base64") }],
    });

    // A second decision on the same token must not reach the workflow.
    await expect(decide(token, "approve")).rejects.toThrow();
    expect(resendCalls).toHaveLength(1);
  });

  it("expires without inventing a decision", async () => {
    const input = createInput();
    const { run, token, seenSleeps } = await startAndWaitForDecision(input);

    await getRun(run.runId).wakeUp({ correlationIds: [...seenSleeps] });
    await expect(run.returnValue).resolves.toEqual({ status: "expired" });
    await expect(resumeHook(token, { decision: "approve", decidedAt: "2026-09-01T11:00:00.000Z" })).rejects.toThrow();
    expect(blobReads).toEqual([]);
    expect(resendCalls).toEqual([]);
  });

  it("doesn't open a second review for an enquiry that is already waiting", async () => {
    const input = createInput();
    const first = await startAndWaitForDecision(input);

    const duplicate = await start(contractCvReviewWorkflow, [input]);
    await expect(duplicate.returnValue).resolves.toEqual({
      status: "already_waiting",
      runId: first.run.runId,
    });

    await decide(first.token, "decline");
    await expect(first.run.returnValue).resolves.toMatchObject({ status: "declined" });
  });

  it("retries a transient provider failure after a durable sleep and then sends", async () => {
    resendResponses.push(
      () => new Response(null, { status: 503 }),
      () => Response.json({ id: "email-cv-2" }),
    );
    const input = createInput();
    const { run, token, seenSleeps } = await startAndWaitForDecision(input);

    await decide(token, "approve");
    const retrySleep = await waitForNewSleep(run.runId, seenSleeps);
    expect(resendCalls).toHaveLength(1);
    await getRun(run.runId).wakeUp({ correlationIds: [retrySleep] });

    await expect(run.returnValue).resolves.toMatchObject({ status: "cv_sent", deliveryId: "email-cv-2" });
    expect(resendCalls).toHaveLength(2);
    // Both attempts carry the same provider idempotency key.
    expect(new Set(resendCalls.map((call) => call.headers.get("Idempotency-Key")))).toEqual(
      new Set([`contact-cv/${input.enquiryId}/2026-09`]),
    );
  });

  it("reports a recoverable failure to the owner after five transient failures", async () => {
    for (let attempt = 0; attempt < 5; attempt += 1) {
      resendResponses.push(() => new Response(null, { status: 429 }));
    }
    resendResponses.push(() => Response.json({ id: "owner-alert" }));
    const input = createInput();
    const { run, token, seenSleeps } = await startAndWaitForDecision(input);

    await decide(token, "approve");
    for (let wake = 0; wake < 4; wake += 1) {
      const retrySleep = await waitForNewSleep(run.runId, seenSleeps);
      await getRun(run.runId).wakeUp({ correlationIds: [retrySleep] });
    }

    await expect(run.returnValue).resolves.toEqual({ status: "delivery_failed", recoverable: true });
    expect(resendCalls).toHaveLength(6);
    const alert = resendCalls[5];
    expect(alert?.body).toMatchObject({ to: ["dave@example.com"] });
    expect(String(alert?.body.html)).toContain("remained unavailable after retries");
    expect(alert?.headers.get("Idempotency-Key")).toBe(`contact-cv-failure/${input.enquiryId}/2026-09`);
  });

  it("stops at a permanent provider rejection and alerts the owner without retrying", async () => {
    resendResponses.push(
      () => Response.json({ name: "validation_error" }, { status: 422 }),
      () => Response.json({ id: "owner-alert" }),
    );
    const input = createInput();
    const { run, token } = await startAndWaitForDecision(input);

    await decide(token, "approve");
    await expect(run.returnValue).resolves.toEqual({ status: "delivery_failed", recoverable: true });
    expect(resendCalls).toHaveLength(2);
    expect(resendCalls[1]?.body).toMatchObject({ to: ["dave@example.com"] });
    expect(String(resendCalls[1]?.body.html)).toContain("The CV delivery was rejected.");
  });

  it("never emails the visitor when the reviewed CV blob has gone", async () => {
    cvBlobStatus = 404;
    resendResponses.push(() => Response.json({ id: "owner-alert" }));
    const input = createInput();
    const { run, token } = await startAndWaitForDecision(input);

    await decide(token, "approve");
    await expect(run.returnValue).resolves.toEqual({ status: "delivery_failed", recoverable: true });
    expect(resendCalls).toHaveLength(1);
    expect(resendCalls[0]?.body).toMatchObject({ to: ["dave@example.com"] });
    expect(String(resendCalls[0]?.body.html)).toContain("The reviewed CV version is unavailable.");
  });

  it("does nothing for a non-contract enquiry", async () => {
    const input = createInput({
      draft: { ...createContactDraft({ route: "general" }), topic: "Hello", message: "Hi", replyName: "A", replyEmail: "a@example.com" },
    });
    const run = await start(contractCvReviewWorkflow, [input]);
    await expect(run.returnValue).resolves.toEqual({ status: "not_applicable" });
    expect(blobHeads).toEqual([]);
  });
});
