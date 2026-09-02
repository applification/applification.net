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
  const clientOutcomes = canvasElement.querySelector("#client-work");
  const method = canvasElement.querySelector("#homepage-ai-statement-heading");
  const products = canvasElement.querySelector("#products");
  const plantry = canvasElement.querySelector("#plantry-heading");
  for (const laterSection of [method, products, plantry]) {
    await expect(clientOutcomes).not.toBeNull();
    await expect(laterSection).not.toBeNull();
    await expect(Boolean(clientOutcomes!.compareDocumentPosition(laterSection!) & Node.DOCUMENT_POSITION_FOLLOWING)).toBe(true);
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
  for (const name of ["StoryLoops", "Plantry"]) {
    await expect(canvas.getByRole("link", { name: `Explore ${name} →` })).toHaveAttribute("href", `/products/${name.toLowerCase()}`);
  }
  const diagram = canvasElement.querySelector<HTMLElement>("[data-motion-sequence='hero-approval']")!;
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
    const storyloops = canvas.getByRole("link", { name: "Explore StoryLoops →" });
    storyloops.focus();
    await expect(storyloops).toHaveFocus();
    await userEvent.tab();
    const plantry = canvas.getByRole("link", { name: "Explore Plantry →" });
    await expect(plantry).toHaveFocus();
    await expect(getComputedStyle(plantry).outlineStyle).not.toBe("none");
  },
};
