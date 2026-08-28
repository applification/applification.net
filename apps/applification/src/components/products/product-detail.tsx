import type { ReactNode } from "react";
import { DetailContextRail } from "@/components/detail-context-rail";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function ProductDetailEyebrow({
  children,
  className = "text-[var(--app-label-text)]",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`${className} font-caption text-[11px] font-bold tracking-[1px] min-[1024px]:text-xs min-[1024px]:font-semibold`}
    >
      {children}
    </p>
  );
}

export type ProductDetailAction = {
  external?: boolean;
  href: string;
  label: string;
};

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M7 17 17 7M7 7h10v10"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

type ProductDetailHeroProps = {
  breadcrumb: string;
  description: string;
  primaryAction: ProductDetailAction;
  secondaryAction?: ProductDetailAction;
  status?: string;
  title: string;
  variant?: "contexture" | "default";
  visual: ReactNode;
};

export function ProductDetailHero({
  breadcrumb,
  description,
  primaryAction,
  secondaryAction,
  status,
  title,
  variant = "default",
  visual,
}: ProductDetailHeroProps) {
  const contexture = variant === "contexture";

  return (
    <section
      aria-labelledby="product-detail-heading"
      className={`${contexture ? "bg-[#1e1e2e] min-[1024px]:min-h-[590px]" : "bg-[linear-gradient(180deg,var(--app-bg),var(--app-bg-end))] min-[1024px]:min-h-[560px]"} px-6 py-12 min-[720px]:px-12 min-[1024px]:pt-[66px] min-[1024px]:pb-16 min-[1440px]:px-[120px]`}
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <DetailContextRail
          backHref="/products"
          backLabel="Product index"
          className={contexture ? "text-[#89dceb]" : undefined}
          detail={breadcrumb.replace(/^PRODUCTS\s*\/\s*/i, "")}
          family="Products"
        />
        <div className="mt-5 grid gap-10 min-[1280px]:grid-cols-[minmax(0,520px)_minmax(0,624px)] min-[1280px]:items-center min-[1280px]:gap-14">
          <div className="flex flex-col items-start gap-5">
            <h1
              className={`${contexture ? "text-[#cdd6f4]" : "text-[var(--app-text-primary)]"} font-heading max-w-[560px] text-[48px] leading-[0.98] font-medium tracking-[-0.025em] min-[1024px]:text-[60px] min-[1024px]:leading-[1.02]`}
              id="product-detail-heading"
            >
              {title}
            </h1>
            <p
              className={`${contexture ? "text-[#bac2de]" : "text-[var(--app-text-secondary)]"} max-w-[550px] text-base leading-[1.55] min-[1024px]:text-lg min-[1024px]:leading-[1.5]`}
            >
              {description}
            </p>
            <div className="flex flex-wrap items-center gap-3 pt-1">
              <a
                className={`${contexture ? "bg-[#cba6f7] text-[#1e1e2e] hover:bg-[#d8b4fe]" : "bg-[var(--app-action)] text-[var(--app-text-on-action)] hover:bg-[var(--app-action-hover)]"} inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full px-[18px] text-sm font-semibold transition-[background-color,transform] active:translate-y-px ${focusClasses}`}
                href={primaryAction.href}
                rel={primaryAction.external ? "noreferrer" : undefined}
                target={primaryAction.external ? "_blank" : undefined}
              >
                {primaryAction.label}
                {primaryAction.external ? <ArrowUpRightIcon /> : null}
                {primaryAction.external ? (
                  <span className="sr-only">, opens in a new tab</span>
                ) : null}
              </a>
              {secondaryAction ? (
                <a
                  className={`${contexture ? "border-[#cba6f7] text-[#cdd6f4] hover:bg-[#313244]" : "border-[var(--app-border)] text-[var(--app-text-primary)] hover:bg-[var(--app-muted-section)]"} inline-flex min-h-[42px] items-center justify-center gap-2 rounded-full border px-[18px] text-sm font-semibold transition-[background-color,transform] active:translate-y-px ${focusClasses}`}
                  href={secondaryAction.href}
                  rel={secondaryAction.external ? "noreferrer" : undefined}
                  target={secondaryAction.external ? "_blank" : undefined}
                >
                  {secondaryAction.label}
                  {secondaryAction.external ? <ArrowUpRightIcon /> : null}
                  {secondaryAction.external ? (
                    <span className="sr-only">, opens in a new tab</span>
                  ) : null}
                </a>
              ) : null}
              {status ? (
                <span className="font-caption inline-flex min-h-[42px] items-center rounded-full bg-[var(--app-label)] px-4 text-[10px] font-bold tracking-[0.65px] text-[var(--app-label-text)]">
                  {status}
                </span>
              ) : null}
            </div>
          </div>

          <div className="min-w-0">{visual}</div>
        </div>
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
  variant?: "dark" | "light";
};

export function ProductDetailRationale({
  body,
  callout,
  calloutIcon,
  eyebrow,
  title,
  variant = "dark",
}: ProductDetailRationaleProps) {
  const light = variant === "light";

  return (
    <section
      aria-labelledby="product-rationale-heading"
      className={`${light ? "bg-[var(--app-section)] text-[var(--app-text-primary)] min-[1024px]:min-h-[370px] min-[1024px]:py-[62px]" : "bg-[#0b1220] text-white min-[1024px]:min-h-[390px] min-[1024px]:py-[66px]"} px-6 py-14 min-[1024px]:px-20`}
    >
      <div
        className={`${light ? "min-[1024px]:grid-cols-[500px_minmax(0,1fr)] min-[1024px]:gap-[90px]" : "min-[1024px]:grid-cols-[470px_minmax(0,1fr)] min-[1024px]:gap-24"} mx-auto grid w-full max-w-[1280px] gap-9 min-[1024px]:items-center`}
      >
        <div>
          <p
            className={`${light ? "text-[var(--contexture-detail-accent)]" : "text-[#7dd3fc]"} font-caption text-[11px] font-bold tracking-[1px] min-[1024px]:text-xs min-[1024px]:font-semibold`}
          >
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
          <p
            className={`${light ? "text-[var(--app-text-secondary)]" : "text-[#cbd5e1]"} text-base leading-[1.55] min-[1024px]:text-[17px]`}
          >
            {body}
          </p>
          <div
            className={`${light ? "border-[var(--contexture-detail-border)] bg-[var(--contexture-detail-soft)]" : "border-[#334155] bg-[#172033]"} mt-6 flex gap-4 rounded-[14px] border p-5`}
          >
            <span
              className={`${light ? "text-[var(--contexture-detail-accent)]" : "text-[#7dd3fc]"} mt-0.5 shrink-0`}
            >
              {calloutIcon}
            </span>
            <p
              className={`${light ? "text-[var(--contexture-detail-description)]" : "text-white"} text-[15px] leading-[1.5]`}
            >
              {callout}
            </p>
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
  variant?: "default" | "plantry";
};

export function ProductDetailSteps({
  eyebrow,
  id,
  note,
  steps,
  title,
  variant = "default",
}: ProductDetailStepsProps) {
  const headingId = `${id}-heading`;
  const plantry = variant === "plantry";

  return (
    <section
      aria-labelledby={headingId}
      className={`${plantry ? "xl:h-[560px] xl:py-[58px]" : "min-[1024px]:min-h-[580px] min-[1024px]:py-[62px]"} scroll-mt-16 bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20`}
      id={id}
    >
      <div className="mx-auto w-full max-w-[1280px]">
        {plantry ? (
          <div className="grid gap-4 xl:grid-cols-[minmax(0,690px)_minmax(0,400px)] xl:items-center xl:justify-between">
            <div className="flex flex-col gap-3">
              <ProductDetailEyebrow>{eyebrow}</ProductDetailEyebrow>
              <h2
                className="font-heading text-[36px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[40px]"
                id={headingId}
              >
                {title}
              </h2>
            </div>
            <p className="text-sm leading-[1.5] text-[var(--app-text-secondary)] min-[1024px]:text-[15px]">
              {note}
            </p>
          </div>
        ) : (
          <>
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
          </>
        )}

        <ol
          className={`${plantry ? "xl:mt-[30px] xl:h-[300px] xl:grid-cols-4 xl:gap-4" : "min-[1024px]:mt-[34px] min-[1024px]:gap-[14px] lg:grid-cols-4"} mt-8 grid gap-[14px] sm:grid-cols-2`}
        >
          {steps.map((step) => (
            <li
              className={`${plantry ? "gap-[14px] xl:h-[300px]" : "min-[1024px]:min-h-[308px]"} flex min-h-[280px] flex-col rounded-2xl bg-[var(--app-muted-section)] p-[22px]`}
              key={step.number}
            >
              {plantry ? (
                <>
                  <span className="text-[var(--app-label-text)]">
                    {step.icon}
                  </span>
                  <span className="font-data text-[13px] leading-[17px] font-bold text-[var(--app-text-muted)]">
                    {step.number}
                  </span>
                  <h3 className="font-heading text-2xl leading-[1.12] font-medium text-[var(--app-text-primary)]">
                    {step.title}
                  </h3>
                  <p className="text-sm leading-[1.5] text-[var(--app-text-secondary)]">
                    {step.description}
                  </p>
                </>
              ) : (
                <>
                  <div className="flex items-center justify-between">
                    <span className="text-[var(--app-label-text)]">
                      {step.icon}
                    </span>
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
                </>
              )}
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

export type ProductDetailSpecification = {
  label: string;
  value: string;
};

type ProductDetailSpecificationsProps = {
  description: string;
  eyebrow: string;
  rows: ProductDetailSpecification[];
  title: string;
};

export function ProductDetailSpecifications({
  description,
  eyebrow,
  rows,
  title,
}: ProductDetailSpecificationsProps) {
  return (
    <section
      aria-labelledby="product-specifications-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:min-h-[430px] min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1024px]:grid-cols-[500px_minmax(0,700px)] min-[1024px]:items-center min-[1024px]:gap-20">
        <div>
          <ProductDetailEyebrow className="text-[var(--contexture-detail-accent)]">
            {eyebrow}
          </ProductDetailEyebrow>
          <h2
            className="font-heading mt-4 text-[35px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px]"
            id="product-specifications-heading"
          >
            {title}
          </h2>
          <p className="mt-5 text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-base">
            {description}
          </p>
        </div>
        <dl>
          {rows.map((row) => (
            <div
              className="grid min-h-[59px] gap-2 border-t border-[var(--app-border)] py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:gap-6"
              key={row.label}
            >
              <dt className="font-caption text-[10px] font-semibold tracking-[0.55px] text-[var(--contexture-detail-accent)]">
                {row.label}
              </dt>
              <dd className="text-sm leading-[1.5] text-[var(--app-text-primary)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

type ProductDetailAvailabilityProps = {
  action: ProductDetailAction;
  description: string;
  eyebrow: string;
  secondaryAction?: ProductDetailAction;
  status: string;
  title: string;
  variant?: "contexture" | "default";
};

export function ProductDetailAvailability({
  action,
  description,
  eyebrow,
  secondaryAction,
  status,
  title,
  variant = "default",
}: ProductDetailAvailabilityProps) {
  const contexture = variant === "contexture";

  return (
    <section
      aria-labelledby="product-availability-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:min-h-[270px] min-[1024px]:px-20 min-[1024px]:py-14"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 min-[1024px]:grid-cols-[minmax(0,1fr)_auto] min-[1024px]:items-center min-[1024px]:gap-[60px]">
        <div>
          <p
            className={`${contexture ? "text-[var(--contexture-detail-accent)]" : "text-[var(--app-label-text)]"} font-caption text-[11px] font-bold tracking-[1px] min-[1024px]:text-xs min-[1024px]:font-semibold`}
          >
            {eyebrow} <span aria-hidden="true">/</span>{" "}
            <span className="text-[var(--app-text-muted)]">{status}</span>
          </p>
          <h2
            className={`${contexture ? "text-[var(--contexture-detail-title)]" : "text-[var(--app-text-primary)]"} font-heading mt-4 text-[35px] leading-[1.08] font-medium min-[1024px]:text-[38px]`}
            id="product-availability-heading"
          >
            {title}
          </h2>
          <p
            className={`${contexture ? "text-[var(--contexture-detail-description)]" : "text-[var(--app-text-secondary)]"} mt-4 max-w-[860px] text-[15px] leading-[1.55] min-[1024px]:text-base`}
          >
            {description}
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 min-[1024px]:w-auto min-[1024px]:items-end">
          <a
            className={`${contexture ? "border border-[var(--contexture-detail-border)] bg-[var(--contexture-detail-accent)] text-[var(--contexture-action-text)] hover:bg-[var(--contexture-action-hover)]" : "bg-[var(--app-text-primary)] text-[var(--app-section)] hover:bg-[var(--app-text-secondary)]"} inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full px-[22px] text-[15px] font-semibold transition-[background-color,transform] active:translate-y-px min-[1024px]:w-auto ${focusClasses}`}
            href={action.href}
            rel={action.external ? "noreferrer" : undefined}
            target={action.external ? "_blank" : undefined}
          >
            {action.label}
            {action.external ? <ArrowUpRightIcon /> : null}
            {action.external ? (
              <span className="sr-only">, opens in a new tab</span>
            ) : null}
          </a>
          {secondaryAction ? (
            <a
              className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[var(--contexture-detail-border)] bg-[var(--app-section)] px-[22px] text-[15px] font-semibold text-[var(--contexture-detail-accent)] transition-[background-color,transform] hover:bg-[var(--contexture-detail-soft)] active:translate-y-px min-[1024px]:w-auto ${focusClasses}`}
              href={secondaryAction.href}
              rel={secondaryAction.external ? "noreferrer" : undefined}
              target={secondaryAction.external ? "_blank" : undefined}
            >
              {secondaryAction.label}
              {secondaryAction.external ? <ArrowUpRightIcon /> : null}
              {secondaryAction.external ? (
                <span className="sr-only">, opens in a new tab</span>
              ) : null}
            </a>
          ) : null}
        </div>
      </div>
    </section>
  );
}
