import { defineHook, sleep } from "workflow";
import {
  contactCvDecisionSchema,
  contactCvReviewMetadataSchema,
  type ContactCvReviewMetadata,
} from "@/lib/contact-cv-review";

export const contactCvDecisionHook = defineHook({ schema: contactCvDecisionSchema });

export function contactCvHookToken(enquiryId: string) {
  return `contact-cv-review:${enquiryId}`;
}

/** Minimal gate kept alongside production hook definitions so Workflow's test
 * compiler can exercise the exact hook schema, token and disposal semantics. */
export async function contactCvDecisionGateWorkflow(review: ContactCvReviewMetadata) {
  "use workflow";

  const checked = contactCvReviewMetadataSchema.parse(review);
  using decisionHook = contactCvDecisionHook.create({
    token: contactCvHookToken(checked.enquiryId),
    metadata: checked,
  });
  const decision = await Promise.race([
    decisionHook,
    sleep(new Date(checked.expiresAt)).then(() => ({ expired: true }) as const),
  ]);
  decisionHook.dispose();
  if ("expired" in decision) return { status: "expired" as const };
  return { status: decision.decision, decidedAt: decision.decidedAt };
}
