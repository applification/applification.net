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
    canvas.getByRole("link", { name: "Read the complete case" }),
  ).toHaveAttribute("href", "/client-work/logically");
  const logicallyLink = canvas.getByRole("link", {
    name: "Visit Logically, opens in a new tab",
  });
  await expect(logicallyLink.offsetWidth).toBeGreaterThanOrEqual(44);
  await expect(logicallyLink.offsetHeight).toBeGreaterThanOrEqual(44);
  await expect(
    canvas.getByRole("link", { name: "Start a conversation" }),
  ).toHaveAttribute(
    "href",
    "/contact?route=contract",
  );
  await expect(links.every((link) => link.tabIndex >= 0)).toBe(true);
  await expect(canvasElement.querySelectorAll("footer")).toHaveLength(1);
};

const checkCaseStudyColumns = (
  expectedColumns: number,
): NonNullable<Story["play"]> =>
  async (context) => {
    await checkCompletePage(context);

    const caseStudyGrid = context.canvasElement.querySelector<HTMLElement>(
      "[data-client-work-section='featured-logically-case'] > div > div:last-child",
    );
    const selectedContractsGrid =
      context.canvasElement.querySelector<HTMLElement>(
        "[data-client-work-section='selected-contracts'] > div > div:last-child",
      );

    await expect(caseStudyGrid).not.toBeNull();
    await expect(selectedContractsGrid).not.toBeNull();
    await expect(caseStudyGrid?.children).toHaveLength(2);
    await expect(selectedContractsGrid?.children).toHaveLength(2);

    if (!caseStudyGrid || !selectedContractsGrid) {
      return;
    }

    const caseStudyTopPositions = new Set(
      [...caseStudyGrid.children].map((element) =>
        Math.round(element.getBoundingClientRect().top),
      ),
    );
    const selectedTopPositions = new Set(
      [...selectedContractsGrid.children].map((element) =>
        Math.round(element.getBoundingClientRect().top),
      ),
    );

    await expect(caseStudyTopPositions.size).toBe(expectedColumns === 1 ? 2 : 1);
    await expect(selectedTopPositions.size).toBe(expectedColumns === 1 ? 2 : 1);
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

export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkCaseStudyColumns(1),
};

export const CompactLaptopLight: Story = {
  globals: { viewport: { value: "compactLaptop", isRotated: false } },
  play: checkCaseStudyColumns(1),
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: checkCaseStudyColumns(2),
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
