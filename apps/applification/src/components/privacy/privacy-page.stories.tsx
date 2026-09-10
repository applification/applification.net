import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within } from "storybook/test";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { PrivacyPage } from "./privacy-page";

function Fixture() {
  usePathname.mockReturnValue("/privacy");
  return (
    <>
      <SiteHeader />
      <PrivacyPage />
      <SiteFooter />
    </>
  );
}

const meta = {
  title: "Privacy/Complete page",
  component: Fixture,
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/privacy" } },
  },
} satisfies Meta<typeof Fixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkPage: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  for (const name of [
    "Reading the site",
    "Sending an enquiry",
    "Services used",
    "Your rights and questions",
  ]) {
    await expect(canvas.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(
    canvas.getAllByRole("link", { name: "Contact routes" })[0],
  ).toHaveAttribute("href", "/about");
  await expect(canvasElement.textContent).not.toMatch(
    /mailto:|[\w.+-]+@applification\.net/i,
  );
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkPage };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: checkPage };
export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};
export const MobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};
