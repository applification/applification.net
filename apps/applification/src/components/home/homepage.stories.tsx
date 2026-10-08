import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, within } from "storybook/test";
import { ProfileHomepage } from "./profile-homepage";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";

function Homepage() {
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader site="profile" />
      <ProfileHomepage />
      <SiteFooter site="profile" />
    </div>
  );
}
const meta = {
  title: "Homepage/Contractor profile",
  component: Homepage,
  parameters: { docs: { disable: true } },
} satisfies Meta<typeof Homepage>;
export default meta;
type Story = StoryObj<typeof meta>;
const checkProfile: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(
    canvas.getByRole("heading", { level: 1, name: "Dave Hudson" }),
  ).toBeVisible();
  await expect(
    canvas.getByRole("link", { name: "Download CV (PDF)" }),
  ).toHaveAttribute("href", "/cv/Dave-Hudson-CV.pdf");
  await expect(
    canvas.getByRole("link", { name: "Download CV (PDF)" }),
  ).toHaveAttribute("download");
  for (const action of canvas.getAllByRole("link", {
    name: "Discuss a contract",
  }))
    await expect(action).toHaveAttribute("href", "/contact?route=contract");
  await expect(canvas.getByText("North East hybrid considered")).toBeVisible();
  await expect(
    canvas.getByRole("heading", { name: "React & Next.js" }),
  ).toBeVisible();
  await expect(
    canvas.getByRole("heading", { name: "AI & MCP integrations" }),
  ).toBeVisible();
  await expect(
    canvasElement.querySelectorAll("#client-work a[href^='/client-work']"),
  ).toHaveLength(3);
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
  await expect(
    canvas.getByRole("link", {
      name: /Explore Applification.*opens in a new tab/,
    }),
  ).toHaveAttribute("href", "https://applification.net");
};
export const DesktopLight: Story = { play: checkProfile };
export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkProfile,
};
export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkProfile,
};
export const MobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkProfile,
};
export const Tablet: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkProfile,
};
export const SmallMobile: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: checkProfile,
};
