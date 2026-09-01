import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ClientOutcomes } from "./client-outcomes";

const meta = {
  title: "Homepage/Client outcomes",
  component: ClientOutcomes,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientOutcomes>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCaseLinks: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByRole("link", { name: "Read the Eruptiv case" })).toHaveAttribute(
    "href",
    "/client-work/eruptiv",
  );
  await expect(canvas.getByRole("link", { name: "Read the Peppy Health case" })).toHaveAttribute(
    "href",
    "/client-work/peppy-health",
  );
  await expect(canvas.getByRole("link", { name: /Visit Client Server/ })).toHaveAttribute(
    "target",
    "_blank",
  );
  await expect(canvas.getByRole("link", { name: /Visit Peppy Health/ })).toHaveAttribute(
    "target",
    "_blank",
  );
};

const checkMobilePalette: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  await checkCaseLinks({ canvasElement } as Parameters<typeof checkCaseLinks>[0]);

  const logically = canvasElement.querySelector<HTMLElement>(
    "[data-client-outcome='logically']",
  );
  const peer = canvasElement.querySelector<HTMLElement>(
    "[data-client-outcome='logically'] + li",
  );

  await expect(logically).toBeInTheDocument();
  await expect(peer).toBeInTheDocument();
  await expect(getComputedStyle(logically!).backgroundColor).toBe(
    getComputedStyle(peer!).backgroundColor,
  );
  await expect(getComputedStyle(logically!).color).toBe(
    getComputedStyle(peer!).color,
  );
};

export const DesktopLight: Story = { play: checkCaseLinks };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkCaseLinks,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkMobilePalette,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkMobilePalette,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
};

export const LaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "laptop", isRotated: false },
  },
};
