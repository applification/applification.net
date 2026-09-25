import { renderToStaticMarkup } from "react-dom/server";
import ReactMarkdown from "react-markdown";
import { describe, expect, it } from "vitest";
import {
  articleVideoPosterSource,
  createMarkdownComponents,
  isArticleVideoSource,
} from "./writing-article";

function render(markdown: string) {
  return renderToStaticMarkup(
    <ReactMarkdown components={createMarkdownComponents("media-test")}>
      {markdown}
    </ReactMarkdown>,
  );
}

describe("article media", () => {
  it("renders Markdown video sources as a paused native player with a poster", () => {
    const html = render(
      "![Terminal showing an interactive rebase](/images/writing/rebase-01-abc.mp4)",
    );

    expect(html).toContain("<video");
    expect(html).toContain('aria-label="Terminal showing an interactive rebase"');
    expect(html).toContain('poster="/images/writing/rebase-01-abc-poster.webp"');
    expect(html).toContain('preload="metadata"');
    expect(html).toContain("controls");
    expect(html).toMatch(/\bloop\b/);
    expect(html).toMatch(/\bplaysInline\b|\bplaysinline\b/i);
    expect(html).not.toMatch(/autoplay/i);
    expect(html).toContain(
      '<a href="/images/writing/rebase-01-abc.mp4">Open the video: Terminal showing an interactive rebase</a>',
    );
    expect(html).not.toContain("<img");
  });

  it("keeps ordinary images on the native image path with their alt text", () => {
    const html = render("![A diagram](/images/writing/diagram-01-abc.png)");

    expect(html).toContain('<img alt="A diagram"');
    expect(html).not.toContain("<video");
  });

  it("derives posters only for local videos", () => {
    expect(isArticleVideoSource("/images/writing/a.mp4")).toBe(true);
    expect(isArticleVideoSource("/images/writing/a.webm?v=2")).toBe(true);
    expect(isArticleVideoSource("/images/writing/a.mp4.png")).toBe(false);
    expect(articleVideoPosterSource("/images/writing/a.webm?v=2")).toBe(
      "/images/writing/a-poster.webp",
    );
    expect(articleVideoPosterSource("https://example.com/a.mp4")).toBeUndefined();
    expect(articleVideoPosterSource("//example.com/a.mp4")).toBeUndefined();
  });
});
