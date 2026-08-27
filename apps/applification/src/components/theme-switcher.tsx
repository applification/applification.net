"use client";

import { useCallback, useLayoutEffect, useRef, useState } from "react";
import { flushSync } from "react-dom";

export const THEME_STORAGE_KEY = "applification-theme";

const DARK_THEME_QUERY = "(prefers-color-scheme: dark)";
const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)";
const TRANSITION_DURATION_MS = 400;

type Theme = "light" | "dark";

function isTheme(value: string | null): value is Theme {
  return value === "light" || value === "dark";
}

function getRootTheme() {
  const theme = document.documentElement.dataset.theme ?? null;
  return isTheme(theme) ? theme : null;
}

function getStoredTheme() {
  try {
    const theme = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isTheme(theme) ? theme : null;
  } catch {
    return null;
  }
}

function getResolvedTheme(): Theme {
  const rootTheme = getRootTheme();

  if (rootTheme) {
    return rootTheme;
  }

  return window.matchMedia(DARK_THEME_QUERY).matches ? "dark" : "light";
}

function storeTheme(theme: Theme) {
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, theme);
  } catch {
    // The selected theme still applies for this page when storage is unavailable.
  }
}

export function applyStoredTheme() {
  const root = document.documentElement;
  const storedTheme = getStoredTheme();

  if (!getRootTheme() && storedTheme) {
    root.dataset.theme = storedTheme;
  }

  return getResolvedTheme();
}

function SunIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px] stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="4" strokeWidth="1.8" />
      <path
        d="M12 2.5v2M12 19.5v2M4.5 12h-2M21.5 12h-2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M18.7 5.3l-1.4 1.4M6.7 17.3l-1.4 1.4"
        strokeLinecap="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function MoonIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[18px] stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M20 15.4A8 8 0 0 1 8.6 4 8.1 8.1 0 1 0 20 15.4Z"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type ThemeSwitcherProps = {
  className?: string;
  labelled?: boolean;
};

export function ThemeSwitcher({
  className = "",
  labelled = false,
}: ThemeSwitcherProps) {
  const [theme, setTheme] = useState<Theme | null>(null);
  const transitioningRef = useRef(false);

  useLayoutEffect(() => {
    const root = document.documentElement;

    const syncTheme = () => setTheme(getResolvedTheme());
    const darkThemeQuery = window.matchMedia(DARK_THEME_QUERY);
    const syncSystemTheme = () => {
      if (!getRootTheme()) {
        syncTheme();
      }
    };
    const observer = new MutationObserver(syncTheme);

    applyStoredTheme();
    syncTheme();
    darkThemeQuery.addEventListener("change", syncSystemTheme);
    observer.observe(root, {
      attributeFilter: ["data-theme"],
      attributes: true,
    });

    return () => {
      darkThemeQuery.removeEventListener("change", syncSystemTheme);
      observer.disconnect();
    };
  }, []);

  const handleToggle = useCallback(
    (event: React.MouseEvent<HTMLButtonElement>) => {
      const root = document.documentElement;

      if (
        transitioningRef.current ||
        root.dataset.themeTransition === "active"
      ) {
        return;
      }

      const nextTheme = getResolvedTheme() === "dark" ? "light" : "dark";
      const applyTheme = () => {
        root.dataset.theme = nextTheme;
        storeTheme(nextTheme);
        setTheme(nextTheme);
      };

      if (
        window.matchMedia(REDUCED_MOTION_QUERY).matches ||
        typeof document.startViewTransition !== "function"
      ) {
        applyTheme();
        return;
      }

      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const { left, top, width, height } =
        event.currentTarget.getBoundingClientRect();
      const x = left + width / 2;
      const y = top + height / 2;
      const maxRadius = Math.hypot(
        Math.max(x, viewportWidth - x),
        Math.max(y, viewportHeight - y),
      );
      const center = `${(x / viewportWidth) * 100}% ${(y / viewportHeight) * 100}%`;
      const radiusReference =
        Math.hypot(viewportWidth, viewportHeight) / Math.SQRT2;
      const radius = `${(maxRadius / radiusReference) * 100}%`;
      const clipPath = [
        `circle(0% at ${center})`,
        `circle(${radius} at ${center})`,
      ];

      const cleanup = () => {
        transitioningRef.current = false;
        delete root.dataset.themeTransition;
        root.style.removeProperty("--theme-transition-duration");
        root.style.removeProperty("--theme-transition-clip-from");
      };

      transitioningRef.current = true;
      root.dataset.themeTransition = "active";
      root.style.setProperty(
        "--theme-transition-duration",
        `${TRANSITION_DURATION_MS}ms`,
      );
      root.style.setProperty("--theme-transition-clip-from", clipPath[0]);

      try {
        const transition = document.startViewTransition(() => {
          flushSync(applyTheme);
        });

        transition.finished.then(cleanup, cleanup);
        void transition.ready
          .then(() => {
            root.animate(
              { clipPath },
              {
                duration: TRANSITION_DURATION_MS,
                easing: "ease-in-out",
                fill: "forwards",
                pseudoElement: "::view-transition-new(root)",
              },
            );
          })
          .catch(() => undefined);
      } catch {
        cleanup();
        applyTheme();
      }
    },
    [],
  );

  const targetTheme = theme === "dark" ? "light" : "dark";
  const label = theme ? `Switch to ${targetTheme} theme` : "Switch colour theme";
  const buttonClasses = labelled
    ? "flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-base font-medium text-[var(--app-text-secondary)] hover:bg-[var(--app-muted-section)] hover:text-[var(--app-text-primary)]"
    : "inline-flex size-9 shrink-0 items-center justify-center rounded-lg text-[var(--app-text-secondary)] hover:bg-[var(--app-muted-section)] hover:text-[var(--app-text-primary)]";

  return (
    <button
      aria-label={label}
      className={`${buttonClasses} transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] ${className}`}
      onClick={handleToggle}
      title={label}
      type="button"
    >
      {labelled ? <span>Theme</span> : null}
      <span className={labelled ? "flex items-center gap-2 text-sm" : undefined}>
        {labelled ? (
          <span>{theme === "dark" ? "Light" : "Dark"}</span>
        ) : null}
        {theme === "dark" ? <SunIcon /> : <MoonIcon />}
      </span>
    </button>
  );
}
