import { expect, within } from "storybook/test";
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

const verifyDirectory: Story["play"] = async ({ canvasElement }) => {
  const active = canvasElement.querySelector<HTMLElement>(
    "[data-active-products]",
  )!;
  await expect(
    within(active)
      .getAllByRole("heading", { level: 3 })
      .map((heading) => heading.textContent),
  ).toEqual(["Loami", "Contexture", "Voiced"]);
  const archives = [
    ...canvasElement.querySelectorAll<HTMLElement>("[data-archive-card]"),
  ];
  await expect(archives).toHaveLength(2);
  for (const archive of archives)
    await expect(archive.getBoundingClientRect().height).toBeLessThan(360);
  await expect(
    within(archives[0]).getByText(/A StoryLoops product map/),
  ).toBeInTheDocument();
  await expect(
    canvasElement.ownerDocument.documentElement.scrollWidth,
  ).toBeLessThanOrEqual(
    canvasElement.ownerDocument.documentElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: verifyDirectory };

export const DesktopDark: Story = {
  play: verifyDirectory,
  globals: { theme: "dark" },
};

export const MobileLight: Story = {
  play: verifyDirectory,
  globals: { viewport: { value: "mobile", isRotated: false } },
};

export const MobileDark: Story = {
  play: verifyDirectory,
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
};
