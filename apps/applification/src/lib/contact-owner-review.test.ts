import { afterEach, describe, expect, it, vi } from "vitest";
import { createContactDraft } from "./contact-draft";
import { loadOwnerCvReview } from "./contact-owner-review";
import { createOwnerReviewCapability } from "./contact-owner-review-capability";

describe("loading the private owner review", () => {
  const secret = "owner-review-secret-longer-than-32-characters";
  const capabilityPayload = {
    hookToken: "contact-cv-review:enquiry-1",
    enquiryId: "enquiry-1",
    expiresAt: 2_000,
  };
  const review = {
    kind: "contract_cv_review" as const,
    enquiryId: "enquiry-1",
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
    expiresAt: 2_000,
    signals: [],
  };

  afterEach(() => vi.unstubAllEnvs());

  it("loads a live hook without resuming it", async () => {
    vi.stubEnv("CONTACT_OWNER_REVIEW_SECRET", secret);
    const getHook = vi.fn().mockResolvedValue({ metadata: review });
    const capability = createOwnerReviewCapability(capabilityPayload, secret);

    await expect(loadOwnerCvReview(capability, { now: 1_000, getHook })).resolves.toEqual({
      review,
      attachmentUrl: null,
      hookToken: "contact-cv-review:enquiry-1",
    });
    expect(getHook).toHaveBeenCalledOnce();
  });

  it("rejects forged, expired, stale and mismatched capabilities", async () => {
    vi.stubEnv("CONTACT_OWNER_REVIEW_SECRET", secret);
    const capability = createOwnerReviewCapability(capabilityPayload, secret);
    const getHook = vi.fn().mockResolvedValue({ metadata: review });

    await expect(loadOwnerCvReview(`${capability}x`, { now: 1_000, getHook })).resolves.toBeNull();
    await expect(loadOwnerCvReview(capability, { now: 2_000, getHook })).resolves.toBeNull();
    await expect(
      loadOwnerCvReview(capability, {
        now: 1_000,
        getHook: vi.fn().mockRejectedValue(new Error("consumed")),
      }),
    ).resolves.toBeNull();
    await expect(
      loadOwnerCvReview(capability, {
        now: 1_000,
        getHook: vi.fn().mockResolvedValue({ metadata: { ...review, enquiryId: "other" } }),
      }),
    ).resolves.toBeNull();
  });
});
