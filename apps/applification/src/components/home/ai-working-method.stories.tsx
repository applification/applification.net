import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { AiWorkingMethod } from "./ai-working-method";

const meta = {
  title: "Homepage/AI working method",
  component: AiWorkingMethod,
  tags: ["autodocs"],
} satisfies Meta<typeof AiWorkingMethod>;

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

export const CompactTabletLight: Story = {
  globals: { viewport: { value: "compactTablet", isRotated: false } },
};

export const CompactTabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "compactTablet", isRotated: false },
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
