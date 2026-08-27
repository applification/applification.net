import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { OpenSourceProducts } from "./open-source-products";

const meta = {
  title: "Homepage/Open-source products",
  component: OpenSourceProducts,
  tags: ["autodocs"],
} satisfies Meta<typeof OpenSourceProducts>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
};

export const CompactLaptopLight: Story = {
  globals: { viewport: { value: "compactLaptop", isRotated: false } },
};

export const CompactLaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "compactLaptop", isRotated: false },
  },
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
