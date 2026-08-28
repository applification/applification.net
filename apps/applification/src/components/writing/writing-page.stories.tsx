import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import {
  usePathname,
  useRouter,
  useSearchParams,
} from "@storybook/nextjs-vite/navigation.mock";
import { expect, fn, within } from "storybook/test";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import type { WritingEntry } from "@/lib/writing";
import { WritingPage } from "./writing-page";

const entries: WritingEntry[] = [
  {
    title: "Week 05, 2026",
    date: "2026-02-01",
    type: "weeknote",
    summary: "What changed across coding agents, product work and open source.",
    topics: ["weeknote", "ai", "claude-code", "open-source"],
    featured: false,
    draft: false,
    slug: "weeknotes-2026-w05",
    body: "A field note.",
    readingTime: 11,
  },
  {
    title: "Week 04, 2026",
    date: "2026-01-25",
    type: "weeknote",
    summary: "A week of product engineering notes.",
    topics: ["weeknote", "ai", "design"],
    featured: false,
    draft: false,
    slug: "weeknotes-2026-w04",
    body: "A field note.",
    readingTime: 9,
  },
  {
    title: "Node v22 Experiments",
    date: "2024-08-23",
    type: "post",
    summary: "Experiments with the current Node test runner.",
    topics: ["typescript", "testing"],
    featured: false,
    draft: false,
    slug: "node-22-experiments",
    body: "A post.",
    readingTime: 2,
  },
  {
    title: "AI Generative UI",
    date: "2024-03-07",
    type: "post",
    summary: "A closer look at generated interfaces.",
    topics: ["ai", "next.js", "react"],
    featured: false,
    draft: false,
    slug: "ai-generative-ui-rsc",
    body: "A post.",
    readingTime: 3,
  },
];

function WritingFixture() {
  usePathname.mockReturnValue("/writing");
  useRouter.mockReturnValue({
    back: fn(),
    bfcacheId: "storybook-writing",
    forward: fn(),
    prefetch: fn(),
    push: fn(),
    refresh: fn(),
    replace: fn(),
  });
  useSearchParams.mockReturnValue(
    new URLSearchParams() as ReturnType<typeof useSearchParams>,
  );

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <WritingPage
        entries={entries}
        topics={["ai", "claude-code", "design", "next.js", "react", "testing", "typescript"]}
      />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Writing/Complete page",
  component: WritingFixture,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: {
        pathname: "/writing",
      },
    },
  },
} satisfies Meta<typeof WritingFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkPage: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvasElement.querySelectorAll("h1")).toHaveLength(1);
  await expect(canvas.getByRole("heading", { name: "Every post, in one place." })).toBeVisible();
  await expect(canvas.getByLabelText("Filter writing by year")).toBeVisible();
  await expect(canvas.getByLabelText("Filter writing by topic")).toBeVisible();
  await expect(canvas.getByPlaceholderText("Search titles or topics")).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  await expect(canvas.getAllByRole("link").every((link) => link.tabIndex >= 0)).toBe(true);
};

export const DesktopLight: Story = { play: checkPage };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkPage,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkPage,
};
