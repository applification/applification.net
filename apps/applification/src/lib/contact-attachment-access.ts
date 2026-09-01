import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const attachmentAccessPayloadSchema = z
  .object({
    pathname: z.string().startsWith("contact/unsubmitted/").max(1_024),
    filename: z.string().min(1).max(120),
    contentType: z.enum([
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ]),
    expiresAt: z.number().int().positive(),
  })
  .strict();

export type AttachmentAccessPayload = z.infer<typeof attachmentAccessPayloadSchema>;

export function createAttachmentAccessToken(
  payload: AttachmentAccessPayload,
  secret: string,
) {
  const checked = attachmentAccessPayloadSchema.parse(payload);
  const body = Buffer.from(JSON.stringify(checked)).toString("base64url");
  const signature = sign(body, secret);
  return `${body}.${signature}`;
}

export function verifyAttachmentAccessToken(token: string, secret: string) {
  const [body, suppliedSignature, extra] = token.split(".");
  if (!body || !suppliedSignature || extra) return null;

  const expectedSignature = sign(body, secret);
  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(expectedSignature);
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const checked = attachmentAccessPayloadSchema.safeParse(payload);
    if (!checked.success || checked.data.expiresAt < Date.now()) return null;
    return checked.data;
  } catch {
    return null;
  }
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}
