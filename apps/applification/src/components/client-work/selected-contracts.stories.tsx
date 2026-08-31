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
  await expect(canvas.getByText(/three months/)).toBeVisible();
  await expect(canvas.getByText(/£12m ARR service/)).toBeVisible();
  await expect(canvas.getByText(/full Cypress end-to-end suite/)).toBeVisible();
  await expect(canvasElement.querySelectorAll("dt")).toHaveLength(3);
  await expect(canvasElement.querySelectorAll("dd")).toHaveLength(3);
  await expect(canvas.getByRole("link", { name: "Read the Eruptiv case" })).toHaveAttribute(
    "href",
    "/client-work/eruptiv",
  );
  await expect(canvas.getByRole("link", { name: "Read the Peppy Health case" })).toHaveAttribute(
    "href",
    "/client-work/peppy-health",
  );
  await expect(
    canvas.getByRole("link", { name: "Visit Client Server, opens in a new tab" }),
  ).toHaveAttribute("target", "_blank");
  await expect(
    canvas.getByRole("link", { name: "Visit Peppy Health, opens in a new tab" }),
  ).toHaveAttribute("target", "_blank");
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
