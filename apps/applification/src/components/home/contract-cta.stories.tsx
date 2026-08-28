import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ContractCta } from "./contract-cta";

const meta = {
  title: "Homepage/Contract CTA",
  component: ContractCta,
  tags: ["autodocs"],
} satisfies Meta<typeof ContractCta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const contractLink = canvas.getByRole("link", {
      name: "Discuss a contract",
    });

    await expect(contractLink.querySelector("svg")).toBeInTheDocument();
    await expect(contractLink).not.toHaveTextContent("↗");
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
