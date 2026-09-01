import { describe, expect, it } from "vitest";
import {
  createAttachmentAccessToken,
  verifyAttachmentAccessToken,
} from "./contact-attachment-access";

describe("private attachment access", () => {
  const payload = {
    pathname: "contact/unsubmitted/brief-abc.pdf",
    filename: "brief.pdf",
    contentType: "application/pdf" as const,
    expiresAt: Date.now() + 60_000,
  };

  it("round-trips an authenticated, expiring reference", () => {
    const token = createAttachmentAccessToken(payload, "a-long-test-secret");
    expect(verifyAttachmentAccessToken(token, "a-long-test-secret")).toEqual(payload);
  });

  it("rejects tampering and expiry", () => {
    const token = createAttachmentAccessToken(payload, "a-long-test-secret");
    expect(verifyAttachmentAccessToken(`${token}x`, "a-long-test-secret")).toBeNull();

    const expired = createAttachmentAccessToken(
      { ...payload, expiresAt: Date.now() - 1 },
      "a-long-test-secret",
    );
    expect(verifyAttachmentAccessToken(expired, "a-long-test-secret")).toBeNull();
  });
});
