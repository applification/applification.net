"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { WritingOutlineItem } from "./writing-outline";

type RelatedWritingLink = {
  href: string;
  label: string;
};

type WritingArticleRailProps = {
  outline: WritingOutlineItem[];
  related: RelatedWritingLink[];
};

function RailHeading({ children }: { children: string }) {
  return (
    <h2 className="font-caption text-[9px] font-bold tracking-[0.7px] text-[var(--app-text-muted)] uppercase">
      {children}
    </h2>
  );
}

export function WritingArticleMobileOutline({
  outline,
}: Pick<WritingArticleRailProps, "outline">) {
  if (!outline.length) {
    return null;
  }

  return (
    <details className="mb-8 border-y border-[var(--app-border)] py-4 min-[1100px]:hidden">
      <summary className="cursor-pointer font-caption text-[10px] font-bold tracking-[0.65px] text-[var(--writing-accent-text)] uppercase marker:text-[var(--app-text-muted)]">
        On this page
      </summary>
      <nav aria-label="Article sections" className="mt-4">
        <ol className="space-y-2.5">
          {outline.map((item) => (
            <li key={item.id}>
              <a
                className="block text-sm leading-[1.35] text-[var(--app-text-secondary)] hover:text-[var(--writing-accent-text)]"
                href={`#${item.id}`}
              >
                {item.label}
              </a>
            </li>
          ))}
        </ol>
      </nav>
    </details>
  );
}

export function WritingArticleRail({
  outline,
  related,
}: WritingArticleRailProps) {
  const [activeId, setActiveId] = useState(outline[0]?.id);

  useEffect(() => {
    if (!outline.length) {
      return;
    }

    let frame = 0;
    const updateActiveSection = () => {
      window.cancelAnimationFrame(frame);
      frame = window.requestAnimationFrame(() => {
        let nextId = outline[0].id;

        outline.forEach((item) => {
          const heading = document.getElementById(item.id);

          if (heading && heading.getBoundingClientRect().top <= 160) {
            nextId = item.id;
          }
        });

        setActiveId(nextId);
      });
    };

    updateActiveSection();
    window.addEventListener("resize", updateActiveSection);
    window.addEventListener("scroll", updateActiveSection, { passive: true });

    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("resize", updateActiveSection);
      window.removeEventListener("scroll", updateActiveSection);
    };
  }, [outline]);

  return (
    <aside className="hidden min-[1100px]:col-start-2 min-[1100px]:row-start-1 min-[1100px]:block min-[1100px]:pt-[96px]">
      <div className="sticky top-24 border-l border-[var(--app-border)] pl-6">
        {outline.length ? (
          <nav aria-label="Article sections">
            <RailHeading>In this article</RailHeading>
            <ol className="mt-4 space-y-2.5">
              {outline.map((item) => {
                const active = item.id === activeId;

                return (
                  <li key={item.id}>
                    <a
                      aria-current={active ? "location" : undefined}
                      className={`relative block text-[13px] leading-[1.35] transition-colors before:absolute before:top-0 before:bottom-0 before:-left-[25px] before:w-px before:bg-transparent hover:text-[var(--writing-accent-text)] ${active ? "font-semibold text-[var(--writing-accent-text)] before:bg-[var(--writing-accent-text)]" : "text-[var(--app-text-secondary)]"}`}
                      href={`#${item.id}`}
                    >
                      {item.label}
                    </a>
                  </li>
                );
              })}
            </ol>
          </nav>
        ) : null}

        {related.length ? (
          <nav
            aria-label="Related writing"
            className={outline.length ? "mt-8 border-t border-[var(--app-border)] pt-7" : undefined}
          >
            <RailHeading>Related writing</RailHeading>
            <ul className="mt-4 space-y-3">
              {related.slice(0, 2).map((item) => (
                <li key={item.href}>
                  <Link
                    className="font-heading block text-[16px] leading-[1.25] font-semibold text-[var(--app-text-primary)] hover:text-[var(--writing-accent-text)]"
                    href={item.href}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ) : null}
      </div>
    </aside>
  );
}
