import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { contractPositioning } from "@/lib/contract-positioning";
import { SiteFooter } from "./site-footer";

const meta = {
  title: "Layout/Site footer",
  component: SiteFooter,
  tags: ["autodocs"],
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/" } } },
  render: () => {
    usePathname.mockReturnValue("/");
    return <SiteFooter />;
  },
} satisfies Meta<typeof SiteFooter>;

export default meta;
type Story = StoryObj<typeof meta>;

const checkPositioning: NonNullable<Story["play"]> = async ({
  canvasElement,
}) => {
  const canvas = within(canvasElement);

  await expect(canvas.getByText("Dave Hudson", { exact: true })).toBeVisible();
  await expect(canvas.getByText(contractPositioning.role)).toBeVisible();
  const privacy = canvas.getByRole("link", { name: /Privacy.*opens in a new tab/ });
  await expect(privacy).toHaveAttribute("href", "https://applification.net/privacy");
  await expect(privacy).toHaveAttribute("target", "_blank");
  await expect(canvas.getByRole("link", { name: /Applification.net.*opens in a new tab/ })).toHaveAttribute("href", "https://applification.net");
  await expect(canvas.queryByRole("link", { name: /GitHub/ })).toBeNull();
  await expect(canvas.queryByRole("link", { name: "Pricing" })).toBeNull();
  const view = within(canvas.getByRole("group", { name: "Page view" }));
  await expect(view.getByRole("link", { name: "Human" })).toHaveAttribute("aria-current", "page");
  await expect(view.getByRole("link", { name: "Agent" })).toHaveAttribute("href", "/agent");
  await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
    canvasElement.clientWidth,
  );
};

export const DesktopLight: Story = { play: checkPositioning };

export const DesktopDark: Story = {
  globals: { theme: "dark" },
  play: checkPositioning,
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: checkPositioning,
};

export const MobileDark: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: checkPositioning,
};

export const SmallMobile: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: checkPositioning,
};

export const BusinessDesktop: Story = {
  render: () => {
    usePathname.mockReturnValue("/");
    return <SiteFooter site="business" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByText("Applification Ltd")).toBeVisible();
    await expect(canvas.getByRole("link", { name: "Privacy" })).toHaveAttribute("href", "/privacy");
    const view = canvas.getByRole("group", { name: "Page view" });
    const human = within(view).getByRole("link", { name: "Human" });
    const agent = within(view).getByRole("link", { name: "Agent" });
    await expect(human).toHaveAttribute("aria-current", "page");
    await expect(agent).toHaveAttribute("href", "/agent");
    await expect(getComputedStyle(view).position).toBe("fixed");
    const bounds = view.getBoundingClientRect();
    await expect(bounds.width).toBeLessThan(160);
    await expect(Math.abs(bounds.left + bounds.width / 2 - window.innerWidth / 2)).toBeLessThan(1);
    await expect(window.innerHeight - bounds.bottom).toBe(12);
    for (const link of [human, agent]) {
      await expect(link.getBoundingClientRect().height).toBeGreaterThanOrEqual(44);
      await expect(link.getBoundingClientRect().width).toBeGreaterThanOrEqual(44);
    }
    human.focus();
    await userEvent.tab();
    await expect(agent).toHaveFocus();
  },
};

export const BusinessMobile: Story = {
  ...BusinessDesktop,
  globals: { viewport: { value: "mobile", isRotated: false } },
};

export const AgentDetail: Story = {
  render: () => {
    usePathname.mockReturnValue("/agent/products/contexture");
    return <SiteFooter site="business" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(canvas.getByRole("link", { name: "Agent" })).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: "Human" })).toHaveAttribute("href", "/products/contexture");
  },
};

export const Contact: Story = {
  render: () => {
    usePathname.mockReturnValue("/contact");
    return <SiteFooter site="business" />;
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("group", { name: "Page view" })).not.toBeInTheDocument();
  },
};

export const PrivateReview: Story = {
  ...Contact,
  render: () => {
    usePathname.mockReturnValue("/contact/review/private-capability");
    return <SiteFooter site="business" />;
  },
};
