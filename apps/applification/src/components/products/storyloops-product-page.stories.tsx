import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import StoryLoopsPage from "@/app/products/storyloops/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function StoryLoopsProductPageStory() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <StoryLoopsPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/StoryLoops/Full page",
  component: StoryLoopsProductPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof StoryLoopsProductPageStory>;

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
