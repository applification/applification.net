import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, userEvent, within } from "storybook/test";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { AgentPage } from "./agent-page";
import { sitePageCopy } from "@/lib/content/site-pages";

const markdown = `# ${sitePageCopy.home.title.join(" ")}\n\nSource: https://www.applification.net/\n\n${sitePageCopy.home.description}\n\n## How I work with AI\n\n${sitePageCopy.home.method}\n\n## Explore Applification\n\n- [Client work](https://www.applification.net/markdown/client-work)\n- [About Dave](https://www.applification.net/markdown/about)\n`;

function Fixture() {
  usePathname.mockReturnValue("/agent");
  return <><SiteHeader /><AgentPage title={sitePageCopy.home.title.join(" ")} path="/" markdown={markdown} /><SiteFooter /></>;
}

const meta = {
  title: "Agents/Markdown view",
  component: Fixture,
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/agent" } } },
} satisfies Meta<typeof Fixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkPage: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  await expect(canvas.getByRole("link", { name: "Agent" })).toHaveAttribute("aria-current", "page");
  await expect(canvas.getByRole("link", { name: "Human" })).toHaveAttribute("href", "/");
  await expect(canvas.getByRole("link", { name: "Open Markdown" })).toHaveAttribute("href", "/markdown");
  await expect(canvas.getByLabelText("Page Markdown")).toHaveTextContent(sitePageCopy.home.description);
  // Agent view stays dark even when the visitor has chosen the Human light theme.
  await expect(getComputedStyle(document.documentElement).colorScheme).toBe("dark only");
  await expect(getComputedStyle(document.body).backgroundColor).toBe("rgb(16, 18, 20)");
  await expect(getComputedStyle(canvas.getByLabelText("Page Markdown")).color).toBe("rgb(230, 237, 241)");
  await expect(canvas.queryByRole("button", { name: /Switch.*theme/ })).not.toBeInTheDocument();
  await expect(canvas.getByRole("link", { name: "Agents & API docs" })).toBeVisible();
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  const copy = canvas.getByRole("button", { name: "Copy Markdown" });
  copy.focus();
  await expect(copy).toHaveFocus();
  await userEvent.tab();
  await expect(canvas.getByRole("link", { name: "Open Markdown" })).toHaveFocus();
  await userEvent.tab();
  await expect(canvas.getByLabelText("Page Markdown")).toHaveFocus();
};

export const DesktopLight: Story = { play: checkPage };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: checkPage };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } }, play: checkPage };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } }, play: checkPage };
export const NarrowDesktop: Story = { globals: { viewport: { value: "narrowTablet", isRotated: false } }, play: checkPage };
export const SmallMobile: Story = { globals: { viewport: { value: "iphoneSeSmall", isRotated: false } }, play: checkPage };

export const MobileMenuOpen: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async (context) => {
    await checkPage(context);
    const canvas = within(context.canvasElement);
    await userEvent.click(canvas.getByRole("button", { name: "Open navigation menu" }));
    const menu = within(canvas.getByRole("navigation", { name: "Mobile navigation" }));
    await expect(menu.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/agent/products");
    await expect(menu.queryByRole("button", { name: /Switch.*theme/ })).not.toBeInTheDocument();
    await userEvent.keyboard("{Escape}");
    await expect(canvas.getByRole("button", { name: "Open navigation menu" })).toHaveFocus();
  },
};
