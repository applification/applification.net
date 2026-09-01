import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { OpenSourceProducts } from "./open-source-products";

const meta = {
  title: "Homepage/Open-source products",
  component: OpenSourceProducts,
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourceProducts>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCompactLinkLabels: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const links = [
    ...canvasElement.querySelectorAll<HTMLElement>("[data-compact-product-link]"),
  ];

  await expect(links).toHaveLength(4);

  for (const link of links) {
    const shortLabel = link.querySelector<HTMLElement>(
      "[data-product-link-short-label]",
    );
    const fullLabel = link.querySelector<HTMLElement>(
      "[data-product-link-full-label]",
    );

    await expect(shortLabel).toBeInTheDocument();
    await expect(fullLabel).toBeInTheDocument();
    await expect(getComputedStyle(shortLabel!).display).not.toBe("none");
    await expect(getComputedStyle(fullLabel!).display).toBe("none");
    await expect(link.getBoundingClientRect().height).toBe(44);
  }
};

export const DesktopLight: Story = {};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
};

export const CompactLaptopLight: Story = {
  globals: { viewport: { value: "compactLaptop", isRotated: false } },
};

export const CompactLaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "compactLaptop", isRotated: false },
  },
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCompactLinkLabels,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkCompactLinkLabels,
};
