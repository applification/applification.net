import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";

const appRoot = fileURLToPath(new URL("../../", import.meta.url));
const writingDirectory = path.join(appRoot, "content", "writing");
const publicDirectory = path.join(appRoot, "public");

// Markdown images whose alt text is intentionally empty because they are
// purely decorative. Keep this empty unless an image adds nothing to the text.
const decorativeImages = new Set<string>([]);

type MarkdownImage = { alt: string; file: string; line: number; src: string };

const imagePattern = /!\[([^\]]*)\]\(\s*<?([^)\s>]+)>?(?:\s+"[^"]*")?\s*\)/g;

function readArticleImages(): MarkdownImage[] {
  return fs
    .readdirSync(writingDirectory)
    .filter((file) => file.endsWith(".md"))
    .flatMap((file) =>
      fs
        .readFileSync(path.join(writingDirectory, file), "utf8")
        .split("\n")
        .flatMap((text, index) =>
          [...text.matchAll(imagePattern)].map((match) => ({
            alt: match[1],
            file,
            line: index + 1,
            src: match[2],
          })),
        ),
    );
}

const images = readArticleImages();
const location = (image: MarkdownImage) =>
  `${image.file}:${image.line} ${image.src}`;

describe("writing media", () => {
  it("finds the article images", () => {
    expect(images.length).toBeGreaterThan(40);
  });

  it("gives every article image or video meaningful alt text (WCAG 1.1.1)", () => {
    const missing = images
      .filter((image) => image.alt.trim() === "")
      .filter((image) => !decorativeImages.has(image.src))
      .map(location);

    expect(missing).toEqual([]);
  });

  it("points every local image, video and video poster at a real file", () => {
    const missing = images
      .filter((image) => image.src.startsWith("/"))
      .flatMap((image) => {
        const files = [image.src];
        if (/\.(?:mp4|webm)$/i.test(image.src)) {
          files.push(image.src.replace(/\.(?:mp4|webm)$/i, "-poster.webp"));
        }
        return files
          .filter((file) => !fs.existsSync(path.join(publicDirectory, file)))
          .map((file) => `${location(image)} → ${file}`);
      });

    expect(missing).toEqual([]);
  });

  it("uses pausable videos instead of looping GIFs (WCAG 2.2.2)", () => {
    expect(
      images.filter((image) => /\.gif$/i.test(image.src)).map(location),
    ).toEqual([]);
  });
});
