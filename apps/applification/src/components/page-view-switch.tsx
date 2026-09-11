"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { agentPath, hasAgentView, humanPath, markdownPath } from "@/lib/page-view";
import { usePageViewTransition } from "./use-page-view-transition";

export function PageViewSwitch() {
  const pathname = usePathname();
  const navigate = usePageViewTransition(pathname);
  if (!pathname || !hasAgentView(pathname)) return null;
  const agent = pathname === agentPath(pathname);
  return (
    <div
      className="page-view-switch fixed bottom-[max(12px,env(safe-area-inset-bottom))] left-1/2 z-30 flex -translate-x-1/2 items-center px-1 text-xs text-[var(--app-text-muted)] before:pointer-events-none before:absolute before:inset-x-0 before:inset-y-1.5 before:rounded-lg before:border before:border-[var(--app-border)] before:bg-[var(--app-card)] before:shadow-sm print:hidden"
      role="group"
      aria-label="Page view"
    >
      <link rel="alternate" type="text/markdown" href={markdownPath(pathname)} />
      {[
        { label: "Human", href: humanPath(pathname), current: !agent },
        { label: "Agent", href: agentPath(pathname), current: agent },
      ].map(({ label, href, current }) => (
        <Link
          key={label}
          href={href}
          prefetch={false}
          onClick={(event) => navigate(event, href, label === "Agent")}
          aria-current={current ? "page" : undefined}
          className="relative inline-flex min-h-11 min-w-14 items-center justify-center gap-1.5 rounded-md px-2 hover:text-[var(--app-text-primary)] aria-[current=page]:font-medium aria-[current=page]:text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)]"
        >
          <span aria-hidden="true" className={`size-2 rounded-full border border-current ${current ? "bg-current" : ""}`} />
          {label}
        </Link>
      ))}
    </div>
  );
}
