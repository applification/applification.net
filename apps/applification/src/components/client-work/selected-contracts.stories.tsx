import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SelectedContracts } from "./client-work-page";

const meta = {
  title: "Client work/Selected contracts",
  component: SelectedContracts,
  tags: ["autodocs"],
} satisfies Meta<typeof SelectedContracts>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkSelectedContracts: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);

  await expect(
    canvas.getByRole("heading", {
      level: 2,
      name: "Build the new thing. Leave it easier to change.",
    }),
  ).toBeVisible();
  await expect(canvas.getByText("ERUPTIV")).toBeVisible();
  await expect(canvas.getByText("PEPPY HEALTH")).toBeVisible();
  await expect(canvas.getByText(/four months/)).toBeVisible();
  await expect(canvas.getByText(/£12m ARR service/)).toBeVisible();
  await expect(canvas.getByText(/full Cypress end-to-end suite/)).toBeVisible();
  await expect(canvasElement.querySelectorAll("dt")).toHaveLength(3);
  await expect(canvasElement.querySelectorAll("dd")).toHaveLength(3);
};

export const DesktopLight: Story = { play: checkSelectedContracts };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkSelectedContracts,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkSelectedContracts,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkSelectedContracts,
};
