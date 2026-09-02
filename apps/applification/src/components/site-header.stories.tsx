import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState } from "react";
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

function ScrollNavigationFixture() {
  const [pathname, setPathname] = useState("/client-work");
  usePathname.mockReturnValue(pathname);
  return (
    <div>
      <SiteHeader />
      <main className="min-h-[2000px] px-8 pt-[900px]">
        {[
          { href: "/client-work/logically", label: "Read the complete case" },
          { href: "/products/contexture", label: "Explore Contexture" },
        ].map(({ href, label }) => (
          <a className="mr-6" href={href} key={href} onClick={event => {
            event.preventDefault();
            setPathname(href);
            window.scrollTo(0, 0);
          }}>{label}</a>
        ))}
      </main>
    </div>
  );
}

export const ScrollNavigation: Story = {
  render: () => <ScrollNavigationFixture />,
  globals: { viewport: { value: "desktop", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const header = canvasElement.querySelector("header")!;
    for (const destination of [
      { label: "Read the complete case", active: "Client work" },
      { label: "Explore Contexture", active: "Products" },
    ]) {
      window.scrollTo(0, 800);
      await waitFor(() => expect(header).toHaveAttribute("data-compact", "true"));

      // Sample every rendered frame through both same-section and cross-section
      // route changes. The highlight must remain anchored to its current link.
      const escapedFrames: Array<{ top: number; left: number }> = [];
      const frames = new Promise<void>(resolve => {
        const started = performance.now();
        const sample = () => {
          const pill = canvas.getByTestId("active-navigation-highlight");
          const link = pill.parentElement!;
          if (getComputedStyle(link).visibility === "visible" && Number(getComputedStyle(link).opacity) > 0) {
            const bounds = pill.getBoundingClientRect();
            const linkBounds = link.getBoundingClientRect();
            const headerBounds = header.getBoundingClientRect();
            if (
              bounds.top < headerBounds.top - 1 || bounds.bottom > headerBounds.bottom + 1 ||
              Math.abs(bounds.top - linkBounds.top - 4) > 1 ||
              Math.abs(bounds.left - linkBounds.left + 8) > 1
            ) escapedFrames.push({ top: bounds.top, left: bounds.left });
          }
          if (performance.now() - started < 1200) requestAnimationFrame(sample);
          else resolve();
        };
        requestAnimationFrame(sample);
      });
      await userEvent.click(canvas.getByRole("link", { name: destination.label }));
      await frames;
      await expect(header).toHaveAttribute("data-compact", "false");
      await expect(canvas.getByRole("link", { name: destination.active })).toHaveAttribute("aria-current", "page");
      await expect(escapedFrames, "The active pill must stay anchored to its navigation link during scroll restoration").toEqual([]);
    }
  },
};

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
      await expect(getComputedStyle(header!.querySelector(".site-header-surface")!).backgroundColor).toBe(
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
