import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import ContexturePage from "@/app/products/contexture/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function ContextureProductPageStory() {
  usePathname.mockReturnValue("/products/contexture");

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
