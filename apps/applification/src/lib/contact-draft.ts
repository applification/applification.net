import { z } from "zod";
import {
  contactProducts,
  contactRoutes,
  parseContactProduct,
  type ContactRoute,
} from "./contact";

const optionalContactText = z.string().trim().max(500).nullable().optional();

export const contactDraftSchema = z
  .object({
    version: z.number().int().nonnegative(),
    route: z.enum(contactRoutes).nullable(),
    summary: z.string().max(500).optional(),
    replyName: z.string().max(120).optional(),
    replyEmail: z.string().max(254).optional(),
    company: z.string().max(160).optional(),
    need: z.string().max(500).optional(),
    timing: z.string().max(160).optional(),
    workingArrangement: z.string().max(160).optional(),
    briefLink: z.string().max(2_048).optional(),
    product: z.enum(contactProducts).optional(),
    question: z.string().max(500).optional(),
    context: z.string().max(500).optional(),
    topic: z.string().max(160).optional(),
    message: z.string().max(500).optional(),
    attachment: z
      .object({
        pathname: z.string().min(1).max(1_024),
        filename: z.string().min(1).max(120),
        contentType: z.enum([
          "application/pdf",
          "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        ]),
        size: z.number().int().positive().max(4 * 1_024 * 1_024),
      })
      .strict()
      .optional(),
  })
  .strict();

export const contactPatchFieldsSchema = z
  .object({
    summary: optionalContactText,
    replyName: optionalContactText,
    replyEmail: optionalContactText,
    company: optionalContactText,
    need: optionalContactText,
    timing: optionalContactText,
    workingArrangement: optionalContactText,
    briefLink: optionalContactText,
    product: z.enum(contactProducts).nullable().optional(),
    question: optionalContactText,
    context: optionalContactText,
    topic: optionalContactText,
    message: optionalContactText,
  })
  .strict();

export const contactProposalSchema = z
  .object({
    baseVersion: z.number().int().nonnegative(),
    route: z.enum(contactRoutes).nullable().optional(),
    changes: contactPatchFieldsSchema,
  })
  .strict();

export const contactPrepareRequestSchema = z
  .object({
    draft: contactDraftSchema,
    message: z.string().trim().min(1).max(4_000),
  })
  .strict();

export type ContactDraft = z.infer<typeof contactDraftSchema>;
export type ContactProposal = z.infer<typeof contactProposalSchema>;

const commonFields = new Set(["summary", "replyName", "replyEmail"]);
const routeFields: Record<ContactRoute, Set<keyof ContactProposal["changes"]>> = {
  contract: new Set(["company", "need", "timing", "workingArrangement", "briefLink"]),
  product: new Set(["product", "question", "context"]),
  general: new Set(["topic", "message"]),
};

export function createContactDraft({
  product,
  route,
}: {
  product?: string;
  route: ContactRoute | null;
}): ContactDraft {
  return {
    version: 0,
    route,
    ...(route === "product" && parseContactProduct(product)
      ? { product: parseContactProduct(product) ?? undefined }
      : {}),
  };
}

export function changeContactRoute(
  draft: ContactDraft,
  route: ContactRoute,
): ContactDraft {
  if (draft.route === route) {
    return draft;
  }

  const next: ContactDraft = {
    version: draft.version + 1,
    route,
  };

  for (const field of commonFields) {
    const value = draft[field as keyof ContactDraft];
    if (typeof value === "string") {
      Object.assign(next, { [field]: value });
    }
  }

  return next;
}

export function setContactAttachment(
  draft: ContactDraft,
  attachment: ContactDraft["attachment"] | null,
): ContactDraft {
  const next = { ...draft, version: draft.version + 1 };

  if (attachment) {
    next.attachment = attachment;
  } else {
    delete next.attachment;
  }

  return next;
}

export function getMissingContactFields(draft: ContactDraft) {
  if (!draft.route) {
    return ["route"];
  }

  const required: Record<ContactRoute, Array<keyof ContactDraft>> = {
    contract: [
      "company",
      "need",
      "timing",
      "workingArrangement",
      "replyName",
      "replyEmail",
    ],
    product: ["product", "question", "replyName", "replyEmail"],
    general: ["topic", "message", "replyName", "replyEmail"],
  };

  return required[draft.route].filter((field) => {
    const value = draft[field];
    return typeof value !== "string" || value.trim() === "";
  });
}

export function applyContactProposal(
  draft: ContactDraft,
  input: unknown,
):
  | { accepted: true; draft: ContactDraft }
  | { accepted: false; reason: "invalid" | "stale" | "conflicting" } {
  const parsed = contactProposalSchema.safeParse(input);

  if (!parsed.success) {
    return { accepted: false, reason: "invalid" };
  }

  const proposal = parsed.data;
  if (proposal.baseVersion !== draft.version) {
    return { accepted: false, reason: "stale" };
  }

  const effectiveRoute = proposal.route === undefined ? draft.route : proposal.route;
  if (!patchFitsRoute(proposal.changes, effectiveRoute)) {
    return { accepted: false, reason: "conflicting" };
  }

  const next =
    effectiveRoute && effectiveRoute !== draft.route
      ? changeContactRoute(draft, effectiveRoute)
      : { ...draft };

  next.route = effectiveRoute;
  next.version = draft.version + 1;

  for (const [field, value] of Object.entries(proposal.changes)) {
    if (value === null || value.trim() === "") {
      delete next[field as keyof ContactDraft];
      continue;
    }

    if (field === "briefLink" && !isReviewedHttpsLink(value)) {
      return { accepted: false, reason: "invalid" };
    }

    Object.assign(next, { [field]: normaliseField(field, value) });
  }

  const checked = contactDraftSchema.safeParse(next);
  if (!checked.success) {
    return { accepted: false, reason: "invalid" };
  }

  return {
    accepted: true,
    draft: checked.data,
  };
}

function patchFitsRoute(
  changes: ContactProposal["changes"],
  route: ContactRoute | null,
) {
  const populatedFields = Object.entries(changes)
    .filter(([, value]) => value !== null && value !== undefined && value.trim() !== "")
    .map(([field]) => field);

  if (populatedFields.every((field) => commonFields.has(field))) {
    return true;
  }

  if (!route) {
    return false;
  }

  return populatedFields.every(
    (field) => commonFields.has(field) || routeFields[route].has(field as keyof ContactProposal["changes"]),
  );
}

function normaliseField(field: string, value: string) {
  const normalised = normaliseText(value);

  if (field === "replyEmail") {
    return normalised.toLowerCase();
  }

  return normalised;
}

function normaliseText(value: string) {
  return value.trim().replace(/\s+/g, " ");
}

function isReviewedHttpsLink(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "https:" && !url.username && !url.password;
  } catch {
    return false;
  }
}
