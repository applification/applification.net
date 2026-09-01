import { getHookByToken } from "workflow/api";
import { createAttachmentAccessToken } from "./contact-attachment-access";
import { contactCvReviewMetadataSchema } from "./contact-cv-review";
import { verifyOwnerReviewCapability } from "./contact-owner-review-capability";

type HookLookup = typeof getHookByToken;

export async function loadOwnerCvReview(
  capabilityToken: string,
  options: { now?: number; getHook?: HookLookup } = {},
) {
  const secret = process.env.CONTACT_OWNER_REVIEW_SECRET ?? "";
  const capability = verifyOwnerReviewCapability(
    capabilityToken,
    secret,
    options.now ?? Date.now(),
  );
  if (!capability) return null;

  try {
    const hook = await (options.getHook ?? getHookByToken)(capability.hookToken);
    const review = contactCvReviewMetadataSchema.safeParse(hook.metadata);
    if (!review.success || review.data.enquiryId !== capability.enquiryId) return null;

    return {
      review: review.data,
      attachmentUrl: createReviewAttachmentUrl(review.data),
      hookToken: capability.hookToken,
    };
  } catch {
    return null;
  }
}

function createReviewAttachmentUrl(
  review: Awaited<ReturnType<typeof contactCvReviewMetadataSchema.parse>>,
) {
  const attachment = review.draft.attachment;
  const secret = process.env.CONTACT_ATTACHMENT_ACCESS_SECRET;
  const baseUrl = process.env.CONTACT_PUBLIC_BASE_URL;
  if (!attachment || !secret || secret.length < 24 || !baseUrl) return null;

  const token = createAttachmentAccessToken(
    {
      pathname: attachment.pathname,
      filename: attachment.filename,
      contentType: attachment.contentType,
      expiresAt: Math.min(review.expiresAt, Date.now() + 60 * 60 * 1_000),
    },
    secret,
  );
  return `${baseUrl.replace(/\/$/, "")}/api/contact/attachment/download?token=${encodeURIComponent(token)}`;
}
