import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { MotionReveal } from "./motion";

const outcomeDetails = [
  {
    company: "ERUPTIV",
    proof: "4 months",
    title: "Greenfield frontend live",
    detail:
      "Designed and built the entire TypeScript and Next.js frontend for Client Server's recruitment platform against an existing API in three months. It reached production after a fourth month of release work.",
    technologies: "REACT  ·  TYPESCRIPT  ·  STORYBOOK",
    href: "/client-work/eruptiv",
    linkLabel: "Read the Eruptiv case",
    websiteHref: "https://www.client-server.com/",
    websiteLabel: "Visit Client Server",
  },
  {
    company: "PEPPY HEALTH",
    proof: "£12m ARR",
    title: "Component architecture rebuilt",
    detail:
      "Led a two-person senior frontend team, catalogued hundreds of components in Storybook and added a full Cypress end-to-end suite while the business scaled to £12 million ARR.",
    technologies: "REACT  ·  STORYBOOK  ·  CYPRESS",
    href: "/client-work/peppy-health",
    linkLabel: "Read the Peppy Health case",
    websiteHref: "https://peppy.health/",
    websiteLabel: "Visit Peppy Health",
  },
];

function LogicallyOutcome() {
  return (
    <li
      className="flex flex-col gap-4 rounded-[20px] bg-[var(--app-card)] px-[18px] py-5 text-[var(--app-text-primary)] min-[720px]:col-span-2 min-[1024px]:col-span-1 min-[1024px]:rounded-none min-[1024px]:bg-transparent min-[1024px]:py-3 min-[1024px]:pr-6 min-[1024px]:pl-0"
      data-client-outcome="logically"
    >
      <div>
        <p className="font-caption text-[11px] font-bold tracking-[0.7px] text-[var(--app-label-text)]">
          LOGICALLY
        </p>
        <p className="font-heading mt-3 text-[34px] leading-none font-medium min-[1024px]:text-[38px]">
          Days to minutes
        </p>
        <h3 className="mt-3 text-lg leading-[1.25] font-semibold min-[1024px]:text-xl">
          Intelligence v2 rebuilt for production
        </h3>
        <p className="mt-3 text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:max-w-[520px] min-[1024px]:text-[17px]">
          As Principal Engineer, I led the team, architected and built
          Intelligence v2 with one other engineer. Routine UI changes fell from
          days to minutes, and the team released several times per day.
        </p>

        <dl className="mt-4 grid grid-cols-3 gap-1.5 min-[1024px]:hidden">
          <div className="flex min-h-[68px] flex-col justify-between rounded-[11px] bg-[var(--app-muted-section)] p-2.5">
            <dt className="font-caption text-[7px] font-bold tracking-[0.5px] text-[var(--app-text-muted)]">
              REBUILD TO RELEASE
            </dt>
            <dd className="font-data text-xs font-bold">6 months</dd>
          </div>
          <div className="flex min-h-[68px] flex-col justify-between rounded-[11px] bg-[var(--app-muted-section)] p-2.5">
            <dt className="font-caption text-[7px] font-bold tracking-[0.5px] text-[var(--app-text-muted)]">
              UI CHANGE TIME
            </dt>
            <dd className="font-data text-xs font-bold">Days → min</dd>
          </div>
          <div className="flex min-h-[68px] flex-col justify-between rounded-[11px] bg-[var(--app-muted-section)] p-2.5">
            <dt className="font-caption text-[7px] font-bold tracking-[0.5px] text-[var(--app-text-muted)]">
              PRODUCTION RELEASES
            </dt>
            <dd className="font-data text-xs font-bold">Several / day</dd>
          </div>
        </dl>
      </div>

      <p className="font-caption hidden text-[10px] font-semibold tracking-[0.65px] text-[var(--app-text-muted)] min-[1024px]:block">
        NEXT.JS&nbsp; · &nbsp;TYPESCRIPT&nbsp; · &nbsp;AI SDK&nbsp; · &nbsp;MCP
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link
          className="link-sweep inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
          href="/client-work/logically"
        >
          <span className="link-sweep-label">Read the Logically case</span>
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </Link>
        <a
          className="link-sweep inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
          href="https://www.logically.ai/"
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="link-sweep-label">Visit Logically</span>
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={2} />
          <span className="sr-only">, opens in a new tab</span>
        </a>
      </div>
    </li>
  );
}

