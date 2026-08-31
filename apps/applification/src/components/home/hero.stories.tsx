import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { contractPositioning } from "@/lib/contract-positioning";
import { Hero } from "./hero";

const meta = {
  title: "Homepage/Hero",
  component: Hero,
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkContractSummary: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);
  const summary = canvasElement.querySelector<HTMLElement>(
    "[aria-label='Contract summary']",
  );

  await expect(summary).not.toBeNull();
  await expect(summary).toBeVisible();
  await expect(
    canvas.getByText(`Dave Hudson · ${contractPositioning.role}`),
  ).toBeVisible();

  for (const value of [
    contractPositioning.stack,
    contractPositioning.location,
    contractPositioning.teamFit,
    contractPositioning.contractBasis,
  ]) {
    await expect(canvas.getByText(value)).toBeVisible();
  }

  await expect(
    canvas.getByRole("link", { name: "Discuss a contract" }),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkContractSummary };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkContractSummary,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: checkContractSummary,
};

export const LaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "laptop", isRotated: false },
  },
  play: checkContractSummary,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkContractSummary,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkContractSummary,
};

export const WideMobileLight: Story = {
  globals: { viewport: { value: "wideMobile", isRotated: false } },
};

export const WideMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "wideMobile", isRotated: false },
  },
};

export const ReviewMobileLight: Story = {
  globals: { viewport: { value: "reviewMobile", isRotated: false } },
};

export const ReviewMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "reviewMobile", isRotated: false },
  },
};

export const NarrowTabletLight: Story = {
  globals: { viewport: { value: "narrowTablet", isRotated: false } },
};

export const NarrowTabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "narrowTablet", isRotated: false },
  },
};

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
};

export const TabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "tablet", isRotated: false },
  },
};
