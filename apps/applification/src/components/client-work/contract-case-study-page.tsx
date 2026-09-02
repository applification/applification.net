import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { DetailContextRail } from "@/components/detail-context-rail";

type CaseStudy = {
  company: string;
  period: string;
  title: string;
  summary: string;
  metrics: Array<[value: string, label: string]>;
  pathLabel: string;
  path: string[];
  situationTitle: string;
  situation: string[];
  decisionsTitle: string;
  decisions: Array<{ title: string; copy: string }>;
  resultTitle: string;
  result: string;
  websiteLabel: string;
  websiteHref: string;
  nextLabel: string;
  nextHref: string;
};

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const eruptivCase: CaseStudy = {
  company: "ERUPTIV",
  period: "MARCH TO AUGUST 2024",
  title: "Build the whole recruitment frontend. Put it live in four months.",
  summary:
    "A greenfield Next.js product for Client Server, built against an existing API by one frontend engineer working with an API engineer and designer.",
  metrics: [
    ["3 months", "Frontend built"],
    ["4 months", "Production release"],
    ["1", "Frontend engineer"],
    ["3", "Core disciplines"],
  ],
  pathLabel: "DELIVERY PATH",
  path: ["Existing API", "Typed interface", "Storybook states", "Production"],
  situationTitle: "The backend existed. The customer product did not.",
  situation: [
    "Client Server needed a new recruitment platform around an existing API. Recruiters had to publish roles and track applicants, while candidates needed to search for jobs and apply.",
    "As the sole frontend engineer, I owned the web architecture and implementation. I worked directly with the API engineer and designer, keeping the integration boundary clear while the product took shape.",
  ],
  decisionsTitle: "Keep design, components and API integration independently testable.",
  decisions: [
    {
      title: "Build around the existing API contract",
      copy: "The frontend used the API already in place instead of widening the project into a backend rewrite. That kept the work focused on the recruiter and candidate journeys needed for release.",
    },
    {
      title: "Use TypeScript across the interface",
      copy: "Next.js and TypeScript gave the greenfield product one typed structure for pages, components and API integration. A single frontend engineer could change the product without chasing hidden dependencies.",
    },
    {
      title: "Put component states in Storybook",
      copy: "The designer could inspect and test interface states before they were connected to live data. Design review happened at the component boundary, where changes were cheaper to make.",
    },
    {
      title: "Use the fourth month to reach production",
      copy: "The complete frontend was ready after three months. The fourth month connected the final release work and took the recruitment platform live.",
    },
  ],
  resultTitle: "Three months to a complete frontend. Production after four.",
  result:
    "The finished product let recruiters publish jobs and track applicants, and let candidates search and apply. The component architecture also left a practical handoff: the designer could review states in Storybook and future changes had clear places to land.",
  websiteLabel: "Visit Client Server",
  websiteHref: "https://www.client-server.com/",
  nextLabel: "Read the Peppy Health case",
  nextHref: "/client-work/peppy-health",
};

