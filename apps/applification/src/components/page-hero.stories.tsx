import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
import { DetailContextRail } from "./detail-context-rail";
import { heroTopSpacing } from "./page-hero";
import { Hero } from "./home/hero";
import { AboutHero } from "./about/about-page";
import { ClientWorkHero } from "./client-work/client-work-page";
import { ProductsHero } from "./products/products-page";

function HeroAlignment() {
  return <><Hero /><ClientWorkHero /><ProductsHero /><AboutHero /><section className={`${heroTopSpacing} px-6 pb-12`}><DetailContextRail backHref="/client-work" backLabel="Back to Client work" family="Client work" detail="Case study" /></section></>;
}

const meta = {
  title: "Layout/Hero alignment",
  component: HeroAlignment,
  parameters: { docs: { description: { component: "Main-page opening labels stay at the same offset despite different hero densities and aside heights." } } },
  play: async ({ canvasElement }) => {
    const sections = [...canvasElement.querySelectorAll("section")];
    await waitFor(async () => {
      const offsets = sections.map((section) => {
        const label = section.querySelector('[aria-label="Contract summary"]') ?? section.querySelector("p")!;
        return label.getBoundingClientRect().top - section.getBoundingClientRect().top;
      });
      await expect(offsets).toHaveLength(5);
      for (const offset of offsets) await expect(offset).toBeCloseTo(offsets[0], 0);
    });
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
