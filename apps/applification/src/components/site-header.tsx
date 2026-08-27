"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGroup, motion, useReducedMotion } from "motion/react";
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
    <header className="relative z-40 h-16 w-full shrink-0 bg-[var(--app-bg)] px-5 min-[821px]:mx-auto min-[821px]:w-[calc(100%-48px)] min-[821px]:max-w-[1200px] min-[821px]:px-0">
      <div className="flex h-full items-center justify-between">
        <Link
          className={`inline-flex min-h-11 items-center text-[var(--app-text-primary)] ${focusClasses}`}
          href="/"
          aria-label="Applification home"
        >
          <span
            aria-hidden="true"
            className="block h-[25px] w-[54px] bg-current [-webkit-mask:url('/brand/applification-mark-light.svg')_center/contain_no-repeat] [mask:url('/brand/applification-mark-light.svg')_center/contain_no-repeat]"
          />
        </Link>

        <nav
          aria-label="Primary navigation"
          className="hidden items-center gap-[30px] min-[821px]:flex"
        >
          <LayoutGroup id="primary-navigation">
            {navigation.map((item) => {
              const current = pathname === item.href;

              return (
                <Link
                  aria-current={current ? "page" : undefined}
                  className={`relative isolate inline-flex min-h-10 items-center text-sm font-medium text-[var(--app-text-secondary)] transition-colors hover:text-[var(--app-action)] aria-[current=page]:text-[var(--app-label-text)] ${focusClasses}`}
                  href={item.href}
                  key={item.href}
                >
                  {current ? (
                    <motion.span
                      aria-hidden="true"
                      className="absolute -inset-x-2 inset-y-1 -z-10 rounded-full bg-[var(--app-selected)]"
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
              className={`inline-flex min-h-10 items-center gap-2 rounded-full bg-[var(--app-action)] px-[17px] py-[11px] text-sm font-semibold text-[var(--app-text-on-action)] transition-colors hover:bg-[var(--app-action-hover)] ${focusClasses}`}
              href={contactHref}
            >
              Discuss your project
              <ArrowUpRightIcon />
            </a>
          </div>
        </nav>

        <div className="flex items-center min-[821px]:hidden">
          <button
            ref={menuButtonRef}
            aria-controls="mobile-navigation"
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            className={`flex size-11 items-center justify-center rounded-full bg-[var(--app-control)] text-[var(--app-text-primary)] ${focusClasses}`}
            onClick={() =>
              setMenuState({ open: !menuOpen, pathname })
            }
            type="button"
          >
            <MenuIcon open={menuOpen} />
          </button>
        </div>
      </div>

      {menuOpen ? (
        <nav
          aria-label="Mobile navigation"
          className="absolute inset-x-0 top-full border-y border-[var(--app-border)] bg-[var(--app-section)] px-5 py-5 shadow-lg min-[821px]:hidden"
          id="mobile-navigation"
        >
          <div className="mx-auto flex max-w-md flex-col gap-1">
            {navigation.map((item, index) => {
              const current = pathname === item.href;

              return (
                <Link
                  ref={index === 0 ? firstMenuLinkRef : undefined}
                  aria-current={current ? "page" : undefined}
                  className={`flex min-h-11 items-center rounded-lg px-3 text-base font-medium text-[var(--app-text-secondary)] hover:bg-[var(--app-muted-section)] hover:text-[var(--app-text-primary)] aria-[current=page]:bg-[var(--app-selected)] aria-[current=page]:text-[var(--app-label-text)] ${focusClasses}`}
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
              className={`mt-3 inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-5 text-base font-semibold text-[var(--app-text-on-action)] transition-colors hover:bg-[var(--app-action-hover)] ${focusClasses}`}
              href={contactHref}
            >
              Discuss your project
              <ArrowUpRightIcon />
            </a>
          </div>
        </nav>
      ) : null}
    </header>
  );
}
