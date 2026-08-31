import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { z } from "zod";
import { richBlockSchemas } from "./rich-block-registry";
import {
  stripRichBlocks,
  validateRichBlocks,
  type RichBlockSchemaRegistry,
} from "./rich-blocks";

const writingTypeSchema = z.enum(["post", "weeknote"]);

const dateSchema = z.preprocess(
  (value) =>
    value instanceof Date && !Number.isNaN(value.valueOf())
      ? value.toISOString().slice(0, 10)
      : value,
  z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "must use YYYY-MM-DD")
    .refine((value) => !Number.isNaN(Date.parse(`${value}T00:00:00Z`)), {
      message: "must be a real calendar date",
    }),
);

export const writingFrontmatterSchema = z.object({
  title: z.string().trim().min(1),
  date: dateSchema,
  updated: dateSchema.optional(),
  type: writingTypeSchema,
  summary: z.string().trim().min(1),
  topics: z.array(z.string().trim().min(1)).min(1),
  featured: z.boolean(),
  draft: z.boolean(),
  slug: z.string().trim().min(1).optional(),
  legacyId: z.string().trim().min(1).optional(),
});

export type WritingType = z.infer<typeof writingTypeSchema>;

export type WritingEntry = z.infer<typeof writingFrontmatterSchema> & {
  slug: string;
  body: string;
  readingTime: number;
};

export type GetWritingOptions = {
  includeDrafts?: boolean;
};

export type ParseWritingOptions = {
  richBlockSchemas?: RichBlockSchemaRegistry;
};

const contentDirectory = path.join(process.cwd(), "content", "writing");

function filenameSlug(filename: string) {
  return path.basename(filename, path.extname(filename));
}

function formatValidationError(filename: string, error: z.ZodError) {
  const details = error.issues
    .map(
      (issue) => `${issue.path.join(".") || "frontmatter"}: ${issue.message}`,
    )
    .join("; ");

  return `Invalid writing frontmatter in ${filename}: ${details}`;
}

export function deriveReadingTime(markdown: string) {
  const words = stripRichBlocks(markdown)
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/[\[\]#*_>`~()-]/g, " ")
    .trim()
    .split(/\s+/)
    .filter(Boolean).length;

  return Math.max(1, Math.ceil(words / 220));
}

export function parseWritingDocument(
  filename: string,
  source: string,
  options: ParseWritingOptions = {},
): WritingEntry {
  const parsed = matter(source);
  const result = writingFrontmatterSchema.safeParse(parsed.data);

  if (!result.success) {
    throw new Error(formatValidationError(filename, result.error));
  }

  const slug = result.data.slug ?? filenameSlug(filename);
  validateRichBlocks(
    parsed.content,
    filename,
    options.richBlockSchemas ?? richBlockSchemas,
  );

  return {
    ...result.data,
    slug,
    body: parsed.content.trim(),
    readingTime: deriveReadingTime(parsed.content),
  };
}

function readWritingFiles(directory = contentDirectory) {
  if (!fs.existsSync(directory)) {
    return [];
  }

  return fs
    .readdirSync(directory)
    .filter((filename) => /\.md$/i.test(filename))
    .map((filename) =>
      parseWritingDocument(
        filename,
        fs.readFileSync(path.join(directory, filename), "utf8"),
      ),
    );
}

export function getWriting(options: GetWritingOptions = {}) {
  const includeDrafts =
    options.includeDrafts ?? process.env.NODE_ENV !== "production";

  return readWritingFiles()
    .filter((entry) => includeDrafts || !entry.draft)
    .sort((left, right) => {
      const dateOrder = right.date.localeCompare(left.date);
      return dateOrder || left.title.localeCompare(right.title);
    });
}

export function getWritingBySlug(
  slug: string,
  options: GetWritingOptions = {},
) {
  return getWriting(options).find((entry) => entry.slug === slug);
}

export function getWritingTopics(options: GetWritingOptions = {}) {
  return [
    ...new Set(
      getWriting(options)
        .flatMap((entry) => entry.topics)
        .filter((topic) => topic !== "weeknote"),
    ),
  ].sort((left, right) => left.localeCompare(right));
}
