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

export const youtubeSchema = z
  .object({
    videoId: z
      .string()
      .regex(/^[A-Za-z0-9_-]{11}$/, "must be an 11-character YouTube video ID"),
    title: z.string().trim().min(8).max(160),
    channel: z.string().trim().min(1).max(80),
  })
  .strict();

export type YouTubeProps = z.infer<typeof youtubeSchema>;

// Product stories add approved blocks here. Keeping the registry explicit means
// article content cannot select an arbitrary React component.
export const richBlockSchemas = {
  "link-preview": linkPreviewSchema,
  youtube: youtubeSchema,
} satisfies RichBlockSchemaRegistry;
