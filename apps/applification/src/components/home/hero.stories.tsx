import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { Hero } from "./hero";

const meta = {
  title: "Homepage/Hero",
  component: Hero,
  tags: ["autodocs"],
} satisfies Meta<typeof Hero>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
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

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
};

export const WideMobileLight: Story = {
  globals: { viewport: { value: "wideMobile", isRotated: false } },
};

export const WideMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "wideMobile", isRotated: false },
  },
};

export const ReviewMobileLight: Story = {
  globals: { viewport: { value: "reviewMobile", isRotated: false } },
};

export const ReviewMobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "reviewMobile", isRotated: false },
  },
};

export const NarrowTabletLight: Story = {
  globals: { viewport: { value: "narrowTablet", isRotated: false } },
};

export const NarrowTabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "narrowTablet", isRotated: false },
  },
};

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
};

export const TabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "tablet", isRotated: false },
  },
};
