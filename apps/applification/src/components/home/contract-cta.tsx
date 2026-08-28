import { ArrowUpRight } from "lucide-react";

type ContractCtaProps = {
  actionLabel?: string;
  description?: string;
  eyebrow?: string;
  layout?: "default" | "wide";
  title?: string;
  variant?: "accent" | "dark";
};

export function ContractCta({
  actionLabel = "Discuss a contract",
  description = "I can join an existing team or assemble the product, design and engineering team for a complete build. Remote across the UK.",
  eyebrow = "CONTRACT ENGINEERING · PROJECT TEAMS",
  layout = "default",
  title = "Need a senior product engineer, or a small team for the whole build?",
  variant = "accent",
}: ContractCtaProps = {}) {
  const dark = variant === "dark";
  const wide = layout === "wide";
  const sectionLayout = wide
    ? "min-[720px]:px-12 min-[1120px]:px-[120px] min-[1120px]:py-[68px]"
    : "min-[1024px]:px-[120px] min-[1024px]:py-[68px]";
  const contentLayout = wide
    ? "min-[1120px]:flex-row min-[1120px]:items-center min-[1120px]:justify-between min-[1120px]:gap-[60px]"
    : "min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-[60px]";
  const eyebrowLayout = wide
    ? "min-[1120px]:text-xs min-[1120px]:font-semibold min-[1120px]:tracking-[0.9px]"
    : "min-[1024px]:text-xs min-[1024px]:font-semibold min-[1024px]:tracking-[0.9px]";
  const titleLayout = wide
    ? "min-[1120px]:mt-3 min-[1120px]:text-[44px] min-[1120px]:font-semibold"
    : "min-[1024px]:mt-3 min-[1024px]:text-[44px] min-[1024px]:font-semibold";
  const descriptionLayout = wide
    ? `${dark ? "min-[1120px]:leading-[1.27]" : "min-[1120px]:leading-[1.45]"} min-[1120px]:mt-3 min-[1120px]:text-[15px]`
    : `${dark ? "min-[1024px]:leading-[1.27]" : "min-[1024px]:leading-[1.45]"} min-[1024px]:mt-3 min-[1024px]:text-[15px]`;
  const actionLayout = wide
    ? "min-[1120px]:w-auto min-[1120px]:font-semibold"
    : "min-[1024px]:w-auto min-[1024px]:font-semibold";
  const darkActionLayout = wide
    ? "min-[1120px]:min-h-[51px] min-[1120px]:gap-2.5 min-[1120px]:px-6"
    : "min-[1024px]:min-h-[51px] min-[1024px]:gap-2.5 min-[1024px]:px-6";
  const darkSectionHeight = wide
    ? "min-[1120px]:min-h-[310px]"
    : "min-[1024px]:min-h-[310px]";

  return (
    <section
      aria-labelledby="contract-cta-heading"
      className={`${dark ? `bg-[#111827] text-white ${darkSectionHeight}` : "bg-[var(--app-accent-band)] text-[var(--app-text-on-accent)]"} px-6 py-12 ${sectionLayout}`}
      id="contact"
    >
      <div className={`mx-auto flex w-full max-w-[1200px] flex-col gap-[18px] ${contentLayout}`}>
        <div className="max-w-[780px]">
          <p className={`${dark ? "text-[#94a3b8]" : "text-[var(--cta-eyebrow)]"} font-caption text-[11px] font-bold tracking-[1px] ${eyebrowLayout}`}>
            {eyebrow}
          </p>
          <h2
            className={`font-heading mt-[18px] text-[34px] leading-[1.08] font-medium ${titleLayout}`}
            id="contract-cta-heading"
          >
            {title}
          </h2>
          <p className={`${dark ? "text-[#cbd5e1]" : "text-[var(--cta-description)]"} mt-[18px] max-w-[760px] text-sm leading-[1.5] ${descriptionLayout}`}>
            {description}
          </p>
        </div>

        <a
          className={`${dark ? `bg-white text-[#111827] hover:bg-[#e2e8f0] active:bg-[#cbd5e1] ${darkActionLayout}` : "bg-[var(--cta-action)] text-[var(--cta-action-text)] hover:bg-[var(--cta-action-hover)] active:bg-[var(--cta-action-active)]"} inline-flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-full px-[22px] text-[15px] font-bold transition-[background-color,transform] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cta-focus)] motion-reduce:transform-none motion-reduce:transition-none ${actionLayout}`}
          href="mailto:dave@applification.net?subject=Project%20enquiry"
        >
          {actionLabel}
          <ArrowUpRight aria-hidden="true" className="size-[17px] shrink-0 text-[var(--app-accent)]" strokeWidth={1.8} />
        </a>
      </div>
    </section>
  );
}
