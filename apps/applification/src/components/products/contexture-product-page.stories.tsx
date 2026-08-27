import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ContexturePage from "@/app/products/contexture/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function ContextureProductPageStory() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ContexturePage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/Contexture/Full page",
  component: ContextureProductPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof ContextureProductPageStory>;

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
