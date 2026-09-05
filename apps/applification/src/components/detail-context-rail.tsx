import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

type DetailContextRailProps = {
  backHref: string;
  backLabel: string;
  detail: ReactNode;
  family: string;
  className?: string;
};

export function DetailContextRail({
  backHref,
  backLabel,
  detail,
  family,
  className = "text-[var(--app-label-text)]",
}: DetailContextRailProps) {
  return (
    <div
      className={`font-caption flex min-h-11 w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 text-[11px] font-bold tracking-[0.7px] uppercase min-[1024px]:text-xs min-[1024px]:font-semibold ${className}`}
    >
      <p className="flex min-w-0 items-center gap-3 self-start">
        <span>{family}</span>
        <span
          aria-hidden="true"
          className="size-1 shrink-0 rounded-full bg-current"
        />
        <span>{detail}</span>
      </p>
      <Link
        className="inline-flex min-h-11 shrink-0 items-center gap-2 focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
        href={backHref}
      >
        <ArrowLeft aria-hidden="true" size={14} />
        {backLabel}
      </Link>
    </div>
  );
}
