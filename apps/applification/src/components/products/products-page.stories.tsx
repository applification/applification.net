import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import ProductsPage from "@/app/products/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function ProductsPageStory() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ProductsPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/Full page",
  component: ProductsPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof ProductsPageStory>;

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
