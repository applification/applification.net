import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import VoicedPage from "@/app/products/voiced/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function VoicedProductPageStory() {
  usePathname.mockReturnValue("/products/voiced");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <VoicedPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/Voiced/Full page",
  component: VoicedProductPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof VoicedProductPageStory>;

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
