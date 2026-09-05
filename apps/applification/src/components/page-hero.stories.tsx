import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import { AboutHero } from "./about/about-page";
import { ClientWorkHero } from "./client-work/client-work-page";
import { ProductsHero } from "./products/products-page";

function HeroAlignment() {
  return <><ClientWorkHero /><ProductsHero /><AboutHero /></>;
}

const meta = {
  title: "Layout/Hero alignment",
  component: HeroAlignment,
  parameters: { docs: { description: { component: "Main-page opening labels stay at the same offset despite different hero densities and aside heights." } } },
  play: async ({ canvasElement }) => {
    const sections = [...canvasElement.querySelectorAll("section")];
    const offsets = sections.map((section) =>
      section.querySelector("p")!.getBoundingClientRect().top - section.getBoundingClientRect().top,
    );
    await expect(offsets).toHaveLength(3);
    for (const offset of offsets) await expect(offset).toBeCloseTo(offsets[0], 0);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
} satisfies Meta<typeof HeroAlignment>;

export default meta;
type Story = StoryObj<typeof meta>;
export const DesktopLight: Story = {};
export const DesktopDark: Story = { globals: { theme: "dark" } };
export const Tablet: Story = { globals: { viewport: { value: "tablet", isRotated: false } } };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } } };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } } };
