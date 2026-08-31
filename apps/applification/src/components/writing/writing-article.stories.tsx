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
  body: `Ordinary Markdown stays ordinary.\n\n${block}\n\n## The next section\n\nProse after the block still renders in order.`,
  readingTime: 1,
};

function RichArticleFixture() {
  return <WritingArticle entry={entry} />;
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
    canvas.getByText("Ordinary Markdown stays ordinary."),
  ).toBeVisible();
  const preview = canvas.getByRole("link", {
    name: "Shape product work as a shared user journey on StoryLoop, external link",
  });

  await expect(preview).toBeVisible();
  await expect(preview).toHaveAttribute(
    "href",
    "https://storyloop.applification.net/",
  );
  await expect(preview).toHaveAttribute("target", "_blank");
  await expect(preview).toHaveAttribute("rel", "noreferrer");
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
