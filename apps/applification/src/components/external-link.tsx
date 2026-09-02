import { ArrowUpRight } from "lucide-react";
import type { ComponentProps } from "react";

type ExternalLinkProps = Omit<ComponentProps<"a">, "target" | "rel">;

export function ExternalLink({ children, "aria-label": label, ...props }: ExternalLinkProps) {
  return (
    <a
      {...props}
      aria-label={label ? `${label}, opens in a new tab` : undefined}
      target="_blank"
      rel="noopener noreferrer"
    >
      {children}
      <ArrowUpRight aria-hidden="true" className="ml-1 inline-block size-[1em] shrink-0 align-[-0.125em]" />
      {label ? null : <span className="sr-only">, opens in a new tab</span>}
    </a>
  );
}
