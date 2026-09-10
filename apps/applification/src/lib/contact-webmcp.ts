import { z } from "zod";
import { contactRoutes } from "./contact";
import {
  contactPatchFieldsSchema,
  applyContactProposal,
  type ContactDraft,
} from "./contact-draft";
import { validateContactDraft } from "./contact-state";

// No consent, delivery, session, attachment or owner-review fields are accepted.
export const fillContactInputSchema = z.strictObject({
  route: z.enum(contactRoutes),
  fields: contactPatchFieldsSchema,
  expectedVersion: z.number().int().nonnegative().optional(),
});

export function fillContactDraft(draft: ContactDraft, input: unknown) {
  const parsed = fillContactInputSchema.safeParse(input);
  if (!parsed.success)
    return {
      ok: false as const,
      error: {
        code: "INVALID_INPUT",
        message: parsed.error.issues
          .map((i) => `${i.path.join(".")}: ${i.message}`)
          .join("; "),
      },
    };
  const { route, fields, expectedVersion } = parsed.data;
  if (expectedVersion !== undefined && expectedVersion !== draft.version) {
    return {
      ok: false as const,
      error: {
        code: "STALE_DRAFT",
        message:
          "The visitor changed the draft. Review the form before trying again.",
      },
    };
  }
  if (draft.route && draft.route !== route) {
    return {
      ok: false as const,
      error: {
        code: "CONFLICT",
        message:
          "The form has a different enquiry type. Ask the visitor to change it or restart.",
      },
    };
  }
  // Validate route-specific fields before changing the visible draft.
  const applied = applyContactProposal(draft, {
    baseVersion: draft.version,
    route,
    changes: fields,
  });
  if (!applied.accepted)
    return {
      ok: false as const,
      error: {
        code: "INVALID_INPUT",
        message:
          "Use fields for the selected enquiry type and valid HTTPS brief links.",
      },
    };
  const normalise = (value: unknown, key: string) => {
    const text =
      typeof value === "string" ? value.trim().replace(/\s+/g, " ") : value;
    return key === "replyEmail" && typeof text === "string"
      ? text.toLowerCase()
      : text;
  };
  const conflicts = Object.keys(fields).filter((key) => {
    const previous = draft[key as keyof ContactDraft];
    return (
      previous &&
      normalise(previous, key) !==
        normalise(applied.draft[key as keyof ContactDraft], key)
    );
  });
  if (conflicts.length)
    return {
      ok: false as const,
      error: {
        code: "CONFLICT",
        message: `Existing fields are preserved: ${conflicts.join(", ")}. The visitor can edit them in the form.`,
      },
    };
  // Equivalent repeated input keeps the original visitor formatting and version.
  for (const key of Object.keys(fields)) {
    const previous = draft[key as keyof ContactDraft];
    if (previous) Object.assign(applied.draft, { [key]: previous });
  }
  const changedFields = Object.keys(fields).filter(
    (key) =>
      draft[key as keyof ContactDraft] !==
      applied.draft[key as keyof ContactDraft],
  );
  const next =
    !changedFields.length && route === draft.route ? draft : applied.draft;
  const validation = validateContactDraft(next);
  return {
    ok: true as const,
    draft: next,
    result: {
      status: validation.valid ? "ready_for_review" : "needs_details",
      draftVersion: next.version,
      changedFields,
      missingFields: validation.missingFields,
      issues: validation.issues,
      reviewRequired: true,
      sent: false,
      nextStep: validation.valid
        ? "The visitor can review the enquiry in the form, then choose whether to send."
        : "Complete the missing or invalid fields in the form before review.",
    },
  };
}
