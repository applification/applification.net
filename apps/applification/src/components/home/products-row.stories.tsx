import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ProductsRow } from "./products-row";

const meta = {
  title: "Homepage/Products row",
  component: ProductsRow,
  tags: ["autodocs"],
} satisfies Meta<typeof ProductsRow>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkProductCards: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);

  for (const name of ["Contexture", "Voiced", "astack", "Loami"]) {
    await expect(
      canvas.getByRole("link", { name: `Explore ${name}` }),
    ).toHaveAttribute("href", `/products/${name.toLowerCase()}`);
  }
  await expect(canvas.getByRole("link", { name: "See all products" })).toHaveAttribute("href", "/products");

  const cards = [...canvasElement.querySelectorAll("[data-product-card]")];
  await expect(cards).toHaveLength(4);

  if (window.innerWidth >= 1280) {
    // Peer cards share one baseline in the four-card row.
    const bottoms = cards.map((card) => Math.round(card.getBoundingClientRect().bottom));
    await expect(new Set(bottoms).size).toBe(1);
  }

  for (const link of canvasElement.querySelectorAll<HTMLElement>("[data-product-link]")) {
    // The reveal only translates the cards. Measure the layout box so its
    // fractional transform does not report a 44px target as 43.99994px.
    await expect(link.offsetHeight).toBeGreaterThanOrEqual(44);
  }
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkProductCards };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkProductCards,
};

export const CompactLaptopLight: Story = {
  globals: { viewport: { value: "compactLaptop", isRotated: false } },
  play: checkProductCards,
};

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkProductCards,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkProductCards,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkProductCards,
};