const peppyHealthCase: CaseStudy = {
  company: "PEPPY HEALTH",
  period: "MARCH 2022 TO OCTOBER 2023",
  title: "Replace a zero-test clinician panel while the service scaled.",
  summary:
    "A two-person senior frontend team rebuilt Peppy Admin, the web panel clinicians used to support employees receiving Peppy's health benefit.",
  metrics: [
    ["2", "Senior frontend engineers"],
    ["100s", "Components catalogued"],
    ["Full E2E", "Cypress coverage"],
    ["£12m", "ARR during scale-up"],
  ],
  pathLabel: "RELIABILITY PATH",
  path: ["Inherited admin", "Component inventory", "Cypress in CI", "Safer releases"],
  situationTitle: "Clinicians depended on a tightly coupled panel with no tests.",
  situation: [
    "Peppy Admin was the working interface between clinicians and employees using Peppy's employer-funded health service. Its frontend had no automated tests and tightly coupled screens made changes risky.",
    "Led a two-person senior frontend team while Peppy grew to £12 million in annual recurring revenue. We had to modernise a live clinical tool without slowing the people using it every day.",
  ],
  decisionsTitle: "Make the inherited interface visible before changing it.",
  decisions: [
    {
      title: "Catalogue the existing interface in Storybook",
      copy: "The team recorded hundreds of UI components and their states. That turned an opaque frontend into an inventory the engineers could inspect, discuss and improve.",
    },
    {
      title: "Replace screen-level coupling with components",
      copy: "Clear component boundaries reduced the reach of routine changes. Work could move through smaller units instead of reopening an entire clinician workflow for every edit.",
    },
    {
      title: "Run the complete Cypress suite in GitHub Actions",
      copy: "End-to-end checks became part of the delivery path. The team could test the clinician journeys on every change instead of relying on manual confidence.",
    },
    {
      title: "Add AI support where clinician cover stopped",
      copy: "The clinician-side Sendbird integration answered common user questions when clinicians were unavailable, including overnight. It extended support without pretending AI replaced clinical care.",
    },
  ],
  resultTitle: "More frequent releases, fewer bugs and a team that could change the panel safely.",
  result:
    "Storybook made the interface inspectable, Cypress put the main journeys under automated checks, and GitHub Actions ran those checks on delivery. The rebuilt frontend gave a growing healthcare service a more dependable way to ship changes.",
  websiteLabel: "Visit Peppy Health",
  websiteHref: "https://peppy.health/",
  nextLabel: "Read the Logically case",
  nextHref: "/client-work/logically",
};

