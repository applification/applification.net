import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within } from "storybook/test";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { DevelopersPage } from "./developers-page";

function Fixture() {
  usePathname.mockReturnValue("/developers");
  return (
    <>
      <SiteHeader />
      <DevelopersPage />
      <SiteFooter />
    </>
  );
}

const meta = {
  title: "Developers/Complete page",
  component: Fixture,
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/developers" } },
  },
} satisfies Meta<typeof Fixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkPage: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const headings = canvas.getAllByRole("heading", { level: 1 });
  await expect(headings).toHaveLength(1);
  await expect(headings[0]).toHaveTextContent(/Applification developer documentation/);
  for (const name of [
    "Access, free tier and sandbox",
    "MCP server",
    "HTTP API",
    "SDKs",
    "CLI",
  ]) {
    await expect(canvas.getByRole("heading", { level: 2, name })).toBeVisible();
  }
  await expect(
    canvas.getByRole("link", { name: "OpenAPI 3.1 specification" }),
  ).toHaveAttribute("href", "/api/openapi.json");
  await expect(canvas.getByRole("link", { name: "MCP server card" })).toHaveAttribute(
    "href",
    "/.well-known/mcp/server-card.json",
  );
  await expect(canvas.getByLabelText("MCP endpoint")).toHaveTextContent(
    "https://www.applification.net/api/mcp",
  );
  await expect(canvas.getByLabelText("MCP client configuration")).toHaveAttribute(
    "tabindex",
    "0",
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
