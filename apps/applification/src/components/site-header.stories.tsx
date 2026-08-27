import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";

const meta = {
  title: "Layout/Site header",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      navigation: {
        pathname: "/",
      },
    },
  },
} satisfies Meta<typeof SiteHeader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const DesktopLight: Story = {
  play: async ({ canvasElement }) => {
    await expect(
      within(canvasElement).getByRole("button", {
        name: "Switch to dark theme",
      }),
    ).toBeVisible();
  },
};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
};

export const MobileLight: Story = {
  globals: { viewport: { value: "mobile", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(
      canvas.queryByRole("button", { name: "Switch to dark theme" }),
    ).not.toBeInTheDocument();
  },
};

export const MobileDarkMenuOpen: Story = {
  globals: {
    theme: "dark",
    viewport: { value: "mobile", isRotated: false },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const menuButton = canvas.getByRole("button", {
      name: "Open navigation menu",
    });

    await userEvent.click(menuButton);
    await expect(menuButton).toHaveAttribute("aria-expanded", "true");
    const mobileNavigation = canvas.getByRole("navigation", {
      name: "Mobile navigation",
    });

    await expect(mobileNavigation).toBeVisible();
    await expect(
      within(mobileNavigation).getByRole("button", {
        name: "Switch to light theme",
      }),
    ).toHaveTextContent("ThemeLight");
  },
};
