import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { LogicallyCaseStudyPage } from "./logically-case-study-page";

const meta = {
  title: "Client work/Logically complete case",
  component: LogicallyCaseStudyPage,
  tags: ["autodocs"],
  parameters: {
    nextjs: { appDirectory: true },
  },
} satisfies Meta<typeof LogicallyCaseStudyPage>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCompleteCase: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);

  await expect(canvasElement.querySelectorAll("h1")).toHaveLength(1);
  await expect(canvas.getByRole("heading", { name: /live platform/i })).toBeVisible();
  await expect(canvas.getByRole("heading", { name: /boundary testable/i })).toBeVisible();
  await expect(canvas.getByRole("heading", { name: /six months to production/i })).toBeVisible();
  await expect(canvas.getByRole("link", { name: "Return to Client work" })).toHaveAttribute("href", "/client-work#logically");
  await expect(canvas.getByRole("link", { name: "Continue to the contract action" })).toHaveAttribute("href", "/client-work#contact");
  await expect(canvas.getByRole("link", { name: /Visit Logically/ })).toHaveAttribute("target", "_blank");
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
};

export const DesktopLight: Story = { play: checkCompleteCase };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkCompleteCase,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCompleteCase,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkCompleteCase,
};
