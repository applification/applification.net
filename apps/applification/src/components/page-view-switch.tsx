import Link from "next/link";
import { agentPath, humanPath, markdownPath } from "@/lib/page-view";

export function PageViewSwitch({ pathname }: { pathname: string }) {
  const agent = pathname === agentPath(pathname);
  return (
    <div className="page-view-switch inline-flex shrink-0 rounded-full border border-[var(--app-border)] p-0.5" role="group" aria-label="Page view">
      <link rel="alternate" type="text/markdown" href={markdownPath(pathname)} />
      {[
        { label: "Human", href: humanPath(pathname), current: !agent },
        { label: "Agent", href: agentPath(pathname), current: agent },
      ].map(({ label, href, current }) => (
        <Link
          key={label}
          href={href}
          prefetch={false}
          aria-current={current ? "page" : undefined}
          className="inline-flex min-h-11 min-w-14 items-center justify-center rounded-full px-3 text-sm text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] aria-[current=page]:bg-[var(--header-nav-selected,var(--app-card))] aria-[current=page]:font-semibold aria-[current=page]:text-[var(--app-text-primary)] aria-[current=page]:ring-1 aria-[current=page]:ring-[var(--app-border)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)]"
        >
          {label}
        </Link>
      ))}
    </div>
  );
}
