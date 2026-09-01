import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within } from "storybook/test";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { contractPositioning } from "@/lib/contract-positioning";
import { AboutPage } from "./about-page";

function AboutPageFixture() {
  usePathname.mockReturnValue("/about");

  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      <AboutPage />
      <SiteFooter />
    </div>
  );
}

const meta = {
  title: "About/Complete page",
  component: AboutPageFixture,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
      navigation: { pathname: "/about" },
    },
  },
} satisfies Meta<typeof AboutPageFixture>;

export default meta;
type Story = StoryObj<typeof meta>;

const expectedOrder = [
  "profile",
  "positioning",
  "method",
  "writing",
  "timeline",
  "contract-fit",
];

const checkCompletePage: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);
  const sections = [
    ...canvasElement.querySelectorAll<HTMLElement>("[data-about-section]"),
  ];

  await expect(canvasElement.querySelectorAll("h1")).toHaveLength(1);
  await expect(sections.map((section) => section.dataset.aboutSection)).toEqual(
    expectedOrder,
  );
  await expect(sections.every((section) => section.offsetHeight > 0)).toBe(true);
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
  await expect(canvas.getAllByText("2003").length).toBeGreaterThanOrEqual(2);
  await expect(canvas.getByText("2026")).toBeVisible();
  for (const value of Object.values(contractPositioning)) {
    await expect(canvas.getAllByText(value).length).toBeGreaterThanOrEqual(1);
  }
  await expect(
    canvas.getByRole("link", {
      name: /Product and AI engineering at Logically\.ai.*opens in a new tab/,
    }),
  ).toHaveAttribute("target", "_blank");
  await expect(canvas.queryByRole("link", { name: "Email Dave" })).not.toBeInTheDocument();
  await expect(canvasElement.querySelector("#contact")).not.toBeInTheDocument();
  await expect(canvasElement.querySelectorAll("footer")).toHaveLength(1);
  const profileFactColours = new Set(
    [...canvasElement.querySelectorAll<HTMLElement>("[data-profile-fact-value]")].map(
      (fact) => getComputedStyle(fact).color,
    ),
  );
  await expect(profileFactColours.size).toBe(1);
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
  play: checkCompletePage,
};

export const LaptopLight: Story = {
  globals: { viewport: { value: "laptop", isRotated: false } },
  play: checkCompletePage,
};
