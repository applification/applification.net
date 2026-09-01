import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { StoryLoopsShowcase } from "./storyloops-showcase";

const meta = {
  title: "Homepage/StoryLoops showcase",
  component: StoryLoopsShowcase,
  tags: ["autodocs"],
} satisfies Meta<typeof StoryLoopsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkMobileApprovalPalette: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const approval = canvasElement.querySelector<HTMLElement>(
    "[data-storyloop-mobile-approval]",
  );
  const peer = approval?.previousElementSibling as HTMLElement | null;

  await expect(approval).toBeInTheDocument();
  await expect(peer).toBeInTheDocument();
  await expect(getComputedStyle(approval!).backgroundColor).toBe(
    getComputedStyle(peer!).backgroundColor,
  );
};

export const DesktopLight: Story = {};
export const DesktopDark: Story = { globals: { theme: "dark" } };
export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkMobileApprovalPalette,
};
export const MobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkMobileApprovalPalette,
};
