import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LogicallyCaseStudy } from "./client-work-page";

const meta = {
  title: "Client work/Logically case study",
  component: LogicallyCaseStudy,
  tags: ["autodocs"],
} satisfies Meta<typeof LogicallyCaseStudy>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCaseStudy: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", {
      level: 2,
      name: "Rebuilt the frontend, then connected AI to production.",
    }),
  ).toBeVisible();
  await expect(
    canvas.getByRole("link", {
      name: "Visit Logically, opens in a new tab",
    }),
  ).toHaveAttribute("rel", "noreferrer");
  await expect(canvasElement.querySelectorAll("dt")).toHaveLength(4);
  await expect(canvasElement.querySelectorAll("dd")).toHaveLength(4);
  await expect(canvas.getByText(/AI SDK UI/)).toBeVisible();
  await expect(canvas.getByText(/roughly £500/)).toBeVisible();
};

export const DesktopLight: Story = { play: checkCaseStudy };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkCaseStudy,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCaseStudy,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkCaseStudy,
};
