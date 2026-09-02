import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import {
  applyStoredTheme,
  ThemeSwitcher,
  THEME_STORAGE_KEY,
} from "./theme-switcher";

const meta = {
  title: "Layout/Theme switcher",
  component: ThemeSwitcher,
  tags: ["autodocs"],
  decorators: [
    (Story) => (
      <div className="flex min-h-40 items-center justify-center bg-[var(--app-bg)]">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ThemeSwitcher>;

export default meta;
type Story = StoryObj<typeof meta>;

function resetThemeTestState() {
  const root = document.documentElement;

  delete root.dataset.themeTransition;
  root.dataset.theme = "light";
  root.style.removeProperty("--theme-transition-duration");
  root.style.removeProperty("--theme-transition-clip-from");
  window.localStorage.removeItem(THEME_STORAGE_KEY);
}

export const Light: Story = {};

export const Dark: Story = {
  globals: { theme: "dark" },
};

export const MenuRow: Story = {
  args: { labelled: true },
};

export const PaletteAndTransition: Story = {
  render: () => (
    <section className="flex w-full max-w-3xl flex-col gap-6 p-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-heading text-4xl">The same site, in a different light.</h1>
        <ThemeSwitcher />
      </div>
      <p className="text-[var(--app-text-secondary)]">
        Switch between slate blue and dark navy. The new theme expands from the toggle.
      </p>
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          ["Section", "bg-[var(--app-section)]"],
          ["Muted section", "bg-[var(--app-muted-section)]"],
          ["Card", "bg-[var(--app-card)]"],
        ].map(([label, background]) => (
          <div className={`flex flex-col gap-3 rounded-xl border p-5 ${background}`} key={label}>
            <h2 className="font-heading text-2xl">{label}</h2>
            <p className="text-[var(--app-text-secondary)]">Readable supporting text.</p>
            <p className="text-sm text-[var(--app-text-muted)]">Quieter details.</p>
            <span className="text-[var(--app-label-text)]">Blue accent</span>
          </div>
        ))}
      </div>
    </section>
  ),
  play: async ({ canvasElement }) => {
    resetThemeTestState();
    const button = await within(canvasElement).findByRole("button", {
      name: "Switch to dark theme",
    });
    try {
      button.focus();
      for (const theme of ["dark", "light"]) {
        await userEvent.keyboard("{Enter}");
        await waitFor(() => {
          expect(document.documentElement).toHaveAttribute("data-theme", theme);
          expect(document.documentElement).not.toHaveAttribute("data-theme-transition");
        });
        await expect(button).toHaveFocus();
        await expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe(theme);
      }
    } finally {
      resetThemeTestState();
    }
  },
};

export const PaletteDark: Story = {
  render: PaletteAndTransition.render,
  globals: { theme: "dark" },
};

export const StoredPreference: Story = {
  play: async ({ canvasElement }) => {
    resetThemeTestState();
    delete document.documentElement.dataset.theme;
    window.localStorage.setItem(THEME_STORAGE_KEY, "dark");

    try {
      applyStoredTheme();

      await expect(document.documentElement).toHaveAttribute(
        "data-theme",
        "dark",
      );
      await expect(
        await within(canvasElement).findByRole("button", {
          name: "Switch to light theme",
        }),
      ).toBeVisible();
    } finally {
      resetThemeTestState();
    }
  },
};

export const KeyboardAndPersistence: Story = {
  play: async ({ canvasElement }) => {
    const originalStartViewTransition = document.startViewTransition;
    const canvas = within(canvasElement);

    resetThemeTestState();
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: undefined,
    });
    const button = await canvas.findByRole("button", {
      name: "Switch to dark theme",
    });

    try {
      button.focus();
      await userEvent.keyboard("{Enter}");

      await expect(document.documentElement).toHaveAttribute(
        "data-theme",
        "dark",
      );
      await expect(button).toHaveAccessibleName("Switch to light theme");
      await expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe("dark");
    } finally {
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: originalStartViewTransition,
      });
      resetThemeTestState();
    }
  },
};

export const UnsupportedViewTransitions: Story = {
  play: async ({ canvasElement }) => {
    const originalStartViewTransition = document.startViewTransition;
    const canvas = within(canvasElement);

    resetThemeTestState();
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: undefined,
    });

    try {
      await userEvent.click(
        await canvas.findByRole("button", { name: "Switch to dark theme" }),
      );
      await expect(document.documentElement).toHaveAttribute(
        "data-theme",
        "dark",
      );
    } finally {
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: originalStartViewTransition,
      });
      resetThemeTestState();
    }
  },
};

export const ReducedMotion: Story = {
  play: async ({ canvasElement }) => {
    const originalMatchMedia = window.matchMedia;
    const originalStartViewTransition = document.startViewTransition;
    const startViewTransition = fn();
    const canvas = within(canvasElement);

    resetThemeTestState();
    Object.defineProperty(window, "matchMedia", {
      configurable: true,
      value: (query: string) => {
        if (query === "(prefers-reduced-motion: reduce)") {
          return {
            addEventListener: fn(),
            addListener: fn(),
            dispatchEvent: fn(() => true),
            matches: true,
            media: query,
            onchange: null,
            removeEventListener: fn(),
            removeListener: fn(),
          } satisfies MediaQueryList;
        }

        return originalMatchMedia.call(window, query);
      },
    });
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    try {
      await userEvent.click(
        await canvas.findByRole("button", { name: "Switch to dark theme" }),
      );
      await expect(document.documentElement).toHaveAttribute(
        "data-theme",
        "dark",
      );
      await expect(startViewTransition).not.toHaveBeenCalled();
    } finally {
      Object.defineProperty(window, "matchMedia", {
        configurable: true,
        value: originalMatchMedia,
      });
      Object.defineProperty(document, "startViewTransition", {
        configurable: true,
        value: originalStartViewTransition,
      });
      resetThemeTestState();
    }
  },
};
