import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { TweetEmbed } from "./tweet-embed";

function TweetFixture() {
  return <main className="mx-auto max-w-[760px] px-6 py-12">
    <TweetEmbed id="2097408592290971956" author="Guillermo Rauch" quote="Chat has won. It's all chat + computer from this point on" />
  </main>;
}

const meta = {
  title: "Writing/Tweet embed",
  component: TweetFixture,
  parameters: { nextjs: { appDirectory: true } },
} satisfies Meta<typeof TweetFixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const check: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const link = within(canvasElement).getByRole("link", { name: /Read Guillermo Rauch/ });
  await expect(link).toHaveAttribute("href", "https://x.com/i/status/2097408592290971956");
  await expect(link).toHaveAttribute("target", "_blank");
  link.focus();
  await expect(link).toHaveFocus();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
};

export const DesktopLight: Story = { play: check };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: check };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } }, play: check };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } }, play: check };
