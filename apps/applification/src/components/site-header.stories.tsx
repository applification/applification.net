import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, userEvent, within } from "storybook/test";
import { SiteHeader } from "./site-header";

const meta = {
  title: "Layout/Site header",
  component: SiteHeader,
  tags: ["autodocs"],
  parameters: {
    nextjs: {
      appDirectory: true,
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
    const canvas = within(canvasElement);

    await expect(canvas.getByText("APPLIFICATION")).toBeVisible();
    await expect(
      canvas.getByRole("link", { name: "Discuss a contract" }),
    ).toBeVisible();
    await expect(
      canvas.queryByRole("button", { name: "Switch to dark theme" }),
    ).not.toBeInTheDocument();
  },
};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
};

export const DesktopProducts: Story = {
  render: () => {
    usePathname.mockReturnValue("/products");
    return <SiteHeader />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const productsLink = canvas.getByRole("link", { name: "Products" });

    await expect(productsLink).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByTestId("active-navigation-highlight")).toBeVisible();
  },
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
