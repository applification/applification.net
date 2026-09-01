type ProductStatusProps = {
  status: "In Development" | "Live" | "R&D";
};

const statusClasses = {
  "In Development":
    "border-[var(--status-development-border)] bg-[var(--status-development-bg)] text-[var(--status-development-text)]",
  Live: "border-[var(--status-live-border)] bg-[var(--status-live-bg)] text-[var(--status-live-text)]",
  "R&D":
    "border-[var(--status-rnd-border)] bg-[var(--status-rnd-bg)] text-[var(--status-rnd-text)]",
} as const;

export function ProductStatus({ status }: ProductStatusProps) {
  return (
    <span
      className={`font-caption inline-flex w-fit items-center gap-1.5 rounded-full border px-2.5 py-1.5 text-[11px] leading-none font-bold tracking-[0.55px] uppercase ${statusClasses[status]}`}
    >
      <span aria-hidden="true" className="size-1.5 rounded-full bg-current" />
      {status}
    </span>
  );
}
