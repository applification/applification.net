import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, waitFor } from "storybook/test";
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
  const headings = [...canvasElement.querySelectorAll("h2")];
  const storyloopsHeading = headings.find((heading) =>
    heading.textContent?.includes("coding agents cannot quietly ignore"),
  );
  const clientOutcomes = canvasElement.querySelector("#client-work");
  const plantryHeading = canvasElement.querySelector("#plantry-heading");

  await expect(clientOutcomes).not.toBeNull();
  await expect(storyloopsHeading).not.toBeUndefined();
  await expect(plantryHeading).not.toBeNull();
  await expect(
    clientOutcomes && storyloopsHeading
      ? Boolean(
          clientOutcomes.compareDocumentPosition(storyloopsHeading) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        )
      : false,
  ).toBe(true);
  await expect(
    clientOutcomes && plantryHeading
      ? Boolean(
          clientOutcomes.compareDocumentPosition(plantryHeading) &
            Node.DOCUMENT_POSITION_FOLLOWING,
        )
      : false,
  ).toBe(true);
  await expect(
    canvasElement.querySelectorAll("#client-work a[href^='/client-work']"),
  ).toHaveLength(3);
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
    });
    window.scrollTo(0, 419);
    await waitFor(() => {
      expect(header).toHaveAttribute("data-compact", "false");
      expect(surface.getBoundingClientRect().height).toBe(64);
      expect(window.scrollY).toBe(419);
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
