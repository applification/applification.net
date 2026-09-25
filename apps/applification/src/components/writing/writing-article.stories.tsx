import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import type { WritingEntry } from "@/lib/writing";
import { WritingArticle } from "./writing-article";

const block = `\`\`\`rich-block
{
  "name": "link-preview",
  "props": {
    "destination": "https://storyloop.applification.net/",
    "title": "Shape product work as a shared user journey",
    "description": "StoryLoop keeps product intent, delivery state and owner decisions together on one story map.",
    "siteName": "StoryLoop"
  }
}
\`\`\``;

const entry: WritingEntry = {
  title: "A typed rich article",
  date: "2026-08-31",
  type: "post",
  summary:
    "A browser fixture for portable Markdown and registered rich blocks.",
  topics: ["writing", "testing"],
  featured: false,
  draft: false,
  slug: "typed-rich-article",
  body: `Ordinary Markdown stays ordinary. [External reference](https://example.com/reference) and [internal contact](/contact).\n\n${block}\n\n## The next section\n\nProse after the block still renders in order.`,
  readingTime: 1,
};

const videoAlt =
  "Git Graph in VS Code showing the branch history after the rebase, then commit details and a file diff";

const videoEntry: WritingEntry = {
  ...entry,
  title: "An article with a screen recording",
  slug: "article-with-video",
  body: `A short screen recording follows. It stays still until the reader presses play.\n\n![${videoAlt}](/images/writing/how-to-git-rebase-01-f56a24b559.mp4)\n\nProse after the recording still renders in order.`,
};

function RichArticleFixture({ article = entry }: { article?: WritingEntry }) {
  return <WritingArticle entry={article} />;
}

const meta = {
  title: "Writing/Rich article",
  component: RichArticleFixture,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof RichArticleFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkRichArticle: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", { name: "A typed rich article" }),
  ).toBeVisible();
  await expect(
    canvas.getByText(/Ordinary Markdown stays ordinary\./),
  ).toBeVisible();
  const external = canvas.getByRole("link", { name: /External reference.*opens in a new tab/ });
  await expect(external).toHaveAttribute("target", "_blank");
  await expect(external.querySelector("svg")).toBeInTheDocument();
  await expect(canvas.getByRole("link", { name: "internal contact" })).not.toHaveAttribute("target");
  const preview = canvas.getByRole("link", {
    name: "Shape product work as a shared user journey on StoryLoop, external link, opens in a new tab",
  });

  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute(
    "href",
    "https://storyloop.applification.net/",
  );
  await expect(preview).toHaveAttribute("target", "_blank");
  await expect(preview).toHaveAttribute("rel", "noopener noreferrer");
  preview.focus();
  await expect(preview).toHaveFocus();
  await expect(
    within(preview).getByText(/storyloop\.applification\.net/),
  ).toBeVisible();
  await expect(
    canvasElement.querySelectorAll('[data-rich-block="link-preview"]'),
  ).toHaveLength(1);
  await expect(canvasElement.querySelector("pre")).not.toBeInTheDocument();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkRichArticle };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkRichArticle,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkRichArticle,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkRichArticle,
};

const checkVideoArticle: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);
  const video = canvasElement.querySelector("article video");

  await expect(video).toBeInstanceOf(HTMLVideoElement);
  if (!(video instanceof HTMLVideoElement)) return;

  await expect(video).toHaveAccessibleName(videoAlt);
  await expect(video).toHaveAttribute("controls");
  await expect(video).not.toHaveAttribute("autoplay");
  await expect(video.autoplay).toBe(false);
  await expect(video.paused).toBe(true);
  await expect(video.muted).toBe(true);
  await expect(video.loop).toBe(true);
  await expect(video).toHaveAttribute("preload", "metadata");
  await expect(video).toHaveAttribute(
    "poster",
    "/images/writing/how-to-git-rebase-01-f56a24b559-poster.webp",
  );
  await expect(video).toBeVisible();
  await expect(canvasElement.querySelector("article img")).not.toBeInTheDocument();
  await expect(
    canvas.getByText("Prose after the recording still renders in order."),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const WithVideo: Story = {
  args: { article: videoEntry },
  play: checkVideoArticle,
};

export const WithVideoMobileDark: Story = {
  args: { article: videoEntry },
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkVideoArticle,
};
