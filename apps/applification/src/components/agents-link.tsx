import Link from "next/link";
import { Bot } from "lucide-react";

const LABEL = "Agents & API docs";

type AgentsLinkProps = {
  className?: string;
  labelled?: boolean;
  onClick?: () => void;
};

// Mirrors ThemeSwitcher's icon-button sizing so the two sit as a pair in the
// header: an unlabelled 44px icon button in the desktop nav, and a labelled
// row in the mobile menu. Kept separate from ThemeSwitcher because this is a
// static link, not a client-side toggle.
export function AgentsLink({
  className = "",
  labelled = false,
  onClick,
}: AgentsLinkProps) {
  const buttonClasses = labelled
    ? "flex min-h-11 w-full items-center justify-between rounded-lg px-3 text-base font-medium text-[var(--app-text-secondary)] hover:bg-[var(--app-muted-section)] hover:text-[var(--app-text-primary)]"
    : "inline-flex size-11 shrink-0 items-center justify-center rounded-lg text-[var(--app-text-secondary)] hover:bg-[var(--app-muted-section)] hover:text-[var(--app-text-primary)]";

  return (
    <Link
      aria-label={LABEL}
      className={`${buttonClasses} transition-colors focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] ${className}`}
      href="/agents"
      onClick={onClick}
      title={LABEL}
    >
      {labelled ? <span>{LABEL}</span> : null}
      <Bot aria-hidden="true" className="size-[18px]" strokeWidth={1.8} />
    </Link>
  );
}
