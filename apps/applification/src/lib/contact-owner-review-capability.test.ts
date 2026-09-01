import { describe, expect, it } from "vitest";
import {
  createOwnerReviewCapability,
  verifyOwnerReviewCapability,
} from "./contact-owner-review-capability";

describe("owner review capability", () => {
  const secret = "owner-review-secret-longer-than-32-characters";
  const payload = {
    hookToken: "contact-cv-review:enquiry-1",
    enquiryId: "enquiry-1",
    expiresAt: 2_000,
  };

  it("round-trips a signed unexpired capability", () => {
    const token = createOwnerReviewCapability(payload, secret);
    expect(verifyOwnerReviewCapability(token, secret, 1_000)).toEqual(payload);
  });

  it("rejects forged, expired and weakly signed capabilities", () => {
    const token = createOwnerReviewCapability(payload, secret);
    expect(verifyOwnerReviewCapability(`${token}x`, secret, 1_000)).toBeNull();
    expect(verifyOwnerReviewCapability(token, secret, 2_000)).toBeNull();
    expect(verifyOwnerReviewCapability(token, "too-short", 1_000)).toBeNull();
  });

  it("refuses to create a capability with a weak secret", () => {
    expect(() => createOwnerReviewCapability(payload, "too-short")).toThrow(
      "Owner review capability signing is not configured.",
    );
  });
});
