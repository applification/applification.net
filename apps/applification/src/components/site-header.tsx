"use client";

import type { CSSProperties } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import { ThemeSwitcher } from "./theme-switcher";

const navigation = [
  { href: "/products", label: "Products" },
  { href: "/client-work", label: "Client work" },
  { href: "/writing", label: "Writing" },
  { href: "/about", label: "About" },
];

const contactHref =
  "mailto:dave@applification.net?subject=Project%20enquiry";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

type ProductHeaderStyle = CSSProperties & Record<`--${string}`, string>;
type ProductHeaderTheme = "plantry" | "storyloops" | "contexture" | "voiced";

const productHeaderThemes: Record<ProductHeaderTheme, ProductHeaderStyle> = {
  plantry: {
    "--app-bg": "light-dark(#fffbef, #102a3a)",
    "--app-section": "light-dark(#fffdf7, #102a3a)",
    "--app-muted-section": "light-dark(#f3eee0, #193b4a)",
    "--app-selected": "light-dark(#e3f3e6, #1d5037)",
    "--app-control": "light-dark(#f3eee0, #193b4a)",
    "--app-label": "light-dark(#e3f3e6, #1d5037)",
    "--app-text-primary": "light-dark(#153447, #fffbef)",
    "--app-text-secondary": "light-dark(#526879, #d7e3e3)",
    "--app-border": "light-dark(#ded5c4, #466474)",
    "--app-label-text": "light-dark(#23683b, #9be4b1)",
    "--app-action": "light-dark(#153447, #78d696)",
    "--app-action-hover": "light-dark(#204f67, #9be4b1)",
    "--app-text-on-action": "light-dark(#fffbef, #102a3a)",
    "--app-focus": "light-dark(#2e7d4a, #9be4b1)",
    "--header-nav-active": "light-dark(#153447, #78d696)",
    "--header-nav-selected": "light-dark(#f3eee0, #193b4a)",
  },
  storyloops: {
    "--app-bg": "light-dark(#f9fafb, #111827)",
    "--app-section": "light-dark(#f9fafb, #111827)",
    "--app-muted-section": "light-dark(#e7e9f7, #1e293b)",
    "--app-selected": "light-dark(#e1e4f8, #172554)",
    "--app-control": "light-dark(#e7e9f7, #1e293b)",
    "--app-label": "light-dark(#e1e4f8, #172554)",
    "--app-text-primary": "light-dark(#303347, #f8fafc)",
    "--app-text-secondary": "light-dark(#65697a, #cbd5e1)",
    "--app-border": "light-dark(#e1e3ea, #334155)",
    "--app-label-text": "light-dark(#555bcd, #b9d2ff)",
    "--app-action": "light-dark(#0b1220, #e7e9f7)",
    "--app-action-hover": "light-dark(#1e293b, #ffffff)",
    "--app-text-on-action": "light-dark(#f8fafc, #303347)",
    "--app-focus": "light-dark(#6c63d9, #b9d2ff)",
    "--header-nav-active": "light-dark(#0369a1, #7dd3fc)",
    "--header-nav-selected": "light-dark(#e0f2fe, #172554)",
  },
  contexture: {
    "--app-bg": "#1e1e2e",
    "--app-section": "#1e1e2e",
    "--app-muted-section": "#313244",
    "--app-selected": "#313244",
    "--app-control": "#313244",
    "--app-label": "#313244",
    "--app-text-primary": "#cdd6f4",
    "--app-text-secondary": "#bac2de",
    "--app-border": "#45475a",
    "--app-label-text": "#89dceb",
    "--app-action": "#cba6f7",
    "--app-action-hover": "#d8b4fe",
    "--app-text-on-action": "#1e1e2e",
    "--app-focus": "#89dceb",
    "--header-nav-active": "#cba6f7",
    "--header-nav-selected": "#313244",
  },
  voiced: {
    "--app-bg": "#eaf3ed",
    "--app-section": "#eaf3ed",
    "--app-muted-section": "#dcebe1",
    "--app-selected": "#d6eadc",
    "--app-control": "#dcebe1",
    "--app-label": "#d6eadc",
    "--app-text-primary": "#173f32",
    "--app-text-secondary": "#4d665e",
    "--app-border": "#b8cec0",
    "--app-label-text": "#2f7a52",
    "--app-action": "#173f32",
    "--app-action-hover": "#254f42",
    "--app-text-on-action": "#f7faf8",
    "--app-focus": "#2f7a52",
    "--header-nav-active": "#2f7a52",
    "--header-nav-selected": "#d6eadc",
  },
};

function getProductHeaderTheme(pathname: string | null) {
  const product = pathname?.match(/^\/products\/([^/]+)/)?.[1];

  if (product && product in productHeaderThemes) {
    return product as ProductHeaderTheme;
  }

  return null;
}

