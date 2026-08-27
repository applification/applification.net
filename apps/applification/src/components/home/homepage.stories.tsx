import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import HomePage from "@/app/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function Homepage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Homepage/Full page",
  component: Homepage,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof Homepage>;

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
