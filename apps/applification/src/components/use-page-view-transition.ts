"use client";

import { useEffect, useLayoutEffect, useRef, type MouseEvent } from "react";
import { useRouter } from "next/navigation";

const DURATION_MS = 450;
const MAX_CAPTURE_WAIT_MS = 1500;

type PendingNavigation = {
  from: string;
  to: string;
  finish: (arrived: boolean) => void;
};

export function usePageViewTransition(pathname: string | null) {
  const router = useRouter();
  const pending = useRef<PendingNavigation | null>(null);

  // router.push returns before the page renders. Hold the old snapshot until
  // React has committed the destination and its CSS-selected reader theme.
  useLayoutEffect(() => {
    const navigation = pending.current;
    if (navigation && pathname !== navigation.from) {
      navigation.finish(pathname === navigation.to);
    }
  }, [pathname]);

  useEffect(() => () => pending.current?.finish(false), []);

  return (event: MouseEvent<HTMLAnchorElement>, href: string, toAgent: boolean) => {
    // Modified clicks retain native open-in-new-tab/window behaviour.
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    if (href === pathname) {
      event.preventDefault();
      return;
    }

    const root = document.documentElement;
    if (root.dataset.themeTransition === "active") {
      event.preventDefault();
      return;
    }
    if (
      !pathname ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      typeof document.startViewTransition !== "function"
    ) return;

    event.preventDefault();
    const from = toAgent ? "inset(100% 0 0 0)" : "inset(0 0 100% 0)";
    let transition: ViewTransition | undefined;
    let resolveCommit: () => void = () => {};
    let navigationStarted = false;
    const committed = new Promise<void>(resolve => { resolveCommit = resolve; });
    const navigation: PendingNavigation = {
      from: pathname,
      to: href,
      finish: (arrived) => {
        window.clearTimeout(timeout);
        if (!arrived) transition?.skipTransition();
        resolveCommit();
      },
    };
    pending.current = navigation;

    // A slow or cancelled route still navigates normally; it must never leave
    // the browser's captured page frozen while waiting for the network.
    const timeout = window.setTimeout(() => navigation.finish(false), MAX_CAPTURE_WAIT_MS);
    const cleanup = () => {
      window.clearTimeout(timeout);
      if (pending.current !== navigation) return;
      pending.current = null;
      delete root.dataset.themeTransition;
      root.style.removeProperty("--theme-transition-duration");
      root.style.removeProperty("--theme-transition-clip-from");
    };
    const navigate = () => {
      if (navigationStarted) return;
      navigationStarted = true;
      router.push(href);
    };

    root.dataset.themeTransition = "active";
    root.style.setProperty("--theme-transition-duration", `${DURATION_MS}ms`);
    root.style.setProperty("--theme-transition-clip-from", from);
    try {
      transition = document.startViewTransition(() => {
        navigate();
        return committed;
      });
      transition.finished.then(cleanup, cleanup);
      void transition.ready.then(() => {
        root.animate(
          { clipPath: [from, "inset(0 0 0 0)"] },
          {
            duration: DURATION_MS,
            easing: "cubic-bezier(0.22, 1, 0.36, 1)",
            fill: "forwards",
            pseudoElement: "::view-transition-new(root)",
          },
        );
      }).catch(() => transition?.skipTransition());
    } catch {
      navigation.finish(false);
      cleanup();
      navigate();
    }
  };
}