function CompactOutcome({
  company,
  detail,
  href,
  linkLabel,
  proof,
  technologies,
  title,
  websiteHref,
  websiteLabel,
}: (typeof outcomeDetails)[number]) {
  return (
    <li className="flex flex-col gap-4 rounded-[14px] bg-[var(--app-card)] p-4 min-[1024px]:rounded-none min-[1024px]:border-l min-[1024px]:border-[var(--app-border)] min-[1024px]:bg-transparent min-[1024px]:px-6 min-[1024px]:py-3">
      <div>
        <div className="font-caption flex items-center justify-between gap-3 text-[11px] font-bold tracking-[0.7px] text-[var(--app-label-text)]">
          <span>{company}</span>
          <span className="font-heading text-[28px] font-medium tracking-normal text-[var(--app-text-primary)] min-[1024px]:hidden">{proof}</span>
        </div>
        <p className="font-heading mt-3 hidden text-[38px] leading-none font-medium min-[1024px]:block">
          {proof}
        </p>
        <h3 className="mt-2 text-lg leading-[1.3] font-semibold text-[var(--app-text-primary)] min-[1024px]:mt-3 min-[1024px]:text-xl">
          {title}
        </h3>
        <p className="mt-2 text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:mt-3 min-[1024px]:text-[17px]">
          {detail}
        </p>
      </div>
      <p className="font-caption hidden text-[10px] font-semibold tracking-[0.65px] text-[var(--app-text-muted)] min-[1024px]:block">
        {technologies}
      </p>
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
        <Link
          className="link-sweep inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
          href={href}
        >
          <span className="link-sweep-label">{linkLabel}</span>
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </Link>
        <a
          className="link-sweep inline-flex min-h-11 items-center gap-1.5 text-[15px] font-semibold text-[var(--app-text-muted)] transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
          href={websiteHref}
          rel="noopener noreferrer"
          target="_blank"
        >
          <span className="link-sweep-label">{websiteLabel}</span>
          <ArrowUpRight aria-hidden="true" className="size-3.5" strokeWidth={2} />
          <span className="sr-only">, opens in a new tab</span>
        </a>
      </div>
    </li>
  );
}

export function ClientOutcomes() {
  return (
    <MotionReveal>
      <section
        aria-labelledby="client-outcomes-heading"
        className="bg-[var(--app-muted-section)] px-6 py-12 min-[720px]:px-12 min-[1024px]:py-[72px] min-[1280px]:px-20 min-[1440px]:px-[120px]"
        id="client-work"
      >
        <div className="mx-auto w-full max-w-[1200px]">
        <header className="grid gap-4 min-[1024px]:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] min-[1024px]:items-start min-[1024px]:gap-x-12">
          <div className="min-w-0">
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)]">
              SELECTED CLIENT OUTCOMES
            </p>
            <h2
              className="font-heading mt-3 max-w-[700px] text-[38px] leading-[1.06] font-medium text-[var(--app-text-primary)] min-[1024px]:mt-2.5 min-[1024px]:text-[44px] min-[1024px]:leading-[1.06] min-[1280px]:text-[48px]"
              id="client-outcomes-heading"
            >
              Commercial work under real constraints.
            </h2>
          </div>
          <p className="min-w-0 text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:pt-[30px]">
            Greenfield builds, architectural resets and production systems for
            startups, government and health technology teams.
          </p>
        </header>

        <ul className="mt-6 grid gap-4 min-[720px]:grid-cols-2 min-[1024px]:mt-9 min-[1024px]:grid-cols-3 min-[1024px]:gap-0">
          <LogicallyOutcome />
          {outcomeDetails.map((outcome) => (
            <CompactOutcome key={outcome.company} {...outcome} />
          ))}
        </ul>
        </div>
      </section>
    </MotionReveal>
  );
}