function isCurrentPath(pathname: string | null, href: string) {
  return pathname === href || pathname?.startsWith(`${href}/`) === true;
}

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 17 17 7M7 7h10v10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
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

export function SiteHeader() {
  const pathname = usePathname();
  const productHeaderTheme = getProductHeaderTheme(pathname);
  const reduceMotion = useReducedMotion();
  const [menuState, setMenuState] = useState({ open: false, pathname });
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstMenuLinkRef = useRef<HTMLAnchorElement>(null);
  const menuOpen = menuState.pathname === pathname && menuState.open;
  const activeIndicatorTransition = reduceMotion
    ? { duration: 0 }
    : { type: "spring" as const, stiffness: 430, damping: 36, mass: 0.7 };

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
      className="relative z-40 h-16 w-full shrink-0 bg-[var(--app-bg)] transition-colors duration-300 motion-reduce:transition-none"
      data-product-theme={productHeaderTheme ?? undefined}
      style={productHeaderTheme ? productHeaderThemes[productHeaderTheme] : undefined}
    >
      <div className="mx-auto flex h-full w-full items-center justify-between px-5 min-[700px]:w-[calc(100%-40px)] min-[700px]:max-w-[1200px] min-[700px]:px-0 min-[1024px]:w-[calc(100%-48px)]">
        <Link
          className={`inline-flex min-h-11 items-center gap-2.5 text-[var(--app-text-primary)] ${focusClasses}`}
          href="/"
          aria-label="Applification home"
        >
          <span
            aria-hidden="true"
            className="block h-[34px] w-12 bg-current [-webkit-mask:url('/brand/applification-mark-light.svg')_center/contain_no-repeat] [mask:url('/brand/applification-mark-light.svg')_center/contain_no-repeat]"
          />
          <span className="font-caption hidden text-sm leading-[18px] font-bold tracking-[1.3px] min-[520px]:block">
            APPLIFICATION
          </span>
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-5 min-[700px]:flex min-[1024px]:gap-[30px]"
        >
          <LayoutGroup id="primary-navigation">
            {navigation.map((item) => {
              const current = isCurrentPath(pathname, item.href);

              return (
                <Link
                  aria-current={current ? "page" : undefined}
                  className={`relative isolate inline-flex min-h-10 items-center text-sm font-medium text-[var(--app-text-secondary)] transition-colors hover:text-[var(--header-nav-active,var(--app-action))] aria-[current=page]:text-[var(--header-nav-active,var(--app-label-text))] ${focusClasses}`}
                  href={item.href}
                  key={item.href}
                >
                  {current ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute -inset-x-2 inset-y-1 -z-10 rounded-full bg-[var(--header-nav-selected,var(--app-selected))]"
                      data-testid="active-navigation-highlight"
                      layoutId="active-link"
                      transition={activeIndicatorTransition}
                    />
                  ) : null}
                  {item.label}
                </Link>
              );
            })}
          </LayoutGroup>
          <div className="flex items-center gap-3">
            <ThemeSwitcher />
            <a
              className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--app-action)] px-[17px] py-[11px] text-sm leading-[18px] font-semibold text-[var(--app-text-on-action)] transition-[background-color,transform] hover:bg-[var(--app-action-hover)] active:scale-[0.985] motion-reduce:transform-none ${focusClasses}`}
              href={contactHref}
            >
              <span className="min-[1024px]:hidden">Contact</span>
              <span className="hidden min-[1024px]:inline">
                Discuss a contract
              </span>
              <ArrowUpRightIcon />
            </a>
          </div>
        </nav>

        <div className="flex items-center min-[700px]:hidden">
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

      <AnimatePresence initial={false}>
        {menuOpen ? (
          <motion.nav
            animate={{ y: 0 }}
            aria-label="Mobile navigation"
            className="absolute inset-x-0 top-full border-y border-[var(--app-border)] bg-[var(--app-section)] px-5 py-5 shadow-lg min-[700px]:hidden"
            exit={reduceMotion ? undefined : { y: -6 }}
            id="mobile-navigation"
            initial={reduceMotion ? false : { y: -8 }}
            transition={{
              duration: reduceMotion ? 0.01 : 0.18,
              ease: "easeOut",
            }}
          >
            <div className="mx-auto flex max-w-md flex-col gap-1">
              {navigation.map((item, index) => {
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
              <a
                className={`mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-5 text-base font-semibold text-[var(--app-text-on-action)] transition-[background-color,transform] hover:bg-[var(--app-action-hover)] active:scale-[0.985] motion-reduce:transform-none ${focusClasses}`}
                href={contactHref}
              >
                Discuss a contract
                <ArrowUpRightIcon />
              </a>
            </div>
          </motion.nav>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
