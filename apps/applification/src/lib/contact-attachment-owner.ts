import { createHmac, timingSafeEqual } from "node:crypto";

// Uploads live under a folder derived from the uploading browser session, so
// only that session can delete or send them. The session UUID never leaves the
// visitor's browser and the HMAC stops anyone guessing the folder from it.
const ownedPathnamePattern =
  /^contact\/unsubmitted\/([0-9a-f]{32})\/([\p{L}\p{N} ._()-]+\.(?:pdf|docx))$/iu;

export function getContactAttachmentOwnerSecret() {
  const secret = process.env.CONTACT_ATTACHMENT_ACCESS_SECRET;
  if (secret && secret.length >= 24) return secret;
  // Production fails closed; local development and tests get a fixed key.
  return process.env.NODE_ENV === "production" ? null : "local-contact-attachment-owner";
}

export function contactAttachmentOwnerFolder(session: string, secret: string) {
  return `contact/unsubmitted/${ownerTag(session, secret)}`;
}

export function isOwnedContactAttachment(pathname: string, session: string, secret: string) {
  const match = ownedPathnamePattern.exec(pathname);
  if (!match?.[1]) return false;
  const supplied = Buffer.from(match[1].toLowerCase());
  const expected = Buffer.from(ownerTag(session, secret));
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function ownerTag(session: string, secret: string) {
  return createHmac("sha256", secret)
    .update(`contact-attachment-owner:${session.toLowerCase()}`)
    .digest("hex")
    .slice(0, 32);
}
