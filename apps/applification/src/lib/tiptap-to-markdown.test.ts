import { describe, expect, it } from "vitest";
import { convertTipTapToMarkdown } from "./tiptap-to-markdown";

describe("convertTipTapToMarkdown", () => {
  it("converts the TipTap nodes used by the existing writing export", () => {
    const result = convertTipTapToMarkdown({
      type: "doc",
      content: [
        {
          type: "heading",
          attrs: { level: 2 },
          content: [{ type: "text", text: "A heading" }],
        },
        {
          type: "paragraph",
          content: [
            { type: "text", text: "Read " },
            {
              type: "text",
              text: "this",
              marks: [{ type: "bold" }, { type: "link", attrs: { href: "/writing" } }],
            },
          ],
        },
        {
          type: "bulletList",
          content: [
            {
              type: "listItem",
              content: [
                { type: "paragraph", content: [{ type: "text", text: "One" }] },
              ],
            },
          ],
        },
        {
          type: "codeBlock",
          attrs: { language: "ts" },
          content: [{ type: "text", text: "const ready = true;" }],
        },
      ],
    });

    expect(result.markdown).toContain("## A heading");
    expect(result.markdown).toContain("Read [**this**](/writing)");
    expect(result.markdown).toContain("- One");
    expect(result.markdown).toContain("```ts\nconst ready = true;\n```");
    expect(result.warnings).toEqual([]);
  });

  it("turns custom embeds into durable links", () => {
    const result = convertTipTapToMarkdown({
      type: "doc",
      content: [
        { type: "reactComponent", attrs: { src: "123" } },
        {
          type: "youtube",
          attrs: { src: "https://www.youtube.com/embed/abc123?feature=share" },
        },
      ],
    });

    expect(result.markdown).toContain("https://x.com/i/web/status/123");
    expect(result.markdown).toContain("https://www.youtube.com/watch?v=abc123");
  });
});
