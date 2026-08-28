import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { ClientWorkPage } from "./client-work-page";

function ClientWorkFixture() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <ClientWorkPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "Client work/Complete page",
  component: ClientWorkFixture,
  tags: ["autodocs"],
} satisfies Meta<typeof ClientWorkFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

const expectedOrder = [
  "opening-brief",
  "featured-logically-case",
  "selected-contracts",
  "supporting-evidence",
  "best-contract-fit",
  "contract-action",
];

const checkCompletePage: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);
  const sections = [
    ...canvasElement.querySelectorAll<HTMLElement>("[data-client-work-section]"),
  ];
  const links = canvas.getAllByRole("link");

  await expect(canvasElement.querySelectorAll("h1")).toHaveLength(1);
  await expect(sections.map((section) => section.dataset.clientWorkSection)).toEqual(
    expectedOrder,
  );
  await expect(sections.every((section) => section.offsetHeight > 0)).toBe(true);
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
  await expect(
    canvas.getByRole("link", { name: "Visit Logically, opens in a new tab" }),
  ).toHaveAttribute("target", "_blank");
  await expect(
    canvas.getByRole("link", { name: "Start a conversation" }),
  ).toHaveAttribute(
    "href",
    "mailto:dave@applification.net?subject=Project%20enquiry",
  );
  await expect(links.every((link) => link.tabIndex >= 0)).toBe(true);
  await expect(canvasElement.querySelectorAll("footer")).toHaveLength(1);
};

export const DesktopLight: Story = { play: checkCompletePage };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkCompletePage,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkCompletePage,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkCompletePage,
};

export const ReducedMotion: Story = {
  play: async ({ canvasElement }) => {
    const mediaRules = [...document.styleSheets].flatMap((styleSheet) => {
      try {
        return [...styleSheet.cssRules];
      } catch {
        return [];
      }
    });
    const reducedMotionRule = mediaRules.find(
      (rule) =>
        rule instanceof CSSMediaRule &&
        rule.conditionText === "(prefers-reduced-motion: reduce)",
    );
    const reducedMotionStyleRule =
      reducedMotionRule instanceof CSSMediaRule
        ? [...reducedMotionRule.cssRules].find(
            (rule) => rule instanceof CSSStyleRule,
          )
        : undefined;

    await expect(reducedMotionStyleRule).toBeInstanceOf(CSSStyleRule);
    await expect(
      reducedMotionStyleRule instanceof CSSStyleRule
        ? reducedMotionStyleRule.style.animationName
        : undefined,
    ).toBe("none");
    await expect(
      reducedMotionStyleRule instanceof CSSStyleRule
        ? reducedMotionStyleRule.style.transitionProperty
        : undefined,
    ).toBe("none");
    await expect(canvasElement.querySelectorAll("h1")).toHaveLength(1);
    await expect(
      canvasElement.querySelectorAll("[data-client-work-section]"),
    ).toHaveLength(expectedOrder.length);
  },
};
