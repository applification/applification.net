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
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  const copy = canvas.getByRole("button", { name: "Copy Markdown" });
  copy.focus();
  await expect(copy).toHaveFocus();
  await userEvent.tab();
  await expect(canvas.getByRole("link", { name: "Open Markdown" })).toHaveFocus();
};

export const DesktopLight: Story = { play: checkPage };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: checkPage };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } }, play: checkPage };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } }, play: checkPage };
export const NarrowDesktop: Story = { globals: { viewport: { value: "narrowTablet", isRotated: false } }, play: checkPage };
export const SmallMobile: Story = { globals: { viewport: { value: "iphoneSeSmall", isRotated: false } }, play: checkPage };
