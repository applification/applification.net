import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, within, userEvent, waitFor } from "storybook/test";
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
  await expect(canvas.getByRole("heading", { level: 1 })).toHaveTextContent("Explore my work with your AI.");
  await expect(canvas.getByRole("button", { name: "Copy a starter prompt" })).toBeVisible();
  await expect(canvas.getByText(/Enable web access/)).toBeVisible();
  await expect(
    canvas.getByRole("link", { name: "OpenAPI reference" }),
  ).toHaveAttribute("href", "/api/openapi.json");
  await expect(
    canvas.getByRole("link", { name: "Sandbox first call" }),
  ).toHaveAttribute("href", "/api/v1/sandbox");
  await expect(
    canvas.getByRole("link", { name: "Make the first call" }),
  ).toHaveAttribute("href", "/api/v1/sandbox");
  await expect(canvas.getAllByText(/free tier/i).length).toBeGreaterThan(0);
  const select = canvas.getByRole("combobox", {
    name: "Where would you like to look?",
  });
  await expect(select.getBoundingClientRect().height).toBe(44);
  await userEvent.click(select);
  const page = within(canvasElement.ownerDocument.body);
  for (const name of ["Client work", "Writing", "Products"]) {
    await waitFor(() =>
      expect(page.getByRole("option", { name })).toBeVisible(),
    );
  }
  await userEvent.keyboard("{End}{Enter}");
  await expect(select).toHaveTextContent("Products");
  await waitFor(() => expect(select).toHaveFocus());
  const form = select.closest("form")!;
  await expect(form).toHaveAttribute("action", "/api/v1/search");
  await expect(form).toHaveAttribute("method", "get");
  await expect(new FormData(form).get("type")).toBe("products");
  await expect(new FormData(form).getAll("type")).toHaveLength(1);
  await userEvent.tab();
  await expect(
    canvas.getByRole("textbox", { name: "Search words (optional)" }),
  ).toHaveFocus();
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
  await expect(canvas.getByText(/On 429, wait at least Retry-After/)).toBeVisible();
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

const checkMenuDismissal: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const select = within(canvasElement).getByRole("combobox", {
    name: "Where would you like to look?",
  });
  await userEvent.click(select);
  const menu = within(canvasElement.ownerDocument.body).getByRole("listbox");
  await waitFor(() =>
    expect(
      within(menu).getByRole("option", { name: "Client work" }),
    ).toBeVisible(),
  );
  await waitFor(() =>
    expect(
      within(menu).getByRole("option", { name: "Client work" }),
    ).toHaveFocus(),
  );
  await expect(within(menu).getAllByRole("option")).toHaveLength(3);
  await expect(menu.getBoundingClientRect().left).toBeGreaterThanOrEqual(0);
  await expect(menu.getBoundingClientRect().right).toBeLessThanOrEqual(
    window.innerWidth,
  );
  await userEvent.keyboard("{Escape}");
  await waitFor(() => expect(select).toHaveFocus());
  await expect(select).toHaveTextContent("Client work");
  await expect(select).toHaveAttribute("aria-expanded", "false");
};
export const MenuDismissalLight: Story = { play: checkMenuDismissal };
export const MenuDismissalDark: Story = {
  globals: { theme: "dark" },
  play: checkMenuDismissal,
};
export const MenuDismissalMobileDark: Story = {
  globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } },
  play: checkMenuDismissal,
};
