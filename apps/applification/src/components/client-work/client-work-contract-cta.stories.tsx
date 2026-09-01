import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ClientWorkContractCta } from "./client-work-page";

const meta = {
  title: "Client work/Contract CTA",
  component: ClientWorkContractCta,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientWorkContractCta>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCta: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const action = canvas.getByRole("link", { name: "Start a conversation" });

  await expect(
    canvas.getByRole("heading", {
      level: 2,
      name: "Need a senior product engineer to turn an AI idea into working software?",
    }),
  ).toBeVisible();
  await expect(action).toHaveAttribute(
    "href",
    "/contact?route=contract",
  );
  await expect(action.querySelector("svg")).toBeInTheDocument();
  await expect(canvas.getByText(/Hybrid considered in North East England/)).toBeVisible();
};

export const DesktopLight: Story = { play: checkCta };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkCta,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCta,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkCta,
};
