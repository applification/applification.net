import { createHash } from "node:crypto";
import { z } from "zod";
import { contactDraftSchema, type ContactDraft } from "./contact-draft";
import { validateContactDraft } from "./contact-state";

export const contactDeliveryRequestSchema = z
  .object({
    consent: z.literal(true),
    draft: contactDraftSchema,
    idempotencyKey: z.string().uuid(),
    startedAt: z.number().int().positive(),
    website: z.string().max(0),
  })
  .strict();

type RateLimitEntry = { attempts: number[] };
const contactRateLimits = new Map<string, RateLimitEntry>();

export function validateDeliveryDraft(draft: ContactDraft) {
  const normalised = { ...draft };
  for (const [field, value] of Object.entries(normalised)) {
    if (typeof value === "string") {
      Object.assign(normalised, {
        [field]: value.trim().replace(/\s+/g, " "),
      });
    }
  }
  if (normalised.replyEmail) {
    normalised.replyEmail = normalised.replyEmail.toLowerCase();
  }

  const checked = contactDraftSchema.safeParse(normalised);
  if (!checked.success) {
    return { valid: false as const, message: "The reviewed brief is invalid." };
  }

  const validation = validateContactDraft(checked.data);
  if (!validation.valid) {
    return {
      valid: false as const,
      message: validation.issues[0]?.message ?? "Complete the reviewed brief before sending.",
    };
  }

  if (checked.data.briefLink && !isReviewedHttpsLink(checked.data.briefLink)) {
    return { valid: false as const, message: "The contract brief link must use HTTPS." };
  }

  return { valid: true as const, draft: checked.data };
}

export function checkContactAbuse({
  clientAddress,
  now = Date.now(),
  startedAt,
  website,
}: {
  clientAddress: string;
  now?: number;
  startedAt: number;
  website: string;
}) {
  if (website !== "") {
    return { allowed: false as const, reason: "bot" };
  }

  const age = now - startedAt;
  if (age < 1_500 || age > 24 * 60 * 60 * 1_000) {
    return { allowed: false as const, reason: "timing" };
  }

  const windowStart = now - 15 * 60 * 1_000;
  const key = createHash("sha256")
    .update(`${process.env.CONTACT_RATE_LIMIT_SECRET ?? "local-contact"}:${clientAddress}`)
    .digest("hex");
  const attempts = (contactRateLimits.get(key)?.attempts ?? []).filter(
    (attempt) => attempt >= windowStart,
  );

  if (attempts.length >= 5) {
    return { allowed: false as const, reason: "rate_limit" };
  }

  contactRateLimits.set(key, { attempts: [...attempts, now] });
  return { allowed: true as const };
}

export function deliveryPayloadDigest(value: unknown) {
  return createHash("sha256").update(JSON.stringify(value)).digest("hex");
}

function isReviewedHttpsLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
