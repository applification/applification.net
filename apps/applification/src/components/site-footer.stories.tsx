import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { contractPositioning } from "@/lib/contract-positioning";
import { SiteFooter } from "./site-footer";

const meta = {
  title: "Layout/Site footer",
  component: SiteFooter,
  tags: ["autodocs"],
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkPositioning: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByText(`Dave Hudson · ${contractPositioning.role}`),
  ).toBeVisible();
};

export const DesktopLight: Story = { play: checkPositioning };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkPositioning,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPositioning,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkPositioning,
};
