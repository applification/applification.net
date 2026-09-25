import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "@/lib/contact-draft";
import { contactCvDecisionSchema } from "@/lib/contact-cv-review";
import { createOwnerReviewCapability } from "@/lib/contact-owner-review-capability";

const mocks = vi.hoisted(() => ({ getHookByToken: vi.fn(), resume: vi.fn() }));
vi.mock("workflow/api", () => ({ getHookByToken: mocks.getHookByToken }));
// The route resumes through the workflow's typed hook; its resume() is the only
// side effect that reaches the paused workflow.
vi.mock("@/workflows/contact-delivery", () => ({
  contactCvDecisionHook: { resume: mocks.resume },
}));

import { POST } from "./route";

const secret = "owner-review-secret-longer-than-32-characters";
const enquiryId = "enquiry-1";
const hookToken = `contact-cv-review:${enquiryId}`;

const review = {
  kind: "contract_cv_review" as const,
  enquiryId,
  idempotencyKey: "2ec60daf-1ca9-49ea-88d3-d5c05d01aabd",
  draft: {
    ...createContactDraft({ route: "contract" }),
    company: "Example Ltd",
    need: "A senior React engineer for an AI product workflow.",
    timing: "October",
    workingArrangement: "Remote UK",
    replyName: "Alex",
    replyEmail: "alex@example.com",
  },
  delivery: { deliveryId: "email-1", deliveredAt: "2026-09-01T10:00:00.000Z" },
  cv: {
    pathname: "contact/cv/dave-hudson.pdf",
    filename: "Dave-Hudson-CV.pdf",
    contentType: "application/pdf" as const,
    size: 100,
    version: "2026-09",
  },
  expiresAt: Date.now() + 60 * 60 * 1_000,
  signals: [],
};

function capability(overrides: { expiresAt?: number; enquiryId?: string } = {}, signingSecret = secret) {
  return createOwnerReviewCapability(
    {
      hookToken,
      enquiryId: overrides.enquiryId ?? enquiryId,
      expiresAt: overrides.expiresAt ?? Date.now() + 60_000,
    },
    signingSecret,
  );
}

function decide(fields: Record<string, string>) {
  const form = new FormData();
  for (const [key, value] of Object.entries(fields)) form.set(key, value);
  return POST(
    new Request("https://example.com/api/contact/cv-review", { method: "POST", body: form }),
  );
}

describe("owner CV decision", () => {
  beforeEach(() => {
    vi.stubEnv("CONTACT_OWNER_REVIEW_SECRET", secret);
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", undefined);
    mocks.getHookByToken.mockResolvedValue({ token: hookToken, metadata: review });
    mocks.resume.mockResolvedValue({ token: hookToken });
  });
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetAllMocks();
  });

  it("resumes the paused review with an explicit, confirmed approval and redirects", async () => {
    const response = await decide({ capability: capability(), decision: "approve", confirm: "yes" });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://example.com/contact/review/complete?decision=approve",
    );
    expect(mocks.getHookByToken).toHaveBeenCalledWith(hookToken);
    expect(mocks.resume).toHaveBeenCalledOnce();
    const [resumedToken, payload] = mocks.resume.mock.calls[0]!;
    expect(resumedToken).toBe(hookToken);
    expect(contactCvDecisionSchema.parse(payload)).toEqual({
      decision: "approve",
      decidedAt: expect.any(String),
    });
  });

  it("records a decline without requiring confirmation", async () => {
    const response = await decide({ capability: capability(), decision: "decline" });

    expect(response.status).toBe(303);
    expect(response.headers.get("location")).toBe(
      "https://example.com/contact/review/complete?decision=decline",
    );
    expect(mocks.resume.mock.calls[0]![1]).toMatchObject({ decision: "decline" });
  });

  it.each([
    ["approval without confirmation", { decision: "approve" }],
    ["approval with the wrong confirmation", { decision: "approve", confirm: "YES" }],
    ["an unknown decision", { decision: "maybe", confirm: "yes" }],
  ])("refuses %s before looking up the review", async (_label, fields) => {
    const response = await decide({ capability: capability(), ...fields });

    expect(response.status).toBe(400);
    expect((await response.json()).message).toBe("Confirm the exact CV decision.");
    expect(mocks.getHookByToken).not.toHaveBeenCalled();
    expect(mocks.resume).not.toHaveBeenCalled();
  });

  it("refuses a missing capability or a body that isn't a form", async () => {
    expect((await decide({ decision: "decline" })).status).toBe(400);

    const json = await POST(
      new Request("https://example.com/api/contact/cv-review", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ capability: capability(), decision: "decline" }),
      }),
    );
    expect(json.status).toBe(400);
    expect(mocks.resume).not.toHaveBeenCalled();
  });

  it("refuses a forged, expired or mismatched capability as gone", async () => {
    const forged = await decide({
      capability: capability({}, "another-secret-that-is-longer-than-32-chars"),
      decision: "decline",
    });
    expect(forged.status).toBe(410);

    const expired = await decide({ capability: capability({ expiresAt: Date.now() - 1 }), decision: "decline" });
    expect(expired.status).toBe(410);

    const mismatched = await decide({
      capability: capability({ enquiryId: "enquiry-2" }),
      decision: "decline",
    });
    expect(mismatched.status).toBe(410);
    expect((await mismatched.json()).message).toMatch(/expired, invalid or already used/);

    expect(mocks.resume).not.toHaveBeenCalled();
  });

  it("refuses when the server has no review secret", async () => {
    vi.stubEnv("CONTACT_OWNER_REVIEW_SECRET", undefined);
    const response = await decide({ capability: capability(), decision: "decline" });

    expect(response.status).toBe(410);
    expect(mocks.getHookByToken).not.toHaveBeenCalled();
  });

  it("refuses as gone once the hook no longer exists", async () => {
    mocks.getHookByToken.mockRejectedValue(new Error("hook not found"));
    const response = await decide({ capability: capability(), decision: "approve", confirm: "yes" });

    expect(response.status).toBe(410);
    expect(mocks.resume).not.toHaveBeenCalled();
  });

  it("reports a conflict without a second action when the hook was already resumed", async () => {
    mocks.resume.mockRejectedValue(new Error("hook already received"));
    const response = await decide({ capability: capability(), decision: "approve", confirm: "yes" });

    expect(response.status).toBe(409);
    expect((await response.json()).message).toMatch(/already recorded/);
    expect(response.headers.get("location")).toBeNull();
  });
});
