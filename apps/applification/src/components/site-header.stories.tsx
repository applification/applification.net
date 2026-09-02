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

function productHeaderStory(
  pathname: `/products/${"contexture" | "plantry" | "storyloops" | "voiced"}`,
  expectedTheme: string,
  expectedBackground: string,
): Story {
  return {
    render: () => {
      usePathname.mockReturnValue(pathname);
      return <SiteHeader />;
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const header = canvasElement.querySelector("header");

      await expect(header).toHaveAttribute("data-product-theme", expectedTheme);
      await expect(canvas.getByRole("link", { name: "Products" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(canvas.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
      await expect(getComputedStyle(header!).backgroundColor).toBe(
        expectedBackground,
      );
    },
  };
}

export const DesktopLight: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);

    await expect(canvas.getByText("APPLIFICATION")).toBeVisible();
    const navigation = canvas.getByRole("navigation", { name: "Primary navigation" });
    const home = within(navigation).getAllByRole("link")[0];
    await expect(home).toHaveAccessibleName("Home");
    await expect(home).toHaveAttribute("href", "/");
    await expect(home).toHaveAttribute("aria-current", "page");
    const contactLink = canvas.getByRole("link", { name: "Contact" });
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute("href", "/contact");
    await expect(
      canvas.getByRole("button", { name: "Switch to dark theme" }),
    ).toBeVisible();
  },
};

export const DesktopDark: Story = {
  globals: { theme: "dark" },
};

export const NarrowDesktop: Story = {
  globals: { viewport: { value: "narrowTablet", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const brand = canvas.getByRole("link", { name: "Applification home" });
    const navigation = canvas.getByRole("navigation", { name: "Primary navigation" });
    await expect(navigation).toBeVisible();
    await expect(brand.getBoundingClientRect().right + 16).toBeLessThanOrEqual(
      navigation.getBoundingClientRect().left,
    );
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const ContactUnavailable: Story = {
  args: { contactAvailable: false },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await expect(
      canvas.queryByRole("link", { name: "Contact" }),
    ).not.toBeInTheDocument();
  },
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
    await expect(canvas.getByRole("link", { name: "Home" })).not.toHaveAttribute("aria-current");
    await expect(canvas.getByTestId("active-navigation-highlight")).toBeVisible();
  },
};

export const DesktopContact: Story = {
  render: () => {
    usePathname.mockReturnValue("/contact");
    return <SiteHeader />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const contactLink = canvas.getByRole("link", { name: "Contact" });

    await expect(contactLink).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByTestId("active-navigation-highlight")).toBeVisible();
  },
};

export const DesktopPlantry = productHeaderStory(
  "/products/plantry",
  "plantry",
  "rgb(255, 251, 239)",
);

export const DesktopStoryLoops = productHeaderStory(
  "/products/storyloops",
  "storyloops",
  "rgb(249, 250, 251)",
);

export const DesktopContexture = productHeaderStory(
  "/products/contexture",
  "contexture",
  "rgb(30, 30, 46)",
);

export const DesktopVoiced = productHeaderStory(
  "/products/voiced",
  "voiced",
  "rgb(234, 243, 237)",
);

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
    const home = within(mobileNavigation).getAllByRole("link")[0];
    await expect(home).toHaveAccessibleName("Home");
    await expect(home).toHaveAttribute("href", "/");
    await expect(home).toHaveAttribute("aria-current", "page");
    await expect(home).toHaveFocus();
    await expect(
      within(mobileNavigation).getByRole("button", {
        name: "Switch to light theme",
      }),
    ).toHaveTextContent("ThemeLight");
  },
};
