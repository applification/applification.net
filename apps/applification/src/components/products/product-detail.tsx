import type { ReactNode } from "react";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function ProductDetailEyebrow({ children }: { children: ReactNode }) {
  return (
    <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] min-[1024px]:text-xs min-[1024px]:font-semibold">
      {children}
    </p>
  );
}

type ProductDetailHeroProps = {
  breadcrumb: string;
  description: string;
  primaryAction: { href: string; label: string };
  status: string;
  title: string;
  visual: ReactNode;
};

export function ProductDetailHero({
  breadcrumb,
  description,
  primaryAction,
  status,
  title,
  visual,
}: ProductDetailHeroProps) {
  return (
    <section
      aria-labelledby="product-detail-heading"
      className="bg-[linear-gradient(180deg,var(--app-bg),var(--app-bg-end))] px-6 py-12 min-[1024px]:min-h-[560px] min-[1024px]:px-20 min-[1024px]:py-16"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1024px]:grid-cols-[minmax(0,560px)_minmax(0,664px)] min-[1024px]:items-center min-[1024px]:gap-14">
        <div className="flex flex-col items-start gap-5">
          <ProductDetailEyebrow>{breadcrumb}</ProductDetailEyebrow>
          <h1
            className="font-heading max-w-[560px] text-[48px] leading-[0.98] font-medium tracking-[-0.025em] text-[var(--app-text-primary)] min-[1024px]:text-[60px] min-[1024px]:leading-[1.02]"
            id="product-detail-heading"
          >
            {title}
          </h1>
          <p className="max-w-[550px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-lg min-[1024px]:leading-[1.5]">
            {description}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <a
              className={`inline-flex min-h-[42px] items-center justify-center rounded-full bg-[var(--app-action)] px-[18px] text-sm font-semibold text-[var(--app-text-on-action)] transition-[background-color,transform] hover:bg-[var(--app-action-hover)] active:translate-y-px ${focusClasses}`}
              href={primaryAction.href}
            >
              {primaryAction.label}
            </a>
            <span className="font-caption inline-flex min-h-[42px] items-center rounded-full bg-[var(--app-label)] px-4 text-[10px] font-bold tracking-[0.65px] text-[var(--app-label-text)]">
              {status}
            </span>
          </div>
        </div>

        <div className="min-w-0">{visual}</div>
      </div>
    </section>
  );
}

type ProductDetailRationaleProps = {
  body: string;
  callout: string;
  calloutIcon: ReactNode;
  eyebrow: string;
  title: string;
};

