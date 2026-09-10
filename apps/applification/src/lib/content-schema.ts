import { z } from "zod";

export const contentTypes = ["client-work", "writing", "products"] as const;
export const contentTypeSchema = z.enum(contentTypes);
export const contentStatuses = ["live", "in-development", "research"] as const;
export const searchSiteInputSchema = z
  .strictObject({
    query: z
      .string()
      .trim()
      .max(200)
      .optional()
      .describe("Words to find in published content. Omit to list."),
    type: contentTypeSchema
      .optional()
      .describe("Restrict results to one content type."),
    topic: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .optional()
      .describe("Exact topic from a writing result, ignoring case."),
    status: z
      .enum(contentStatuses)
      .optional()
      .describe("Product availability filter."),
    after: z.iso
      .date()
      .optional()
      .describe("Writing published on or after YYYY-MM-DD."),
    before: z.iso
      .date()
      .optional()
      .describe("Writing published on or before YYYY-MM-DD."),
    limit: z
      .number()
      .int()
      .min(1)
      .max(10)
      .optional()
      .describe("Results per page, 1–10. Default 5."),
    offset: z
      .number()
      .int()
      .min(0)
      .max(10000)
      .optional()
      .describe("Pagination offset from nextOffset. Default 0."),
  })
  .refine(
    (input) => !input.after || !input.before || input.after <= input.before,
    {
      message: "after must be on or before before",
      path: ["after"],
    },
  );
export const readContentInputSchema = z.strictObject({
  type: contentTypeSchema,
  slug: z
    .string()
    .min(1)
    .max(180)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/),
  section: z
    .number()
    .int()
    .min(0)
    .max(10000)
    .optional()
    .describe(
      "Section index from the table of contents or nextSection. Default 0.",
    ),
});
export const publicContentErrorSchema = z.object({
  error: z.object({
    code: z
      .enum(["INVALID_QUERY", "NOT_FOUND", "METHOD_NOT_ALLOWED"])
      .describe("Stable machine-readable error code."),
    message: z.string().describe("What went wrong."),
    hint: z.string().describe("How to resolve or recover from the error."),
    docs: z.url().describe("Where the API is documented."),
  }),
});
export const contentSummarySchema = z.object({
  type: contentTypeSchema,
  slug: z.string(),
  title: z.string(),
  summary: z.string(),
  url: z.url(),
  topics: z.array(z.string()),
  date: z.string().optional(),
  updated: z.string().optional(),
  status: z.enum(contentStatuses).optional(),
});
export const searchSiteResponseSchema = z.object({
  results: z.array(contentSummarySchema),
  total: z.number(),
  nextOffset: z.number().nullable(),
});
export const readContentResponseSchema = contentSummarySchema.extend({
  sections: z.array(z.object({ index: z.number(), title: z.string() })),
  section: z.number(),
  content: z.string(),
  format: z.literal("markdown"),
  nextSection: z.number().nullable(),
  links: z.array(z.object({ label: z.string(), url: z.url() })),
});
export type ContentSummary = z.infer<typeof contentSummarySchema>;
export type PublicContent = ContentSummary & {
  sections: Array<{ title: string; content: string }>;
  links: Array<{ label: string; url: string }>;
};
