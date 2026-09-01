import type { ReactNode } from "react";

type PageHeroProps = {
  aside: ReactNode;
  density?: "compact" | "default";
  description: ReactNode;
  eyebrow: string;
  eyebrowDetail: string;
  headingId: string;
  title: ReactNode;
  eyebrowClassName?: string;
  sectionProps?: Record<string, string>;
};

export function PageHero({
  aside,
  density = "default",
  description,
  eyebrow,
  eyebrowDetail,
  headingId,
  title,
  eyebrowClassName = "text-[var(--app-label-text)]",
  sectionProps,
}: PageHeroProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={`${density === "compact" ? "min-[1024px]:min-h-[390px] min-[1024px]:py-14" : "min-[1024px]:min-h-[498px] min-[1024px]:py-20"} bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 py-14 min-[720px]:px-12 min-[1440px]:px-[120px]`}
      {...sectionProps}
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-10 min-[1024px]:grid-cols-[minmax(0,780px)_330px] min-[1024px]:items-start min-[1024px]:justify-between min-[1024px]:gap-[90px]">
        <div className="flex min-w-0 flex-col gap-[18px]">
          <p
            className={`font-caption flex items-center gap-3 text-[11px] font-semibold tracking-[1.4px] min-[1024px]:text-xs ${eyebrowClassName}`}
          >
            <span>{eyebrow}</span>
            <span aria-hidden="true" className="size-1 shrink-0 rounded-full bg-current" />
            <span>{eyebrowDetail}</span>
          </p>
          <h1
            className="font-heading max-w-[780px] text-[46px] leading-[1.04] font-medium tracking-[-1px] text-[var(--app-text-primary)] min-[720px]:text-[56px] min-[1024px]:text-[62px] min-[1024px]:tracking-[-1.4px]"
            id={headingId}
          >
            {title}
          </h1>
          <div className="max-w-[700px] text-lg leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[19px]">
            {description}
          </div>
        </div>

        {aside}
      </div>
    </section>
  );
}
