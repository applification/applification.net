import { createHmac, timingSafeEqual } from "node:crypto";
import { z } from "zod";

const ownerReviewCapabilitySchema = z
  .object({
    hookToken: z.string().startsWith("contact-cv-review:").max(200),
    enquiryId: z.string().min(1).max(120),
    expiresAt: z.number().int().positive(),
  })
  .strict();

export type OwnerReviewCapability = z.infer<typeof ownerReviewCapabilitySchema>;

export function createOwnerReviewCapability(
  payload: OwnerReviewCapability,
  secret: string,
) {
  assertReviewSecret(secret);
  const checked = ownerReviewCapabilitySchema.parse(payload);
  const body = Buffer.from(JSON.stringify(checked)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifyOwnerReviewCapability(
  token: string,
  secret: string,
  now = Date.now(),
) {
  if (secret.length < 32) return null;
  const [body, suppliedSignature, extra] = token.split(".");
  if (!body || !suppliedSignature || extra) return null;

  const supplied = Buffer.from(suppliedSignature);
  const expected = Buffer.from(sign(body, secret));
  if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) {
    return null;
  }

  try {
    const payload: unknown = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
    const checked = ownerReviewCapabilitySchema.safeParse(payload);
    if (!checked.success || checked.data.expiresAt <= now) return null;
    return checked.data;
  } catch {
    return null;
  }
}

function assertReviewSecret(secret: string) {
  if (secret.length < 32) {
    throw new Error("Owner review capability signing is not configured.");
  }
}

function sign(value: string, secret: string) {
  return createHmac("sha256", secret).update(value).digest("base64url");
}
