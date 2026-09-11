import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { usePathname, useRouter } from "@storybook/nextjs-vite/navigation.mock";
import { useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { AgentPage } from "./agent-info/agent-page";
import { SiteHeader } from "./site-header";
import { usePageViewTransition } from "./use-page-view-transition";

function Fixture() {
  const [path, setPath] = useState("/");
  usePathname.mockReturnValue(path);
  useRouter.mockReturnValue({
    back: fn(), bfcacheId: "page-view-story", forward: fn(), prefetch: fn(),
    push: (href: string) => setPath(href), refresh: fn(), replace: fn(),
  });
  const navigate = usePageViewTransition(path);
  return (
    <div className="flex min-h-screen flex-col">
      <SiteHeader />
      {path === "/agent" ? (
        <AgentPage title="Explore Applification" path="/" markdown="# Explore Applification\n\nThe same public content, ready for your agent." />
      ) : (
        <main className="flex-1 px-6 py-16 min-[720px]:px-12">
          <h1 className="font-heading text-5xl">Explore Applification</h1>
          <p className="mt-6 text-lg text-[var(--app-text-secondary)]">Switch to Agent view to read the page as Markdown.</p>
        </main>
      )}
      {/* Native anchors exercise the hook because Storybook's Next Link mock
          cancels clicks before forwarding them to the component. */}
      <nav aria-label="Page view" className="fixed bottom-3 left-1/2 flex -translate-x-1/2 gap-4 rounded-lg border bg-[var(--app-card)] px-4 text-sm">
        {[["Human", "/"], ["Agent", "/agent"]].map(([label, href]) => (
          <a key={href} href={href} aria-current={path === href ? "page" : undefined} className="flex min-h-11 items-center" onClick={event => {
            navigate(event, href, label === "Agent");
            if (!event.defaultPrevented) { event.preventDefault(); setPath(href); }
          }}>{label}</a>
        ))}
      </nav>
    </div>
  );
}

const meta = {
  title: "Layout/Page view transition",
  component: Fixture,
  parameters: { nextjs: { appDirectory: true, navigation: { pathname: "/" } } },
} satisfies Meta<typeof Fixture>;
export default meta;
type Story = StoryObj<typeof meta>;

const checkTransition: NonNullable<Story["play"]> = async ({ canvasElement }) => {
  const canvas = within(canvasElement);
  const root = document.documentElement;
  const originalAnimate = root.animate;
  const originalTransition = document.startViewTransition;
  let finish = () => {};
  // Storybook runs in an iframe that the browser may treat as hidden. Keep
  // capture/commit ordering deterministic here; production QA uses the real API.
  const animate = fn(() => { finish(); return {} as Animation; });
  root.animate = animate;
  document.startViewTransition = (callback) => {
    const update = typeof callback === "function" ? callback : callback?.update;
    const ready = Promise.resolve().then(() => update?.());
    const finished = new Promise<void>(resolve => { finish = resolve; });
    return { ready, finished, updateCallbackDone: ready, skipTransition: finish, types: new Set<string>() };
  };
  const originalTheme = root.dataset.theme;
  const originalStoredTheme = localStorage.getItem("applification-theme");
  try {
    for (const [label, from] of [["Agent", "inset(100% 0 0 0)"], ["Human", "inset(0 0 100% 0)"]]) {
      const link = canvas.getByRole("link", { name: label });
      link.focus();
      await userEvent.keyboard("{Enter}");
      await waitFor(() => expect(animate).toHaveBeenCalledWith(
        { clipPath: [from, "inset(0 0 0 0)"] },
        expect.objectContaining({ pseudoElement: "::view-transition-new(root)" }),
      ));
      await waitFor(() => expect(root).not.toHaveAttribute("data-theme-transition"));
      await expect(link).toHaveAttribute("aria-current", "page");
      await expect(link).toHaveFocus();
      await expect(root.dataset.theme).toBe(originalTheme);
      await expect(localStorage.getItem("applification-theme")).toBe(originalStoredTheme);
      await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(canvasElement.clientWidth);
    }
  } finally {
    root.animate = originalAnimate;
    document.startViewTransition = originalTransition;
  }
};

export const DesktopLight: Story = { play: checkTransition };
export const DesktopDark: Story = { globals: { theme: "dark" }, play: checkTransition };
export const MobileLight: Story = { globals: { viewport: { value: "mobile", isRotated: false } }, play: checkTransition };
export const MobileDark: Story = { globals: { theme: "dark", viewport: { value: "mobile", isRotated: false } }, play: checkTransition };

export const UnsupportedBrowser: Story = {
  play: async ({ canvasElement }) => {
    const original = document.startViewTransition;
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: undefined });
    try {
      const link = within(canvasElement).getByRole("link", { name: "Agent" });
      await userEvent.click(link);
      await expect(link).toHaveAttribute("href", "/agent");
      await expect(document.documentElement).not.toHaveAttribute("data-theme-transition");
    } finally {
      Object.defineProperty(document, "startViewTransition", { configurable: true, value: original });
    }
  },
};

export const ReducedMotion: Story = {
  play: async ({ canvasElement }) => {
    const originalMatchMedia = window.matchMedia;
    const originalTransition = document.startViewTransition;
    const transition = fn();
    window.matchMedia = (query) => query === "(prefers-reduced-motion: reduce)"
      ? { ...originalMatchMedia.call(window, query), matches: true }
      : originalMatchMedia.call(window, query);
    Object.defineProperty(document, "startViewTransition", { configurable: true, value: transition });
    try {
      await userEvent.click(within(canvasElement).getByRole("link", { name: "Agent" }));
      await expect(transition).not.toHaveBeenCalled();
      await expect(document.documentElement).not.toHaveAttribute("data-theme-transition");
    } finally {
      window.matchMedia = originalMatchMedia;
      Object.defineProperty(document, "startViewTransition", { configurable: true, value: originalTransition });
    }
  },
};

export const TransitionFailure: Story = {
  play: async ({ canvasElement }) => {
    const original = document.startViewTransition;
    document.startViewTransition = () => { throw new Error("Transition unavailable"); };
    try {
      const link = within(canvasElement).getByRole("link", { name: "Agent" });
      await userEvent.click(link);
      await expect(link).toHaveAttribute("aria-current", "page");
      await expect(document.documentElement).not.toHaveAttribute("data-theme-transition");
    } finally {
      document.startViewTransition = original;
    }
  },
};
