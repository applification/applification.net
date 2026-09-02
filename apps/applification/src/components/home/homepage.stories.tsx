import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor, within, userEvent } from "storybook/test";
import HomePage from "@/app/page";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function Homepage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <HomePage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Homepage/Full page",
  component: Homepage,
  parameters: {
    docs: { disable: true },
  },
} satisfies Meta<typeof Homepage>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkCommercialEvidenceOrder: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const hero = canvasElement.querySelector("[data-hero-surface]");
  const logos = canvasElement.querySelector("[data-client-logos]");
  const clientOutcomes = canvasElement.querySelector("#client-work");
  const products = canvasElement.querySelector("#products");
  const cta = canvasElement.querySelector("#contract-cta-heading");
  const order = [hero, logos, clientOutcomes, products, cta];
  for (let index = 1; index < order.length; index += 1) {
    const earlier = order[index - 1];
    const later = order[index];
    await expect(earlier).not.toBeNull();
    await expect(later).not.toBeNull();
    await expect(Boolean(earlier!.compareDocumentPosition(later!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
  }
  await expect(
    canvasElement.querySelectorAll("#client-work a[href^='/client-work']"),
  ).toHaveLength(3);
  for (const link of canvasElement.querySelectorAll("a[href^='https://']")) {
    await expect(link).toHaveAttribute("target", "_blank");
    await expect(link).toHaveAccessibleName(/opens in a new tab/);
    await expect(link.querySelector("svg")).toBeInTheDocument();
  }
  const canvas = within(canvasElement);
  for (const name of ["Contexture", "Voiced", "StoryLoops"]) {
    await expect(canvas.getByRole("link", { name: `Explore ${name}` })).toHaveAttribute("href", `/products/${name.toLowerCase()}`);
  }
  // The homepage no longer carries the Plantry showcase or a second AI section.
  await expect(canvasElement.querySelector("#plantry")).toBeNull();
  await expect(canvasElement.querySelectorAll("[data-motion-sequence='hero-approval']").length).toBeGreaterThan(0);
  const diagram = [...canvasElement.querySelectorAll<HTMLElement>("[data-motion-sequence='hero-approval']")].find(
    (element) => getComputedStyle(element).display !== "none",
  )!;
  await expect(hero!.contains(diagram)).toBe(true);
  if (window.innerWidth >= 1060) {
    const content = clientOutcomes!.firstElementChild!.getBoundingClientRect();
    const diagramBounds = diagram.getBoundingClientRect();
    await expect(Math.abs(diagramBounds.left - content.left)).toBeLessThan(2);
    await expect(Math.abs(diagramBounds.width - content.width)).toBeLessThan(2);
    const logically = canvasElement.querySelector("[data-client-outcome='logically']")!;
    const description = logically.firstElementChild!.getBoundingClientRect();
    const technologies = logically.children[1].getBoundingClientRect();
    await expect(technologies.top - description.bottom).toBeLessThanOrEqual(24);
  }
  await expect(document.documentElement.scrollWidth).toBeLessThanOrEqual(window.innerWidth);

};

export const DesktopLight: Story = {
  play: async (context) => {
    await checkCommercialEvidenceOrder(context);
    const { canvasElement } = context;
    const yesLabels = Array.from(canvasElement.querySelectorAll("span")).filter(
      (element) => element.textContent?.trim() === "YES",
    );

    await expect(yesLabels).toHaveLength(0);
  },
};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkCommercialEvidenceOrder,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCommercialEvidenceOrder,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkCommercialEvidenceOrder,
};

const checkStickyHeader: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const header = canvasElement.querySelector("header")!;
  const target = canvasElement.querySelector("#client-work")!;
  const surface = header.querySelector(".site-header-surface")!;
  try {
    window.scrollTo(0, 420);
    await waitFor(() => {
      expect(header).toHaveAttribute("data-scrolled", "true");
      expect(header.getBoundingClientRect().top).toBe(0);
    });
    await waitFor(() => {
      expect(surface.getBoundingClientRect().height).toBe(40);
      expect(window.scrollY).toBe(420);
      expect(header.querySelector("nav a")).not.toBeVisible();
      expect(header.querySelector(".site-header-theme")).toBeVisible();
    });
    // Resolve any CSS colour syntax to alpha: page content must actually
    // show through the surface, rather than just having a blur applied.
    const pixel = document.createElement("canvas").getContext("2d")!;
    pixel.fillStyle = getComputedStyle(surface).backgroundColor;
    pixel.fillRect(0, 0, 1, 1);
    const alpha = pixel.getImageData(0, 0, 1, 1).data[3] / 255;
    if (window.matchMedia("(prefers-reduced-transparency: reduce)").matches) {
      expect(alpha).toBe(1);
      expect(getComputedStyle(surface).backdropFilter).toBe("none");
    } else {
      expect(alpha).toBeGreaterThan(0.4);
      expect(alpha).toBeLessThan(0.75);
      expect(getComputedStyle(surface).backdropFilter).toContain("blur(");
    }
    window.scrollTo(0, 419);
    await waitFor(() => {
      expect(header).toHaveAttribute("data-compact", "false");
      expect(surface.getBoundingClientRect().height).toBe(64);
      expect(window.scrollY).toBe(419);
      expect(header.querySelector("nav a")).toBeVisible();
    });
    target.scrollIntoView({ block: "start" });
    await waitFor(() => {
      expect(target.getBoundingClientRect().top).toBeGreaterThanOrEqual(64);
      expect(target.getBoundingClientRect().top).toBeLessThanOrEqual(81);
    });
  } finally {
    window.scrollTo(0, 0);
    await waitFor(() => expect(header).toHaveAttribute("data-scrolled", "false"));
  }
};

export const StickyHeaderLight: Story = { play: checkStickyHeader };

export const StickyHeaderDark: Story = {
  globals: { theme: "dark" },
  play: checkStickyHeader,
};

export const ProductLinkKeyboardFocus: Story = {
  play: async (context) => {
    await checkCommercialEvidenceOrder(context);
    const canvas = within(context.canvasElement);
    const contexture = canvas.getByRole("link", { name: "Explore Contexture" });
    contexture.focus();
    await expect(contexture).toHaveFocus();
    await userEvent.tab();
    const voiced = canvas.getByRole("link", { name: "Explore Voiced" });
    await expect(voiced).toHaveFocus();
    await expect(getComputedStyle(voiced).outlineStyle).not.toBe("none");
  },
};