function ContractCaseStudyPage({ caseStudy }: { caseStudy: CaseStudy }) {
  return (
    <main className="flex-1 overflow-x-clip">
      <article>
        <header className="bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 py-12 min-[720px]:px-12 min-[1024px]:py-[82px] min-[1440px]:px-[120px]">
          <div className="mx-auto w-full max-w-[1200px]">
            <DetailContextRail
              backHref="/client-work#selected-contracts"
              backLabel="Back to Client work"
              family={caseStudy.company}
              detail={caseStudy.period}
            />

            <div className="mt-8 grid gap-8 min-[1024px]:grid-cols-[minmax(0,760px)_minmax(260px,340px)] min-[1024px]:items-end min-[1024px]:justify-between">
              <div>
                <h1 className="font-heading max-w-[820px] text-[clamp(3rem,7vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                  {caseStudy.title}
                </h1>
              </div>
              <p className="max-w-[340px] text-[17px] leading-[1.62] text-[var(--app-text-secondary)]">
                {caseStudy.summary}
              </p>
            </div>

            <dl className="mt-10 grid gap-px overflow-hidden rounded-[18px] bg-[var(--app-border)] min-[560px]:grid-cols-2 min-[1024px]:grid-cols-4">
              {caseStudy.metrics.map(([value, label]) => (
                <div className="bg-[var(--app-card)] px-5 py-5" key={label}>
                  <dd className="font-heading text-[28px] leading-none font-medium min-[720px]:text-[32px]">
                    {value}
                  </dd>
                  <dt className="font-caption mt-2 text-[9px] font-semibold tracking-[0.75px] text-[var(--app-text-muted)] uppercase">
                    {label}
                  </dt>
                </div>
              ))}
            </dl>
          </div>
        </header>

        <section
          aria-labelledby="case-context-heading"
          className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <div className="grid gap-10 min-[960px]:grid-cols-[minmax(0,340px)_minmax(0,700px)] min-[960px]:justify-between">
              <div>
                <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
                  SITUATION / RESPONSIBILITY
                </p>
                <h2 className="font-heading mt-3 text-[40px] leading-[1.04] font-medium" id="case-context-heading">
                  {caseStudy.situationTitle}
                </h2>
              </div>
              <div className="grid gap-8 text-[17px] leading-[1.7] text-[var(--app-text-secondary)]">
                {caseStudy.situation.map((paragraph) => (
                  <p key={paragraph}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-12 rounded-[20px] bg-[var(--app-muted-section)] p-5 min-[720px]:p-7">
              <p className="font-caption text-[10px] font-bold tracking-[1px] text-[var(--app-label-text)]">
                {caseStudy.pathLabel}
              </p>
              <ol className="mt-5 grid gap-px overflow-hidden rounded-[14px] bg-[var(--app-border)] min-[760px]:grid-cols-4">
                {caseStudy.path.map((step, index) => (
                  <li className="font-caption flex min-h-[72px] items-center gap-3 bg-[var(--app-card)] px-4 py-4 text-[11px] font-semibold text-[var(--app-text-primary)]" key={step}>
                    <span className="text-[var(--app-label-text)]">{String(index + 1).padStart(2, "0")}</span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </section>

        <section
          aria-labelledby="case-decisions-heading"
          className="bg-[var(--app-muted-section)] px-6 py-14 text-[var(--app-text-primary)] min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
              KEY DECISIONS
            </p>
            <h2 className="font-heading mt-3 max-w-[760px] text-[40px] leading-[1.04] font-medium min-[720px]:text-[48px]" id="case-decisions-heading">
              {caseStudy.decisionsTitle}
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-[20px] bg-[var(--app-border)] min-[860px]:grid-cols-2">
              {caseStudy.decisions.map((decision, index) => (
                <li className="bg-[var(--app-card)] p-6 min-[720px]:p-8" key={decision.title}>
                  <span className="font-caption text-[10px] font-bold text-[var(--app-label-text)]">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-heading mt-5 text-[28px] leading-[1.08] font-medium">
                    {decision.title}
                  </h3>
                  <p className="mt-4 text-base leading-[1.65] text-[var(--app-text-secondary)]">
                    {decision.copy}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section
          aria-labelledby="case-result-heading"
          className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
        >
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 min-[960px]:grid-cols-[minmax(0,700px)_minmax(260px,340px)] min-[960px]:items-end min-[960px]:justify-between">
            <div>
              <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
                PRODUCTION RESULT
              </p>
              <h2 className="font-heading mt-3 text-[40px] leading-[1.04] font-medium min-[720px]:text-[48px]" id="case-result-heading">
                {caseStudy.resultTitle}
              </h2>
              <p className="mt-6 max-w-[680px] text-[17px] leading-[1.7] text-[var(--app-text-secondary)]">
                {caseStudy.result}
              </p>
            </div>
            <a
              className={`inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] underline decoration-current/45 underline-offset-4 hover:text-[var(--app-sky-text)] min-[960px]:self-end ${focusClasses}`}
              href={caseStudy.websiteHref}
              rel="noreferrer"
              target="_blank"
            >
              {caseStudy.websiteLabel}
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </section>

        <nav aria-label="Case study next steps" className="bg-[var(--app-muted-section)] px-6 py-10 min-[720px]:px-12 min-[1440px]:px-[120px]">
          <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 min-[680px]:flex-row min-[680px]:items-center min-[680px]:justify-between">
            <Link className={`inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[var(--app-label-text)] underline decoration-current/45 underline-offset-4 hover:text-[var(--app-sky-text)] ${focusClasses}`} href="/client-work#selected-contracts">
              <ArrowLeft aria-hidden="true" className="size-4" strokeWidth={2} />
              Return to Client work
            </Link>
            <Link className={`inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[var(--app-label-text)] underline decoration-current/45 underline-offset-4 hover:text-[var(--app-sky-text)] ${focusClasses}`} href={caseStudy.nextHref}>
              {caseStudy.nextLabel}
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </nav>
      </article>
    </main>
  );
}

export function EruptivCaseStudyPage() {
  return <ContractCaseStudyPage caseStudy={eruptivCase} />;
}

export function PeppyHealthCaseStudyPage() {
  return <ContractCaseStudyPage caseStudy={peppyHealthCase} />;
}
