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

  await expect(
    canvas.getByText(`Dave Hudson · ${contractPositioning.role}`),
  ).toBeVisible();
  await expect(canvas.getByRole("link", { name: "Privacy" })).toHaveAttribute(
    "href",
    "/privacy",
  );
  await expect(canvas.queryByRole("link", { name: "Pricing" })).toBeNull();
  const view = canvas.getByRole("group", { name: "Page view" });
  const human = within(view).getByRole("link", { name: "Human" });
  const agent = within(view).getByRole("link", { name: "Agent" });
  await expect(human).toHaveAttribute("aria-current", "page");
  await expect(agent).toHaveAttribute("href", "/agent");
  await expect(getComputedStyle(view).position).toBe("fixed");
  await expect(getComputedStyle(view).fontSize).toBe("12px");
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

export const AgentDetail: Story = {
  render: () => {
    usePathname.mockReturnValue("/agent/products/contexture");
    return <SiteFooter />;
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
    return <SiteFooter />;
  },
  play: async ({ canvasElement }) => {
    await expect(within(canvasElement).queryByRole("group", { name: "Page view" })).not.toBeInTheDocument();
  },
};

export const PrivateReview: Story = {
  ...Contact,
  render: () => {
    usePathname.mockReturnValue("/contact/review/private-capability");
    return <SiteFooter />;
  },
};