export function ProductDetailRationale({
  body,
  callout,
  calloutIcon,
  eyebrow,
  title,
}: ProductDetailRationaleProps) {
  return (
    <section
      aria-labelledby="product-rationale-heading"
      className="bg-[#0b1220] px-6 py-14 text-white min-[1024px]:min-h-[390px] min-[1024px]:px-20 min-[1024px]:py-[66px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-9 min-[1024px]:grid-cols-[470px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:gap-24">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[#7dd3fc] min-[1024px]:text-xs min-[1024px]:font-semibold">
            {eyebrow}
          </p>
          <h2
            className="font-heading mt-[18px] text-[36px] leading-[1.08] font-medium min-[1024px]:text-[40px]"
            id="product-rationale-heading"
          >
            {title}
          </h2>
        </div>
        <div>
          <p className="text-base leading-[1.55] text-[#cbd5e1] min-[1024px]:text-[17px]">
            {body}
          </p>
          <div className="mt-6 flex gap-4 rounded-[14px] border border-[#334155] bg-[#172033] p-5">
            <span className="mt-0.5 shrink-0 text-[#7dd3fc]">{calloutIcon}</span>
            <p className="text-[15px] leading-[1.5] text-white">{callout}</p>
          </div>
        </div>
      </div>
    </section>
  );
}

export type ProductDetailStep = {
  description: string;
  icon: ReactNode;
  number: string;
  title: string;
};

type ProductDetailStepsProps = {
  eyebrow: string;
  id: string;
  note: string;
  steps: ProductDetailStep[];
  title: string;
};

export function ProductDetailSteps({
  eyebrow,
  id,
  note,
  steps,
  title,
}: ProductDetailStepsProps) {
  const headingId = `${id}-heading`;

  return (
    <section
      aria-labelledby={headingId}
      className="scroll-mt-16 bg-[var(--app-section)] px-6 py-14 min-[1024px]:min-h-[580px] min-[1024px]:px-20 min-[1024px]:py-[62px]"
      id={id}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <ProductDetailEyebrow>{eyebrow}</ProductDetailEyebrow>
        <div className="mt-4 grid gap-4 min-[1024px]:grid-cols-[minmax(0,1fr)_390px] min-[1024px]:items-end min-[1024px]:gap-12">
          <h2
            className="font-heading max-w-[790px] text-[36px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[40px]"
            id={headingId}
          >
            {title}
          </h2>
          <p className="text-sm leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[15px]">
            {note}
          </p>
        </div>

        <ol className="mt-8 grid gap-[14px] sm:grid-cols-2 lg:mt-[34px] lg:grid-cols-4">
          {steps.map((step) => (
            <li
              className="flex min-h-[280px] flex-col rounded-2xl bg-[var(--app-muted-section)] p-[22px] min-[1024px]:min-h-[308px]"
              key={step.number}
            >
              <div className="flex items-center justify-between">
                <span className="text-[var(--app-label-text)]">{step.icon}</span>
                <span className="font-caption text-[11px] font-semibold tracking-[0.8px] text-[var(--app-text-muted)]">
                  {step.number}
                </span>
              </div>
              <h3 className="font-heading mt-auto pt-10 text-2xl leading-[1.05] font-medium text-[var(--app-text-primary)]">
                {step.title}
              </h3>
              <p className="mt-3 text-sm leading-[1.5] text-[var(--app-text-secondary)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export type ProductDetailPrinciple = {
  description: string;
  title: string;
};

type ProductDetailPrinciplesProps = {
  description: string;
  eyebrow: string;
  principles: ProductDetailPrinciple[];
  title: string;
};

export function ProductDetailPrinciples({
  description,
  eyebrow,
  principles,
  title,
}: ProductDetailPrinciplesProps) {
  return (
    <section
      aria-labelledby="product-principles-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:min-h-[420px] min-[1024px]:px-20 min-[1024px]:py-16"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1024px]:grid-cols-[500px_minmax(0,700px)] min-[1024px]:gap-20">
        <div>
          <ProductDetailEyebrow>{eyebrow}</ProductDetailEyebrow>
          <h2
            className="font-heading mt-4 text-[35px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px]"
            id="product-principles-heading"
          >
            {title}
          </h2>
          <p className="mt-5 text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-base">
            {description}
          </p>
        </div>
        <ul>
          {principles.map((principle) => (
            <li
              className="grid min-h-[79px] grid-cols-[12px_minmax(0,1fr)] gap-4 border-t border-[var(--app-border)] py-[18px]"
              key={principle.title}
            >
              <span className="mt-[7px] size-2 rounded-full bg-[var(--app-accent)]" />
              <p className="text-sm leading-[1.5] text-[var(--app-text-secondary)]">
                <strong className="font-semibold text-[var(--app-text-primary)]">
                  {principle.title}
                </strong>
                {" — "}
                {principle.description}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

type ProductDetailAvailabilityProps = {
  action: { href: string; label: string };
  description: string;
  eyebrow: string;
  status: string;
  title: string;
};

export function ProductDetailAvailability({
  action,
  description,
  eyebrow,
  status,
  title,
}: ProductDetailAvailabilityProps) {
  return (
    <section
      aria-labelledby="product-availability-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:min-h-[270px] min-[1024px]:px-20 min-[1024px]:py-14"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 min-[1024px]:grid-cols-[minmax(0,1fr)_auto] min-[1024px]:items-center min-[1024px]:gap-[60px]">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            {eyebrow} <span aria-hidden="true">/</span>{" "}
            <span className="text-[var(--app-text-muted)]">{status}</span>
          </p>
          <h2
            className="font-heading mt-4 text-[35px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px]"
            id="product-availability-heading"
          >
            {title}
          </h2>
          <p className="mt-4 max-w-[860px] text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-base">
            {description}
          </p>
        </div>
        <a
          className={`inline-flex min-h-[49px] w-full items-center justify-center rounded-full bg-[var(--app-text-primary)] px-[22px] text-[15px] font-semibold text-[var(--app-section)] transition-[background-color,transform] hover:bg-[var(--app-text-secondary)] active:translate-y-px min-[1024px]:w-auto ${focusClasses}`}
          href={action.href}
        >
          {action.label}
        </a>
      </div>
    </section>
  );
}
