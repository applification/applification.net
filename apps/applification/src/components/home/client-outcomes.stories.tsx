import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { ClientOutcomes } from "./client-outcomes";

const meta = {
  title: "Homepage/Client outcomes",
  component: ClientOutcomes,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientOutcomes>;

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

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
};

export const LaptopDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "laptop", isRotated: false },
  },
};
