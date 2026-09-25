import { afterEach, describe, expect, it, vi } from "vitest";
import {
  contactAttachmentOwnerFolder,
  getContactAttachmentOwnerSecret,
  isOwnedContactAttachment,
} from "./contact-attachment-owner";
import { deleteContactAttachmentSchema } from "./contact-attachment";

const secret = "attachment-owner-secret-for-tests";
const session = "ea7735e0-5e9c-4ea0-9486-183223a26700";
const otherSession = "0b1c2d3e-4f50-4a61-8b72-9c83d4e5f607";

describe("contact attachment ownership", () => {
  afterEach(() => vi.unstubAllEnvs());

  it("accepts uploads stored under the uploading session's folder", () => {
    const pathname = `${contactAttachmentOwnerFolder(session, secret)}/Role brief-AbC123.pdf`;
    expect(isOwnedContactAttachment(pathname, session, secret)).toBe(true);
    expect(deleteContactAttachmentSchema.safeParse({ pathname }).success).toBe(true);
  });

  it("rejects another session, another secret and legacy flat pathnames", () => {
    const pathname = `${contactAttachmentOwnerFolder(session, secret)}/role.docx`;
    expect(isOwnedContactAttachment(pathname, otherSession, secret)).toBe(false);
    expect(isOwnedContactAttachment(pathname, session, `${secret}-rotated`)).toBe(false);
    expect(isOwnedContactAttachment("contact/unsubmitted/role.pdf", session, secret)).toBe(false);
  });

  it("rejects traversal, encoded and nested pathnames", () => {
    const folder = contactAttachmentOwnerFolder(session, secret);
    for (const pathname of [
      `${folder}/../cv/dave-hudson.pdf`,
      `${folder}/%2e%2e/cv.pdf`,
      `${folder}/nested/role.pdf`,
      `${folder}/role.exe`,
      "contact/cv/dave-hudson.pdf",
    ]) {
      expect(isOwnedContactAttachment(pathname, session, secret)).toBe(false);
      expect(deleteContactAttachmentSchema.safeParse({ pathname }).success).toBe(false);
    }
  });

  it("fails closed in production without a long enough secret", () => {
    vi.stubEnv("NODE_ENV", "production");
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", "too-short");
    expect(getContactAttachmentOwnerSecret()).toBeNull();
    vi.stubEnv("CONTACT_ATTACHMENT_ACCESS_SECRET", secret);
    expect(getContactAttachmentOwnerSecret()).toBe(secret);
  });
});
