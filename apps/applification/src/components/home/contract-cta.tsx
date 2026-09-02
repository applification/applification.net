import { ArrowUpRight } from "lucide-react";
import { buildContactHref, isContactWorkflowAvailable } from "@/lib/contact";

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
  description = "Available immediately for remote UK contracts through Applification Ltd. I join your team to build React and Next.js products, improve existing frontends and deliver production AI.",
  eyebrow = "AVAILABLE IMMEDIATELY · REMOTE UK",
  layout = "default",
  title = "Need a senior engineer for your next release?",
  variant = "accent",
}: ContractCtaProps = {}) {
  if (!isContactWorkflowAvailable()) {
    return null;
  }

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
    ? `${dark ? "min-[1120px]:leading-[1.4]" : "min-[1120px]:leading-[1.55]"} min-[1120px]:mt-3 min-[1120px]:text-[17px]`
    : `${dark ? "min-[1024px]:leading-[1.4]" : "min-[1024px]:leading-[1.55]"} min-[1024px]:mt-3 min-[1024px]:text-[17px]`;
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
      className={`${dark ? `bg-[#111827] text-white ${darkSectionHeight}` : "border-y border-[var(--app-border)] bg-[var(--app-muted-section)] text-[var(--app-text-primary)]"} px-6 py-12 ${sectionLayout}`}
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
          <p className={`${dark ? "text-[#cbd5e1]" : "text-[var(--cta-description)]"} mt-[18px] max-w-[760px] text-base leading-[1.55] ${descriptionLayout}`}>
            {description}
          </p>
        </div>

        <a
          className={`${dark ? `bg-white text-[#111827] hover:bg-[#e2e8f0] active:bg-[#cbd5e1] ${darkActionLayout}` : "bg-[var(--cta-action)] text-[var(--cta-action-text)] hover:bg-[var(--cta-action-hover)] active:bg-[var(--cta-action-active)]"} inline-flex min-h-[50px] w-full shrink-0 items-center justify-center gap-2 rounded-full px-[22px] text-base font-bold transition-[background-color,transform] active:translate-y-px focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--cta-focus)] motion-reduce:transform-none motion-reduce:transition-none ${actionLayout}`}
          href={buildContactHref({ route: "contract" })}
        >
          {actionLabel}
          <ArrowUpRight aria-hidden="true" className="size-[17px] shrink-0" strokeWidth={1.8} />
        </a>
      </div>
    </section>
  );
}
