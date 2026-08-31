import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";
import { z } from "zod";
import { createMarkdownComponents } from "@/components/writing/writing-article";
import type { RichBlockRegistry } from "@/components/writing/rich-block";
import { deriveReadingTime, parseWritingDocument } from "./writing";

const calloutSchema = z
  .object({
    message: z.string().trim().min(1),
    tone: z.enum(["note", "warning"]),
  })
  .strict();

const registry: RichBlockRegistry = {
  schemas: { callout: calloutSchema },
  components: {
    callout: ({ message, tone }) => (
      <aside data-tone={String(tone)}>{String(message)}</aside>
    ),
  },
};

const frontmatter = `---
title: Rich writing
date: 2026-08-31
type: post
summary: A rich article.
topics:
  - writing
featured: false
draft: false
---`;

function richBlock(props: unknown, name = "callout") {
  return `\`\`\`rich-block
${JSON.stringify({ name, props }, null, 2)}
\`\`\``;
}

describe("typed rich blocks", () => {
  it("validates a named block while parsing a published Markdown article", () => {
    const entry = parseWritingDocument(
      "rich-writing.md",
      `${frontmatter}\n\nBefore.\n\n${richBlock({ message: "Mind the gap", tone: "warning" })}\n\nAfter.`,
      { richBlockSchemas: registry.schemas },
    );

    expect(entry.body).toContain("```rich-block");
    expect(entry.draft).toBe(false);
  });

  it("renders the registered component between ordinary Markdown paragraphs", () => {
    const markdown = `Before.\n\n${richBlock({ message: "A useful note", tone: "note" })}\n\nAfter.`;
    const html = renderToStaticMarkup(
      <ReactMarkdown
        components={createMarkdownComponents("rich-writing", registry)}
      >
        {markdown}
      </ReactMarkdown>,
    );

    expect(html).toContain(">Before.</p>");
    expect(html).toContain('<aside data-tone="note">A useful note</aside>');
    expect(html).toContain(">After.</p>");
    expect(html).not.toContain("<pre>");
  });

  it("identifies an unknown block and its article", () => {
    expect(() =>
      parseWritingDocument(
        "unknown.md",
        `${frontmatter}\n\n${richBlock({}, "surprise")}`,
        { richBlockSchemas: registry.schemas },
      ),
    ).toThrow(
      'Invalid rich block in unknown.md (rich block "surprise" 1): unknown block name',
    );
  });

  it("identifies invalid properties and their block", () => {
    expect(() =>
      parseWritingDocument(
        "invalid.md",
        `${frontmatter}\n\n${richBlock({ message: "Mind the gap", tone: "loud" })}`,
        { richBlockSchemas: registry.schemas },
      ),
    ).toThrow(
      'Invalid rich block in invalid.md (rich block "callout" 1): tone: Invalid option',
    );
  });

  it("excludes block names and properties from reading time", () => {
    const propertyWords = Array.from({ length: 440 }, () => "metadata").join(
      " ",
    );
    const markdown = `One prose word.\n\n${richBlock({ message: propertyWords, tone: "note" })}`;

    expect(deriveReadingTime(markdown)).toBe(1);
  });

  it("renders a durable link preview from stored properties without an image", () => {
    const markdown = richBlock(
      {
        destination: "https://unavailable.invalid/article",
        title: "Shape product work as a shared user journey",
        description: "Stored context for the reader.",
        siteName: "StoryLoop",
      },
      "link-preview",
    );

    const entry = parseWritingDocument(
      "link-preview.md",
      `${frontmatter}\n\n${markdown}`,
    );
    const html = renderToStaticMarkup(
      <ReactMarkdown components={createMarkdownComponents(entry.slug)}>
        {entry.body}
      </ReactMarkdown>,
    );

    expect(html.match(/<a\b/g)).toHaveLength(1);
    expect(html).toContain('data-rich-block="link-preview"');
    expect(html).toContain('href="https://unavailable.invalid/article"');
    expect(html).toContain("Shape product work as a shared user journey");
    expect(html).toContain("Stored context for the reader.");
    expect(html).toContain("unavailable.invalid");
    expect(html).not.toContain("<img");
  });

  it("rejects a remotely loaded preview image", () => {
    expect(() =>
      parseWritingDocument(
        "remote-image.md",
        `${frontmatter}\n\n${richBlock(
          {
            destination: "https://example.com/article",
            title: "Stored title",
            description: "Stored description.",
            siteName: "Example",
            image: {
              src: "https://example.com/live-image.jpg",
              alt: "Remote image",
              width: 1200,
              height: 630,
            },
          },
          "link-preview",
        )}`,
      ),
    ).toThrow("image.src: must be a site-local path captured during authoring");
  });

  it("renders a private YouTube placeholder and normal fallback link", () => {
    const markdown = richBlock(
      {
        videoId: "evCnOaVaOTo",
        title: "Node.js and its many, many new features with Matteo Collina",
        channel: "CodeTV",
      },
      "youtube",
    );

    const entry = parseWritingDocument(
      "node-22-experiments.md",
      `${frontmatter}\n\n${markdown}`,
    );
    const html = renderToStaticMarkup(
      <ReactMarkdown components={createMarkdownComponents(entry.slug)}>
        {entry.body}
      </ReactMarkdown>,
    );

    expect(html).toContain('data-rich-block="youtube"');
    expect(html).toContain("From CodeTV on YouTube.");
    expect(html).toContain("Play video");
    expect(html).toContain('href="https://www.youtube.com/watch?v=evCnOaVaOTo"');
    expect(html).not.toContain("youtube-nocookie.com");
    expect(html).not.toContain("<iframe");
  });

  it.each([
    "https://www.youtube.com/watch?v=evCnOaVaOTo",
    "evCnOaVaOT",
    "evCnOaVaOTo?",
  ])("rejects unsupported YouTube identifier %s", (videoId) => {
    expect(() =>
      parseWritingDocument(
        "invalid-youtube.md",
        `${frontmatter}\n\n${richBlock(
          {
            videoId,
            title: "A meaningful video title",
            channel: "CodeTV",
          },
          "youtube",
        )}`,
      ),
    ).toThrow("videoId: must be an 11-character YouTube video ID");
  });
});
