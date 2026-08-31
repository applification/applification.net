import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { contractPositioning } from "@/lib/contract-positioning";
import { ClientWorkHero } from "./client-work-page";

const meta = {
  title: "Client work/Hero",
  component: ClientWorkHero,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientWorkHero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.getByRole("heading", {
        level: 1,
        name: "Production work, with the decisions and outcomes attached.",
      }),
    ).toBeVisible();
    await expect(
      canvas.getByRole("heading", { level: 2, name: "CURRENT BRIEF" }),
    ).toBeVisible();
    await expect(canvasElement.querySelectorAll("dt")).toHaveLength(5);
    await expect(canvasElement.querySelectorAll("dd")).toHaveLength(5);
    for (const value of Object.values(contractPositioning)) {
      await expect(canvas.getByText(value)).toBeVisible();
    }
  },
};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
};
