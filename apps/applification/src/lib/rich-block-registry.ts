import { z } from "zod";
import type { RichBlockSchemaRegistry } from "./rich-blocks";

const localImagePathSchema = z
  .string()
  .trim()
  .regex(/^\/(?!\/)/, "must be a site-local path captured during authoring");

export const linkPreviewSchema = z
  .object({
    destination: z
      .string()
      .url()
      .refine((value) => /^(https?):/.test(value), {
        message: "must use an http or https destination",
      }),
    title: z.string().trim().min(1).max(160),
    description: z.string().trim().min(1).max(320),
    siteName: z.string().trim().min(1).max(80),
    image: z
      .object({
        src: localImagePathSchema,
        alt: z.string().trim().max(180),
        width: z.number().int().positive(),
        height: z.number().int().positive(),
      })
      .strict()
      .optional(),
  })
  .strict();

export type LinkPreviewProps = z.infer<typeof linkPreviewSchema>;

// Product stories add approved blocks here. Keeping the registry explicit means
// article content cannot select an arbitrary React component.
export const richBlockSchemas = {
  "link-preview": linkPreviewSchema,
} satisfies RichBlockSchemaRegistry;
