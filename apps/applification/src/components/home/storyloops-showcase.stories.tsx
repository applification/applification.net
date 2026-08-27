import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { StoryLoopsShowcase } from "./storyloops-showcase";

const meta = {
  title: "Homepage/StoryLoops showcase",
  component: StoryLoopsShowcase,
  tags: ["autodocs"],
} satisfies Meta<typeof StoryLoopsShowcase>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {};
export const DesktopDark: Story = { globals: { theme: "dark" } };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } } };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } } };
