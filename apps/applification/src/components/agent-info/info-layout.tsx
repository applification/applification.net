import Link from "next/link";
import type { ReactNode } from "react";

export const infoLinkClass =
  "link-sweep inline-flex min-h-11 items-center text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function InfoLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link className={infoLinkClass} href={href}>
      <span className="link-sweep-label">{children}</span>
    </Link>
  );
}

export function InfoSection({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <section
      aria-labelledby={id}
      className="border-t border-[var(--app-border)] px-6 py-12 min-[720px]:px-12 min-[1440px]:px-[120px]"
    >
      <div className="mx-auto grid max-w-[1200px] gap-6 min-[1024px]:grid-cols-[280px_minmax(0,1fr)] min-[1024px]:gap-20">
        <h2 id={id} className="font-heading text-3xl leading-tight font-medium">
          {title}
        </h2>
        <div className="min-w-0 space-y-5 text-[17px] leading-relaxed text-[var(--app-text-secondary)]">
          {children}
        </div>
      </div>
    </section>
  );
}

export function CodeSample({
  children,
  label,
}: {
  children: string;
  label: string;
}) {
  return (
    <pre
      aria-label={label}
      tabIndex={0}
      className="font-data max-w-full overflow-x-auto rounded-xl border border-[var(--app-border)] bg-[var(--app-card)] p-5 text-sm leading-relaxed text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
    >
      <code>{children}</code>
    </pre>
  );
}
