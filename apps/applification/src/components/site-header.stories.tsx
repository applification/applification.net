import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname } from "@storybook/nextjs-vite/navigation.mock";
import { expect, userEvent, waitFor, within } from "storybook/test";
import { useState } from "react";
import { SiteHeader } from "./site-header";

async function checkHeaderUtilities(canvasElement: HTMLElement, site: "profile" | "business" = "profile") {
  const canvas = within(canvasElement);
  if (site === "business") {
    const agents = canvas.getByRole("link", { name: "Agents & API docs" });
    await expect(agents).toBeVisible();
    await expect(agents).toHaveAttribute("href", "/agents");
    await expect(getComputedStyle(agents).opacity).toBe("1");
  } else {
    await expect(canvas.queryByRole("link", { name: /^Agents & API docs/ })).not.toBeInTheDocument();
    await expect(canvas.queryByRole("link", { name: "Products" })).not.toBeInTheDocument();
    await expect(canvas.getByRole("link", { name: "Dave Hudson home" })).toBeVisible();
  }
  await expect(canvas.queryByRole("group", { name: "Page view" })).not.toBeInTheDocument();
}

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
          { href: "/writing/ai-native-software-needs-rigour", label: "Read the writing" },
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
      { label: "Read the writing", active: "Writing" },
    ]) {
      window.scrollTo(0, 800);
      await waitFor(() => expect(header).toHaveAttribute("data-compact", "true"));
      await checkHeaderUtilities(canvasElement);

      // Sample every rendered frame through both same-section and cross-section
      // route changes. The highlight may move between links, but it must never
      // escape the navigation during scroll restoration.
      const escapedFrames: Array<{ top: number; left: number }> = [];
      const sampledLefts: number[] = [];
      const frames = new Promise<void>(resolve => {
        const started = performance.now();
        const sample = () => {
          const pill = canvas.getByTestId("active-navigation-highlight");
          const navigation = pill.parentElement!;
          if (getComputedStyle(pill).visibility === "visible" && Number(getComputedStyle(pill).opacity) > 0) {
            const bounds = pill.getBoundingClientRect();
            sampledLefts.push(bounds.left);
            const navigationBounds = navigation.getBoundingClientRect();
            const headerBounds = header.getBoundingClientRect();
            if (
              bounds.top < headerBounds.top - 1 || bounds.bottom > headerBounds.bottom + 1 ||
              bounds.left < navigationBounds.left - 8 || bounds.right > navigationBounds.right + 8
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
      const activeLink = canvas.getByRole("link", { name: destination.active });
      const pill = canvas.getByTestId("active-navigation-highlight");
      const pillBounds = pill.getBoundingClientRect();
      const linkBounds = activeLink.getBoundingClientRect();
      await expect(activeLink).toHaveAttribute("aria-current", "page");
      await expect(Math.abs(pillBounds.left - linkBounds.left + 8)).toBeLessThan(1);
      await expect(Math.abs(pillBounds.width - linkBounds.width - 16)).toBeLessThan(1);
      await expect(escapedFrames, "The active pill must stay inside the navigation during scroll restoration").toEqual([]);
      if (destination.active === "Writing") {
        const start = sampledLefts[0];
        const end = pillBounds.left;
        await expect(
          sampledLefts.some((left) => left > Math.min(start, end) + 1 && left < Math.max(start, end) - 1),
          "The active pill must animate between different navigation sections",
        ).toBe(true);
      }
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
      return <SiteHeader site="business" />;
    },
    play: async ({ canvasElement }) => {
      const canvas = within(canvasElement);
      const header = canvasElement.querySelector("header");

      await expect(header).toHaveAttribute("data-product-theme", expectedTheme);
      await expect(canvas.getByRole("link", { name: "Products" })).toHaveAttribute(
        "aria-current",
        "page",
      );
      await expect(canvas.getByRole("link", { name: "Applification home" })).not.toHaveAttribute("aria-current");
      await expect(getComputedStyle(header!.querySelector(".site-header-surface")!).backgroundColor).toBe(
        expectedBackground,
      );
    },
  };
}

export const DesktopLight: Story = {
  play: async ({ canvasElement }) => {
    await checkHeaderUtilities(canvasElement);
    const canvas = within(canvasElement);

    await expect(canvas.getByText("DAVE HUDSON")).toBeVisible();
    const navigation = canvas.getByRole("navigation", { name: "Primary navigation" });
    const first = within(navigation).getAllByRole("link")[0];
    await expect(first).toHaveAccessibleName("Client work");
    await expect(first).toHaveAttribute("href", "/client-work");
    await expect(first).not.toHaveAttribute("aria-current");
    const contactLink = canvas.getByRole("link", { name: "Contact" });
    await expect(contactLink).toBeVisible();
    await expect(contactLink).toHaveAttribute("href", "/contact?route=contract");
    await expect(canvas.getByRole("link", { name: "CV" })).toHaveAttribute("download");
    const business = canvas.getByRole("link", { name: /Applification.net.*opens in a new tab/ });
    await expect(business).toHaveAttribute("href", "https://applification.net");
    await expect(business).toHaveAttribute("target", "_blank");
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
    await checkHeaderUtilities(canvasElement);
    const canvas = within(canvasElement);
    await expect(canvas.queryByRole("navigation", { name: "Primary navigation" })).toBeNull();
    await expect(canvas.getByRole("button", { name: "Open navigation menu" })).toBeVisible();
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
  },
};

export const Laptop: Story = {
  ...DesktopLight,
  globals: { viewport: { value: "compactLaptop", isRotated: false } },
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
    return <SiteHeader site="business" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    const productsLink = canvas.getByRole("link", { name: "Products" });

    await expect(productsLink).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByRole("link", { name: "Applification home" })).not.toHaveAttribute("aria-current");
    await expect(canvas.getByTestId("active-navigation-highlight")).toBeVisible();
  },
};

export const DesktopContact: Story = {
  render: () => {
    usePathname.mockReturnValue("/contact");
    return <SiteHeader />;
  },
  play: async ({ canvasElement }) => {
    await checkHeaderUtilities(canvasElement);
    const canvas = within(canvasElement);
    const contactLink = canvas.getByRole("link", { name: "Contact" });

    await expect(contactLink).toHaveAttribute("aria-current", "page");
    await expect(canvas.getByTestId("active-navigation-highlight")).toBeVisible();
  },
};

export const AgentDetail: Story = {
  render: () => {
    usePathname.mockReturnValue("/agent/products/contexture");
    return <SiteHeader site="business" />;
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await checkHeaderUtilities(canvasElement, "business");
    await expect(canvas.getByRole("link", { name: "Products" })).toHaveAttribute("href", "/agent/products");
    await expect(canvas.getByRole("link", { name: "Applification home" })).toHaveAttribute("href", "/agent");
    await expect(canvas.getByRole("link", { name: "Discuss a project" })).toHaveAttribute("href", "/contact?route=general");
    await expect(canvasElement.querySelector("header")).not.toHaveAttribute("data-product-theme");
    await expect(canvas.queryByRole("button", { name: /Switch.*theme/ })).not.toBeInTheDocument();
  },
};

export const PrivateReview: Story = {
  render: () => {
    usePathname.mockReturnValue("/contact/review/private-capability");
    return <SiteHeader />;
  },
  play: async ({ canvasElement }) => {
    await checkHeaderUtilities(canvasElement);
  },
};

export const SmallMobile: Story = {
  globals: { viewport: { value: "iphoneSeSmall", isRotated: false } },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement);
    await checkHeaderUtilities(canvasElement);
    const brand = canvas.getByRole("link", { name: "Dave Hudson home" });
    const menu = canvas.getByRole("button", { name: "Open navigation menu" });
    await expect(brand.getBoundingClientRect().right + 8).toBeLessThanOrEqual(menu.getBoundingClientRect().left);
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
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
    await checkHeaderUtilities(canvasElement);
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
    await checkHeaderUtilities(canvasElement);
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
    const first = within(mobileNavigation).getAllByRole("link")[0];
    await expect(first).toHaveAccessibleName("Client work");
    await expect(first).toHaveAttribute("href", "/client-work");
    await expect(first).toHaveFocus();
    await expect(within(mobileNavigation).getByRole("link", { name: "CV" })).toHaveAttribute("download");
    await expect(within(mobileNavigation).getByRole("link", { name: /Applification.net/ })).toHaveAttribute("href", "https://applification.net");
    await expect(within(mobileNavigation).queryByRole("link", { name: "Products" })).toBeNull();
    await expect(
      within(mobileNavigation).getByRole("button", {
        name: "Switch to light theme",
      }),
    ).toHaveTextContent("ThemeLight");
  },
};
