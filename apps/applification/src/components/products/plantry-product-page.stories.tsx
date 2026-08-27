import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import PlantryPage from "@/app/products/plantry/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function PlantryProductPageStory() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <PlantryPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Products/Plantry/Full page",
  component: PlantryProductPageStory,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof PlantryProductPageStory>;

export default meta;
type Story = StoryObj<typeof meta>;

const verifyNoHorizontalOverflow: Story["play"] = async ({ canvasElement }) => {
  const documentElement = canvasElement.ownerDocument.documentElement;

  await expect(documentElement.scrollWidth).toBeLessThanOrEqual(
    documentElement.clientWidth,
  );
};

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
  play: verifyNoHorizontalOverflow,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: verifyNoHorizontalOverflow,
};
