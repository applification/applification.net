import { z } from "zod";

export const RICH_BLOCK_LANGUAGE = "rich-block";

const richBlockEnvelopeSchema = z
  .object({
    name: z
      .string()
      .trim()
      .regex(/^[a-z][a-z0-9-]*$/, {
        message: "must use a lowercase kebab-case name",
      }),
    props: z.unknown(),
  })
  .strict();

export type RichBlockSchemaRegistry = Record<string, z.ZodType>;

export type RichBlock = {
  name: string;
  props: unknown;
};

type LocatedRichBlock = {
  index: number;
  source: string;
};

// A fenced JSON object keeps article files valid Markdown without allowing JSX
// or raw HTML to become executable content.
const richBlockFencePattern =
  /^(`{3,}|~{3,})rich-block[^\S\r\n]*\r?\n([\s\S]*?)\r?\n\1[^\S\r\n]*$/gm;

function formatIssues(error: z.ZodError) {
  return error.issues
    .map((issue) => `${issue.path.join(".") || "block"}: ${issue.message}`)
    .join("; ");
}

function blockLocation(article: string, index: number, name?: string) {
  const block = name ? `rich block "${name}"` : "rich block";
  return `${article} (${block} ${index + 1})`;
}

function parseJson(source: string, article: string, index: number) {
  try {
    return JSON.parse(source) as unknown;
  } catch (error) {
    const detail = error instanceof Error ? error.message : "invalid JSON";
    throw new Error(
      `Invalid rich block in ${blockLocation(article, index)}: ${detail}`,
    );
  }
}

export function parseRichBlock(
  source: string,
  article: string,
  index: number,
  schemas: RichBlockSchemaRegistry,
): RichBlock {
  const envelope = richBlockEnvelopeSchema.safeParse(
    parseJson(source, article, index),
  );

  if (!envelope.success) {
    throw new Error(
      `Invalid rich block in ${blockLocation(article, index)}: ${formatIssues(envelope.error)}`,
    );
  }

  const schema = schemas[envelope.data.name];

  if (!schema) {
    throw new Error(
      `Invalid rich block in ${blockLocation(article, index, envelope.data.name)}: unknown block name`,
    );
  }

  const props = schema.safeParse(envelope.data.props);

  if (!props.success) {
    throw new Error(
      `Invalid rich block in ${blockLocation(article, index, envelope.data.name)}: ${formatIssues(props.error)}`,
    );
  }

  return { name: envelope.data.name, props: props.data };
}

export function findRichBlocks(markdown: string): LocatedRichBlock[] {
  return [...markdown.matchAll(richBlockFencePattern)].map((match, index) => ({
    index,
    source: match[2] ?? "",
  }));
}

export function validateRichBlocks(
  markdown: string,
  article: string,
  schemas: RichBlockSchemaRegistry,
) {
  return findRichBlocks(markdown).map(({ index, source }) =>
    parseRichBlock(source, article, index, schemas),
  );
}

export function stripRichBlocks(markdown: string) {
  return markdown.replace(richBlockFencePattern, "");
}
