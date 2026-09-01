import { z } from "zod";
import { contactDraftSchema, type ContactDraft } from "./contact-draft";

export const contactCvDecisionSchema = z
  .object({
    decision: z.enum(["approve", "decline"]),
    decidedAt: z.string().datetime(),
  })
  .strict();

export const contactCvReviewMetadataSchema = z
  .object({
    kind: z.literal("contract_cv_review"),
    enquiryId: z.string().min(1).max(120),
    idempotencyKey: z.string().uuid(),
    draft: contactDraftSchema.refine((draft) => draft.route === "contract"),
    delivery: z
      .object({
        deliveryId: z.string().min(1).max(200),
        deliveredAt: z.string().datetime(),
      })
      .strict(),
    cv: z
      .object({
        pathname: z.string().startsWith("contact/cv/").max(1_024),
        filename: z.string().min(1).max(120),
        contentType: z.literal("application/pdf"),
        size: z.number().int().positive().max(8 * 1_024 * 1_024),
        version: z.string().min(1).max(80),
      })
      .strict(),
    expiresAt: z.number().int().positive(),
    signals: z.array(
      z
        .object({
          tone: z.enum(["context", "caution"]),
          label: z.string().min(1).max(100),
          detail: z.string().min(1).max(240),
        })
        .strict(),
    ),
  })
  .strict();

export type ContactCvDecision = z.infer<typeof contactCvDecisionSchema>;
export type ContactCvReviewMetadata = z.infer<typeof contactCvReviewMetadataSchema>;

export function assessContractSignals(draft: ContactDraft) {
  if (draft.route !== "contract") return [];

  const signals: ContactCvReviewMetadata["signals"] = [];
  const emailDomain = draft.replyEmail?.split("@")[1]?.toLowerCase();
  const commonPersonalDomains = new Set([
    "gmail.com",
    "hotmail.com",
    "icloud.com",
    "outlook.com",
    "proton.me",
    "yahoo.com",
  ]);

  if (emailDomain && !commonPersonalDomains.has(emailDomain)) {
    signals.push({
      tone: "context",
      label: "Organisation email supplied",
      detail: `The reply address uses ${emailDomain}. This is context, not proof of identity.`,
    });
  } else {
    signals.push({
      tone: "caution",
      label: "Personal email domain",
      detail: "The reply address uses a common personal email provider. Verify the sender independently.",
    });
  }

  if (draft.briefLink || draft.attachment) {
    signals.push({
      tone: "context",
      label: "Contract brief supplied",
      detail: draft.attachment
        ? "A private document accompanied the enquiry. Review it before deciding."
        : "An HTTPS contract link accompanied the enquiry. Check its destination independently.",
    });
  } else {
    signals.push({
      tone: "caution",
      label: "No contract brief supplied",
      detail: "The enquiry has no supporting link or document. Ask for the brief if the role is unclear.",
    });
  }

  if ((draft.need?.trim().length ?? 0) < 40) {
    signals.push({
      tone: "caution",
      label: "Limited role detail",
      detail: "The stated need is brief. Confirm scope, organisation and hiring authority before sharing the CV.",
    });
  }

  return signals;
}

export function contactReviewRows(draft: ContactDraft): Array<[string, string]> {
  const rows: Array<[string, string | undefined]> = [
    ["Company or agency", draft.company],
    ["Role or project need", draft.need],
    ["Timing", draft.timing],
    ["Working arrangement", draft.workingArrangement],
    ["Summary", draft.summary],
    ["Sender", draft.replyName],
    ["Reply address", draft.replyEmail],
    ["Contract brief link", draft.briefLink],
    ["Private document", draft.attachment?.filename],
  ];

  return rows.filter((row): row is [string, string] => Boolean(row[1]));
}
