"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

const navigation = [
  { href: "/", label: "Home" },
  { href: "/client-work", label: "Client work" },
  { href: "/products", label: "Products" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

type ProductHeaderTheme = "plantry" | "storyloops" | "contexture" | "voiced";
const productHeaderThemeNames = new Set<ProductHeaderTheme>([
  "plantry",
  "storyloops",
  "contexture",
  "voiced",
]);

function getProductHeaderTheme(pathname: string | null) {
  const product = pathname?.match(/^\/products\/([^/]+)/)?.[1];

  if (product && productHeaderThemeNames.has(product as ProductHeaderTheme)) {
    return product as ProductHeaderTheme;
  }

  return null;
}

function isCurrentPath(pathname: string | null, href: string) {
  return pathname === href || (href !== "/" && pathname?.startsWith(`${href}/`) === true);
}

function MenuIcon({ open }: { open: boolean }) {
  return (
    <svg
      aria-hidden="true"
      className="size-5 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      {open ? (
        <path
          d="m6 6 12 12M18 6 6 18"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      ) : (
        <path
          d="M5 7h14M5 12h14M5 17h14"
          strokeLinecap="round"
          strokeWidth="1.8"
        />
      )}
    </svg>
  );
}

export function SiteHeader({ contactAvailable = true }: { contactAvailable?: boolean }) {
  const pathname = usePathname();
  const productHeaderTheme = getProductHeaderTheme(pathname);
  const reduceMotion = useReducedMotion();
  const [menuState, setMenuState] = useState({ open: false, pathname });
  const [scrolled, setScrolled] = useState(false);
  const [compact, setCompact] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const menuOpen = menuState.pathname === pathname && menuState.open;
  const visibleNavigation = contactAvailable
    ? navigation
    : navigation.filter((item) => item.href !== "/contact");

  useEffect(() => {
    let previousY = Math.max(0, window.scrollY);
    const syncScroll = () => {
      const y = Math.max(0, window.scrollY);
      setScrolled(y > 8);
      if (y <= 80 || y < previousY) setCompact(false);
      else if (y > previousY) setCompact(true);
      previousY = y;
    };
    syncScroll();
    window.addEventListener("scroll", syncScroll, { passive: true });
    return () => window.removeEventListener("scroll", syncScroll);
  }, []);

  useEffect(() => {
    if (!menuOpen) {
      return;
    }

    firstMenuLinkRef.current?.focus();

    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMenuState({ open: false, pathname });
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener("keydown", closeOnEscape);
    return () => document.removeEventListener("keydown", closeOnEscape);
  }, [menuOpen, pathname]);

  return (
    <header
      className="site-header relative z-40 h-16 w-full shrink-0"
      data-product-theme={productHeaderTheme ?? undefined}
      data-scrolled={scrolled}
      data-compact={compact}
    >
      <div className="site-header-surface">
        <div className="mx-auto flex h-full w-full items-center justify-between px-5 min-[700px]:w-[calc(100%-40px)] min-[700px]:max-w-[1200px] min-[700px]:px-0 min-[1024px]:w-[calc(100%-48px)]">
          <Link
            className={`site-header-brand inline-flex min-h-11 items-center gap-2.5 text-[var(--app-text-primary)] ${focusClasses}`}
            href="/"
            aria-label="Applification home"
          >
            <span
              aria-hidden="true"
              className="site-header-mark block h-[34px] w-12 bg-current [-webkit-mask:url('/brand/applification-mark-light.svg')_center/contain_no-repeat] [mask:url('/brand/applification-mark-light.svg')_center/contain_no-repeat]"
            />
            <span className="site-header-wordmark font-caption hidden text-sm leading-[18px] font-bold tracking-[1.3px] min-[520px]:block">
              APPLIFICATION
            </span>
          </Link>

          <nav
            aria-label="Primary navigation"
            className="site-header-navigation hidden items-center gap-5 min-[820px]:flex min-[1024px]:gap-[30px]"
          >
            {visibleNavigation.map((item) => {
              const current = isCurrentPath(pathname, item.href);

              return (
                <Link
                  aria-current={current ? "page" : undefined}
                  className={`relative isolate inline-flex min-h-10 items-center text-base font-medium text-[var(--app-text-secondary)] transition-colors hover:text-[var(--header-nav-active,var(--app-action))] aria-[current=page]:text-[var(--header-nav-active,var(--app-label-text))] ${focusClasses}`}
                  href={item.href}
                  key={item.href}
                >
                  {/* Keep the pill in the link's CSS coordinate space. Shared
                      layout projection can mistake sticky scroll restoration
                      for a page-length movement. */}
                  {current ? (
                    <span
                      aria-hidden="true"
                      className="absolute -inset-x-2 inset-y-1 -z-10 rounded-full bg-[var(--header-nav-selected,var(--app-selected))]"
                      data-testid="active-navigation-highlight"
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
            <ThemeSwitcher className="site-header-theme" />
          </nav>

          <div className="flex items-center min-[820px]:hidden">
            <motion.button
              ref={menuButtonRef}
              aria-controls="mobile-navigation"
              aria-expanded={menuOpen}
              aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
              className={`flex size-11 items-center justify-center rounded-full bg-[var(--app-control)] text-[var(--app-text-primary)] ${focusClasses}`}
              onClick={() =>
                setMenuState({ open: !menuOpen, pathname })
              }
              type="button"
              whileTap={reduceMotion ? undefined : { scale: 0.96 }}
            >
              <MenuIcon open={menuOpen} />
            </motion.button>
          </div>
        </div>

      </div>

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.nav
            animate={{ y: 0 }}
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-full border-y border-[var(--app-border)] bg-[var(--app-section)] px-5 py-5 shadow-lg min-[820px]:hidden"
            exit={reduceMotion ? undefined : { y: -6 }}
            id="mobile-navigation"
            initial={reduceMotion ? false : { y: -8 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.18,
              ease: "easeOut",
            }}
          >
            <div className="mx-auto flex max-w-md flex-col gap-1">
              {visibleNavigation.map((item, index) => {
                const current = isCurrentPath(pathname, item.href);

                return (
                  <Link
                    ref={index === 0 ? firstMenuLinkRef : undefined}
                    aria-current={current ? "page" : undefined}
                    className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-[var(--app-text-secondary)] hover:bg-[var(--app-muted-section)] hover:text-[var(--app-text-primary)] aria-[current=page]:bg-[var(--header-nav-selected,var(--app-selected))] aria-[current=page]:text-[var(--header-nav-active,var(--app-label-text))] ${focusClasses}`}
                    href={item.href}
                    key={item.href}
                    onClick={() => setMenuState({ open: false, pathname })}
                  >
                    {item.label}
                  </Link>
                );
              })}
              <div className="my-2 border-t border-[var(--app-border)] pt-2">
                <ThemeSwitcher labelled />
              </div>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
