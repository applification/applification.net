import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { CommercialProof } from "./commercial-proof";

const meta = {
  title: "Homepage/Commercial proof",
  component: CommercialProof,
  tags: ["autodocs"],
} satisfies Meta<typeof CommercialProof>;

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

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
};

export const TabletDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "tablet", isRotated: false },
  },
};
