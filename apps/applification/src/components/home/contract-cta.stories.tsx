import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ContractCta } from "./contract-cta";

const meta = {
  title: "Homepage/Contract CTA",
  component: ContractCta,
  tags: ["autodocs"],
} satisfies Meta<typeof ContractCta>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {};

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
