import { heroTopSpacing } from "@/components/page-hero";
import { CaseStudyVisual } from "./case-study-visual";
import { CaseStudyContact, CaseStudyFacts } from "./case-study-contact";
import { ArrowUpRight } from "lucide-react";
import { DetailContextRail } from "@/components/detail-context-rail";

const metrics = [
  ["6 months", "Rebuild to production"],
  ["Days to minutes", "Routine UI change time"],
  ["Several each day", "Production releases"],
];

const decisions = [
  {
    title: "Replace the unsupported frontend without replacing the platform",
    copy: "The team rebuilt the Create React App frontend as a multi-page Next.js product while keeping the existing backend services in place. That limited the migration boundary and let the old product continue serving customers.",
  },
  {
    title: "Move report rules behind typed APIs",
    copy: "A contract-driven path moved report construction out of React and through backend APIs to Databricks. Orval-generated clients and Zod validation removed duplicated frontend rules and made failures visible at the boundary.",
  },
  {
    title: "Connect the AI interface to production tools",
    copy: "The production Agentic Chat used the Vercel AI SDK to call Databricks threat-analysis and person-lookup capabilities through MCP tools and the typed application API.",
  },
  {
    title: "Instrument model calls before tuning the interface",
    copy: "Call logging exposed a React effect that triggered thousands of unintended model calls at a cost of about £500. The team could trace the source and stop the waste because each call had evidence attached.",
  },
];

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function LogicallyCaseStudyPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <article>
        <header className={`${heroTopSpacing} bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 pb-12 min-[720px]:px-12 min-[1024px]:pb-[82px] min-[1440px]:px-[120px]`}>
          <div className="mx-auto w-full max-w-[1200px]">
            <DetailContextRail
              backHref="/client-work#logically"
              backLabel="Back to Client work"
              family="Logically"
              detail="October 2024 to May 2026"
            />

            <div className="mt-8 grid gap-8 min-[1024px]:grid-cols-[minmax(0,760px)_minmax(260px,340px)] min-[1024px]:items-end min-[1024px]:justify-between">
              <div>
                <h1 className="font-heading max-w-[760px] text-[clamp(3rem,7vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                  Rebuild the product. Then connect AI to production.
                </h1>
              </div>
              <p className="max-w-[340px] text-[17px] leading-[1.62] text-[var(--app-text-secondary)]">
                Two roles, one product path: rebuild an unsupported intelligence
                frontend, make its reporting contracts explicit, then ship an AI
                interface used by threat analysts.
              </p>
            </div>

            <CaseStudyFacts role="Principal Frontend Engineer, then Principal AI Product Engineer" engagement="Full-time at Logically" stack="Next.js, TypeScript, Vercel AI SDK, MCP" />
            <dl className="mt-10 grid gap-px overflow-hidden rounded-[18px] bg-[var(--app-border)] min-[720px]:grid-cols-3">
              {metrics.map(([value, label]) => (
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
            <CaseStudyVisual project="logically" />
          </div>
        </header>

        <section className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]" aria-labelledby="case-context-heading">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 min-[960px]:grid-cols-[minmax(0,340px)_minmax(0,700px)] min-[960px]:justify-between">
            <div>
              <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
                SITUATION / RESPONSIBILITY
              </p>
              <h2 className="font-heading mt-3 text-[40px] leading-[1.04] font-medium" id="case-context-heading">
                A live platform that could not pause for a rewrite.
              </h2>
            </div>
            <div className="grid gap-8 text-[17px] leading-[1.7] text-[var(--app-text-secondary)]">
              <p>
                Logically Intelligence depended on an unsupported Create React
                App frontend with product rules embedded in the interface. The
                team still had to support the existing platform while building
                its replacement.
              </p>
              <p>
                As Principal Frontend Engineer, I architected and built most of
                the v2 frontend with one other engineer. I led five frontend
                engineers and coordinated the architecture with three backend
                engineers and five data scientists. I later moved into the
                Principal AI Product Engineer role and co-built the production
                Agentic Chat experience.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-[var(--app-muted-section)] px-6 py-14 text-[var(--app-text-primary)] min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]" aria-labelledby="case-decisions-heading">
          <div className="mx-auto w-full max-w-[1200px]">
            <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
              KEY DECISIONS
            </p>
            <h2 className="font-heading mt-3 max-w-[760px] text-[40px] leading-[1.04] font-medium min-[720px]:text-[48px]" id="case-decisions-heading">
              Make each boundary testable before adding more intelligence.
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-[20px] bg-[var(--app-border)] min-[860px]:grid-cols-2">
              {decisions.map((decision, index) => (
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

        <section className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]" aria-labelledby="case-result-heading">
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 min-[960px]:grid-cols-[minmax(0,700px)_minmax(260px,340px)] min-[960px]:items-end min-[960px]:justify-between">
            <div>
              <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
                PRODUCTION RESULT
              </p>
              <h2 className="font-heading mt-3 text-[40px] leading-[1.04] font-medium min-[720px]:text-[48px]" id="case-result-heading">
                Six months to production, then several releases a day.
              </h2>
              <p className="mt-6 max-w-[680px] text-[17px] leading-[1.7] text-[var(--app-text-secondary)]">
                Routine interface changes fell from days to minutes. Every pull
                request received a Vercel preview and automated GitHub Actions
                checks, and merging released the application. The same product
                later carried a production LLM interface connected to the
                organisation’s threat-analysis tools.
              </p>
            </div>
            <a
              className={`link-sweep inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] hover:text-[var(--app-sky-text)] min-[960px]:self-end ${focusClasses}`}
              href="https://logically.ai"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="link-sweep-label">Visit Logically</span>
              <ArrowUpRight aria-hidden="true" className="size-4" strokeWidth={2} />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </section>

        <CaseStudyContact nextHref="/client-work/eruptiv" nextLabel="Read the Eruptiv case" />
      </article>
    </main>
  );
}
