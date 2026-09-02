import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { ClientLogos } from "./client-logos";

const meta = {
  title: "Homepage/Client logos",
  component: ClientLogos,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientLogos>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkClientRow: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const items = canvasElement.querySelectorAll("[data-client-logos] li");

  await expect(items).toHaveLength(7);
  for (const item of items) {
    await expect(item).toBeVisible();
    // Names never break mid-word; the row wraps whole names instead.
    await expect(item.getBoundingClientRect().height).toBeLessThan(40);
  }
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkClientRow };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkClientRow,
};

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkClientRow,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkClientRow,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkClientRow,
};
