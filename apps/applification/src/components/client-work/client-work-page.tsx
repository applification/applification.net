import { ContractCta } from "@/components/home/contract-cta";
import { PageHero } from "@/components/page-hero";
import { contractPositioning } from "@/lib/contract-positioning";
import { ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";

const contractFit = [
  "Greenfield architecture",
  contractPositioning.stack,
  "AI product UX",
  contractPositioning.location,
];

const currentBrief = [
  ["Role", contractPositioning.role],
  ["Core stack", contractPositioning.stack],
  ["Location", contractPositioning.location],
  ["Best fit", contractPositioning.teamFit],
  ["Contract", contractPositioning.contractBasis],
];

const logicallyMetrics = [
  ["6 months", "Rebuild to release"],
  ["Days → minutes", "UI change time"],
  ["Several / day", "Production releases"],
  ["5 · 3 · 5", "FE · BE · Data Science"],
];

const peppyMetrics = [
  ["100s", "UI components"],
  ["E2E", "Cypress suite"],
  ["Overnight", "AI support"],
];

const supportingCases = [
  {
    company: "PANDO  /  65,000+ USERS",
    title: "Rebuilt a clinician app used across the NHS and MoD",
    copy: "Replaced effect-heavy god components with routed React UI. Built a white-label React Native proof of concept in four weeks.",
  },
  {
    company: "SUREVINE  /  SECURITY CLEARED",
    title: "Shipped secure email across Cabinet Office boundaries",
    copy: "Worked under government security clearance as the sole frontend engineer in small teams. Story maps turned policy requirements into agreed scope.",
  },
  {
    company: "HMRC  /  £1BN REPAID",
    title: "Found the release path in a 1.7m-user tax service",
    copy: "A story map showed the team could release without new feature-flag code. The service repaid £1bn and cut phone demand by £4.5m.",
  },
];

function CurrentBrief() {
  return (
    <aside
      aria-labelledby="current-brief-heading"
      className="w-full rounded-[18px] bg-[var(--app-card)] p-6 min-[720px]:max-w-[330px] min-[1024px]:w-[330px] min-[1024px]:shrink-0"
    >
      <h2
        className="font-caption text-[10px] font-bold leading-[13px] tracking-[1.2px] text-[var(--client-brief-label)]"
        id="current-brief-heading"
      >
        CURRENT BRIEF
      </h2>
      <dl className="mt-4 flex flex-col gap-4">
        {currentBrief.map(([term, value]) => (
          <div className="flex flex-col gap-[3px]" key={term}>
            <dt className="font-caption text-[9px] font-semibold leading-3 tracking-[1px] text-[var(--app-text-muted)] uppercase">
              {term}
            </dt>
            <dd className="text-[15px] font-semibold leading-[20px] text-[var(--app-text-primary)]">
              {value}
            </dd>
          </div>
        ))}
      </dl>
    </aside>
  );
}

export function ClientWorkHero() {
  return (
    <PageHero
      aside={<CurrentBrief />}
      description={
        <p>
          More than 20 years building greenfield products and rebuilding
          brittle frontends for startups, scale-ups and public services, close
          to both product decisions and code.
        </p>
      }
      eyebrow="CLIENT WORK"
      eyebrowDetail="EVIDENCE OVER CLAIMS"
      headingId="client-work-heading"
      sectionProps={{ "data-client-work-section": "opening-brief" }}
      title="Production work, with the decisions and outcomes attached."
    />
  );
}

export function LogicallyCaseStudy() {
  return (
    <section
      aria-labelledby="logically-case-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
      data-client-work-section="featured-logically-case"
      id="logically"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[38px]">
        <div className="grid gap-6 min-[1120px]:grid-cols-[minmax(0,720px)_minmax(0,360px)_44px] min-[1120px]:items-end min-[1120px]:gap-[38px]">
          <div className="flex min-w-0 flex-col gap-3">
            <p className="font-caption text-xs font-semibold tracking-[1.25px] text-[var(--app-label-text)]">
              FEATURED CASE&nbsp; / &nbsp;LOGICALLY
            </p>
            <h2
              className="font-heading max-w-[720px] text-[40px] leading-[1.07] font-medium text-[var(--app-text-primary)] min-[720px]:text-5xl"
              id="logically-case-heading"
            >
              Rebuilt the frontend, then connected AI to production.
            </h2>
          </div>
          <div className="max-w-[360px]">
            <p className="text-base leading-6 text-[var(--app-text-secondary)]">
              Built most of the v2 frontend, then co-built its production Agentic
              Chat for threat analysts.
            </p>
            <Link
              className="mt-4 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[var(--app-label-text)] underline decoration-current/45 underline-offset-4 transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
              href="/client-work/logically"
            >
              Read the complete case
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </Link>
          </div>
          <a
            aria-label="Visit Logically, opens in a new tab"
            className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--client-logically-link)] text-white transition-colors hover:bg-[var(--app-action-hover)] active:bg-[var(--cta-action-active)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
            href="https://logically.ai"
            rel="noreferrer"
            target="_blank"
          >
            <ArrowUpRight aria-hidden="true" size={15} strokeWidth={2} />
          </a>
        </div>

        <div className="grid items-start gap-6 min-[1120px]:grid-cols-[570px_minmax(0,606px)]">
          <article className="flex flex-col gap-6 rounded-[22px] bg-[var(--client-narrative)] p-6 min-[720px]:p-8">
            <h3 className="font-heading max-w-[500px] text-[30px] leading-[1.12] font-medium text-[var(--app-text-primary)] min-[720px]:text-[34px]">
              A typed path from Databricks to the product.
            </h3>
            <p className="max-w-[500px] text-base leading-[1.6] text-[var(--app-text-secondary)]">
              With one other engineer, I rebuilt an unsupported Create React
              App frontend in Next.js and took it to production in six months.
              Orval clients and Zod validation moved report logic behind typed
              APIs, cutting duplicated frontend business rules.
            </p>
            <div className="rounded-[14px] bg-[var(--app-card)] px-5 py-[18px]">
              <p className="font-caption text-[10px] font-bold tracking-[1px] text-[var(--client-brief-label)]">
                ARCHITECTURE PATH
              </p>
              <p className="font-caption mt-2 text-[15px] leading-[1.5] font-semibold text-[var(--app-text-primary)]">
                AI SDK UI&nbsp; → &nbsp;MCP&nbsp; → &nbsp;typed API&nbsp; →
                &nbsp;Databricks
              </p>
            </div>
          </article>

          <aside
            aria-labelledby="logically-evidence-heading"
            className="flex flex-col gap-[22px] rounded-[22px] bg-[#0b1220] p-6 min-[720px]:p-8 min-[1024px]:min-h-[432px]"
          >
            <h3
              className="font-caption text-[11px] font-bold tracking-[1.2px] text-[#7dd3fc]"
              id="logically-evidence-heading"
            >
              CHANGE / EVIDENCE
            </h3>
            <dl className="grid gap-3.5 min-[560px]:grid-cols-2">
              {logicallyMetrics.map(([value, label]) => (
                <div
                  className="flex min-h-[82px] flex-col justify-center gap-[5px] rounded-xl bg-[#111827] px-5 py-[14px]"
                  data-logically-evidence-metric
                  key={label}
                >
                  <dd className="font-caption text-[19px] leading-7 font-bold text-[#f8fafc] min-[720px]:text-[22px]">
                    {value}
                  </dd>
                  <dt className="font-caption text-[9px] font-semibold tracking-[0.9px] text-[#94a3b8] uppercase">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
            <div
              className="rounded-[14px] bg-[#111827] px-5 py-[18px]"
              data-logically-production-ai
            >
              <p className="font-caption text-[10px] font-bold tracking-[1px] text-[#7dd3fc]">
                PRODUCTION AI
              </p>
              <p className="mt-2 text-base leading-[1.55] text-[#cbd5e1]">
                Shipped Agentic Chat with Databricks tools. Call logging exposed
                a React effect making thousands of unintended model calls at
                roughly £500. The team traced it and stopped the waste.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}

export function SelectedContracts() {
  return (
    <section
      aria-labelledby="selected-contracts-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
      data-client-work-section="selected-contracts"
      id="selected-contracts"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-9">
        <div className="grid gap-5 min-[1120px]:grid-cols-[minmax(0,700px)_390px] min-[1120px]:items-end min-[1120px]:justify-between min-[1120px]:gap-[110px]">
          <div className="flex min-w-0 flex-col gap-2.5">
            <p className="font-caption text-xs font-semibold tracking-[1.25px] text-[var(--app-label-text)]">
              SELECTED CONTRACTS
            </p>
            <h2
              className="font-heading max-w-[700px] text-[38px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[720px]:text-[46px]"
              id="selected-contracts-heading"
            >
              Build the new thing. Leave it easier to change.
            </h2>
          </div>
          <p className="max-w-[390px] text-base leading-6 text-[var(--app-text-secondary)]">
            Two frontend contracts where the work changed how the teams
            designed, tested and released the product.
          </p>
        </div>

        <div className="grid items-start gap-6 min-[1120px]:grid-cols-[470px_minmax(0,706px)]">
          <article
            className="flex min-h-[468px] flex-col rounded-[22px] bg-[var(--app-card)] p-6 min-[720px]:p-[30px]"
            data-client-contract="eruptiv"
          >
            <div className="font-caption flex min-h-11 items-center justify-between gap-4">
              <p className="text-[11px] font-bold tracking-[1.1px] text-[var(--client-brief-label)]">
                ERUPTIV
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-semibold tracking-[0.8px] text-[var(--app-text-muted)]">
                  LIVE IN 4 MONTHS
                </p>
                <a
                  aria-label="Visit Client Server, opens in a new tab"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--app-action)] text-[var(--app-text-on-action)] transition-colors hover:bg-[var(--app-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
                  href="https://www.client-server.com/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <h3 className="font-heading mt-[22px] max-w-[410px] text-[32px] leading-[1.12] font-medium text-[var(--app-text-primary)] min-[720px]:text-[34px]">
              Built the whole recruitment frontend in three months. Production
              in four.
            </h3>
            <p className="mt-[22px] max-w-[400px] text-[17px] leading-[1.62] text-[var(--app-text-secondary)]">
              Sole frontend engineer alongside an API engineer and designer. I
              integrated the existing API so recruiters could publish jobs and
              track applicants while candidates searched and applied.
            </p>
            <div className="mt-[22px] rounded-[14px] bg-[var(--client-contract-proof)] px-[18px] py-4 min-[1024px]:py-[10px]">
              <p className="font-caption text-[9px] font-bold tracking-[1px] text-[var(--client-contract-proof-label)]">
                HANDOFF QUALITY
              </p>
              <p className="mt-1.5 text-base leading-[1.55] text-[var(--app-text-primary)]">
                Storybook let the designer inspect UI states before
                integration. Clear component boundaries kept later changes
                isolated.
              </p>
            </div>
            <Link
              className="mt-4 inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] underline decoration-current/45 underline-offset-4 transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
              href="/client-work/eruptiv"
            >
              Read the Eruptiv case
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </Link>
          </article>

          <article
            className="flex flex-col rounded-[22px] bg-[var(--app-card)] p-6 text-[var(--app-text-primary)] min-[720px]:min-h-[385px] min-[720px]:p-[30px]"
            data-client-contract="peppy-health"
          >
            <div className="font-caption flex min-h-11 items-center justify-between gap-4">
              <p className="text-[11px] font-bold tracking-[1.1px] text-[var(--client-brief-label)]">
                PEPPY HEALTH
              </p>
              <div className="flex items-center gap-2">
                <p className="text-[10px] font-semibold tracking-[0.8px] text-[var(--app-text-muted)]">
                  £12M ARR SERVICE
                </p>
                <a
                  aria-label="Visit Peppy Health, opens in a new tab"
                  className="inline-flex size-11 items-center justify-center rounded-full bg-[var(--app-action)] text-[var(--app-text-on-action)] transition-colors hover:bg-[var(--app-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
                  href="https://peppy.health/"
                  rel="noreferrer"
                  target="_blank"
                >
                  <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
                </a>
              </div>
            </div>
            <h3 className="font-heading mt-[22px] max-w-[600px] text-[32px] leading-[1.1] font-medium text-[var(--app-text-primary)] min-[720px]:text-4xl">
              Rebuilt a zero-test clinician panel for a £12m ARR service.
            </h3>
            <p className="mt-[22px] max-w-[600px] text-[17px] leading-[1.62] text-[var(--app-text-secondary)]">
              Led a two-person senior frontend team. We catalogued hundreds of
              UI components in Storybook, added a full Cypress end-to-end suite
              to GitHub Actions, and gave clinicians AI support for common
              questions overnight.
            </p>
            <dl className="mt-[22px] grid gap-3 min-[560px]:grid-cols-3">
              {peppyMetrics.map(([value, label]) => (
                <div
                  className="flex min-h-[75px] flex-col justify-center gap-[5px] rounded-xl bg-[var(--app-muted-section)] px-[18px] py-3"
                  key={label}
                >
                  <dd className="font-caption text-xl leading-[26px] font-bold">
                    {value}
                  </dd>
                  <dt className="font-caption text-[9px] font-semibold tracking-[0.8px] text-[var(--app-text-muted)] uppercase">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
            <Link
              className="mt-4 inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] underline decoration-current/45 underline-offset-4 transition-colors hover:text-[var(--app-sky-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] motion-reduce:transition-none"
              href="/client-work/peppy-health"
            >
              Read the Peppy Health case
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </Link>
          </article>
        </div>
      </div>
    </section>
  );
}

export function SupportingEvidence() {
  return (
    <section
      aria-labelledby="supporting-evidence-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[82px] min-[1440px]:px-[120px]"
      data-client-work-section="supporting-evidence"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[38px]">
        <div className="grid gap-4 min-[1120px]:grid-cols-[minmax(0,460px)_420px] min-[1120px]:items-end min-[1120px]:justify-between min-[1120px]:gap-[320px]">
          <h2
            className="font-heading text-[38px] leading-none font-medium text-[var(--app-text-primary)] min-[720px]:text-[42px] min-[1120px]:whitespace-nowrap"
            id="supporting-evidence-heading"
          >
            More production context
          </h2>
          <p className="max-w-[420px] text-[17px] leading-[1.55] text-[var(--app-text-secondary)]">
            Healthcare, secure government services and public-facing tax
            systems.
          </p>
        </div>

        <div className="grid gap-9 min-[1120px]:grid-cols-3 min-[1120px]:gap-10">
          {supportingCases.map((item) => (
            <article
              className="flex flex-col gap-3 border-t border-[var(--app-border)] pt-5 first:border-t-0 first:pt-0 min-[1120px]:min-h-[178px] min-[1120px]:border-t-0 min-[1120px]:pt-0"
              key={item.company}
            >
              <p className="font-caption min-h-8 text-[10px] font-bold tracking-[0.9px] text-[var(--client-brief-label)]">
                {item.company}
              </p>
              <h3 className="font-heading max-w-[360px] text-[25px] leading-[1.12] font-medium text-[var(--app-text-primary)]">
                {item.title}
              </h3>
              <p className="max-w-[360px] text-base leading-[1.6] text-[var(--app-text-secondary)]">
                {item.copy}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContractFit() {
  return (
    <section
      aria-labelledby="contract-fit-heading"
      className="bg-[var(--app-muted-section)] px-6 py-12 min-[720px]:px-12 min-[1024px]:py-[54px] min-[1440px]:px-[120px]"
      data-client-work-section="best-contract-fit"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 min-[1120px]:flex-row min-[1120px]:items-center min-[1120px]:justify-between min-[1120px]:gap-12">
        <div className="max-w-[520px]">
          <p className="font-caption text-[10px] font-bold tracking-[1.1px] text-[var(--client-brief-label)]">
            BEST CONTRACT FIT
          </p>
          <h2
            className="font-heading mt-2 text-[34px] leading-none font-medium text-[var(--app-text-primary)]"
            id="contract-fit-heading"
          >
            Small teams with a real product problem.
          </h2>
        </div>

        <ul
          aria-label="Best contract fit"
          className="flex w-full max-w-[600px] flex-wrap gap-2.5"
        >
          {contractFit.map((item) => (
            <li
              className="font-caption rounded-full bg-[var(--app-card)] px-[13px] py-[10px] text-[10px] leading-[13px] font-semibold text-[var(--app-text-primary)]"
              key={item}
            >
              {item}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

export function ClientWorkContractCta() {
  return (
    <div data-client-work-section="contract-action">
      <ContractCta
        actionLabel="Start a conversation"
        description="Remote contracts across the UK. Hybrid considered in North East England."
        eyebrow="AVAILABLE FOR CONTRACT WORK"
        layout="wide"
        title="Need a senior product engineer to turn an AI idea into working software?"
      />
    </div>
  );
}

export function ClientWorkPage() {
  return (
    <main>
      <ClientWorkHero />
      <LogicallyCaseStudy />
      <SelectedContracts />
      <SupportingEvidence />
      <ContractFit />
      <ClientWorkContractCta />
    </main>
  );
}
