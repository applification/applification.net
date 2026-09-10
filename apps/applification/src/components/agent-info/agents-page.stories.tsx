import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within, userEvent } from "storybook/test";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AgentsPage } from "./agents-page";

function Fixture() {
  usePathname.mockReturnValue("/agents");
  return (
    <>
      <SiteHeader />
      <AgentsPage />
      <SiteFooter />
    </>
  );
}

const meta = {
  title: "Agents/Complete page",
  component: Fixture,
  parameters: {
    nextjs: { appDirectory: true, navigation: { pathname: "/agents" } },
  },
} satisfies Meta<typeof Fixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkPage: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getAllByRole("heading", { level: 1 })).toHaveLength(1);
  await expect(
    canvas.getByRole("link", { name: "OpenAPI reference" }),
  ).toHaveAttribute("href", "/api/openapi.json");
  const select = canvas.getByRole("combobox", {
    name: "Where would you like to look?",
  });
  await userEvent.selectOptions(select, "products");
  await expect(select).toHaveValue("products");
  const form = select.closest("form")!;
  await expect(form).toHaveAttribute("action", "/api/v1/search");
  await expect(form).toHaveAttribute("method", "get");
  await expect(new FormData(form).get("type")).toBe("products");
  await expect(
    canvas.getByRole("button", { name: "Find content" }),
  ).toBeEnabled();
  await expect(canvasElement.textContent).not.toMatch(
    /pricing|quoted per engagement|standard day rate/i,
  );
  const disclosure = canvasElement.querySelector("details")!;
  await expect(disclosure.open).toBe(false);
  await userEvent.click(canvas.getByText("API and WebMCP reference"));
  await expect(disclosure.open).toBe(true);
  await expect(
    canvas.getByRole("link", { name: "Read the full API specification" }),
  ).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
  await userEvent.click(canvas.getByText("API and WebMCP reference"));
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkPage };
export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkPage,
};
export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};
export const MobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkPage,
};
export const TabletLight: Story = {
  globals: { viewport: { value: "tablet", isRotated: false } },
  play: checkPage,
};

export const SmallMobileLight: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: checkPage,
};
