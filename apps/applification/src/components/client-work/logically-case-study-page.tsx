import {
  logicallyMetrics as metrics,
  logicallyDecisions as decisions,
  logicallyCopy,
} from "@/lib/content/client-work";
import { heroTopSpacing } from "@/components/page-hero";
import { CaseStudyVisual } from "./case-study-visual";
import { CaseStudyContact, CaseStudyFacts } from "./case-study-contact";
import { ArrowUpRight } from "lucide-react";
import { DetailContextRail } from "@/components/detail-context-rail";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export function LogicallyCaseStudyPage() {
  return (
    <main id="main-content" className="flex-1 overflow-x-clip">
      <article>
        <header
          className={`${heroTopSpacing} bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 pb-12 min-[720px]:px-12 min-[1024px]:pb-[82px] min-[1440px]:px-[120px]`}
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <DetailContextRail
              backHref="/client-work#logically"
              backLabel="Back to Client work"
              family="Logically"
              detail={logicallyCopy.period}
            />

            <div className="mt-8 grid gap-8 min-[1024px]:grid-cols-[minmax(0,760px)_minmax(260px,340px)] min-[1024px]:items-end min-[1024px]:justify-between">
              <div>
                <h1 className="font-heading max-w-[760px] text-[clamp(3rem,7vw,5.4rem)] leading-[0.94] font-medium tracking-[-0.035em]">
                  {logicallyCopy.titles[0]}
                </h1>
              </div>
              <p className="max-w-[340px] text-[17px] leading-[1.62] text-[var(--app-text-secondary)]">
                {logicallyCopy.paragraphs[0]}
              </p>
            </div>

            <CaseStudyFacts
              role={logicallyCopy.role}
              engagement={logicallyCopy.engagement}
              stack={logicallyCopy.stack}
            />
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

        <section
          className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
          aria-labelledby="case-context-heading"
        >
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 min-[960px]:grid-cols-[minmax(0,340px)_minmax(0,700px)] min-[960px]:justify-between">
            <div>
              <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
                SITUATION / RESPONSIBILITY
              </p>
              <h2
                className="font-heading mt-3 text-[40px] leading-[1.04] font-medium"
                id="case-context-heading"
              >
                {logicallyCopy.titles[1]}
              </h2>
            </div>
            <div className="grid gap-8 text-[17px] leading-[1.7] text-[var(--app-text-secondary)]">
              <p>{logicallyCopy.paragraphs[1]}</p>
              <p>{logicallyCopy.paragraphs[2]}</p>
            </div>
          </div>
        </section>

        <section
          className="bg-[var(--app-muted-section)] px-6 py-14 text-[var(--app-text-primary)] min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
          aria-labelledby="case-decisions-heading"
        >
          <div className="mx-auto w-full max-w-[1200px]">
            <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
              KEY DECISIONS
            </p>
            <h2
              className="font-heading mt-3 max-w-[760px] text-[40px] leading-[1.04] font-medium min-[720px]:text-[48px]"
              id="case-decisions-heading"
            >
              {logicallyCopy.titles[2]}
            </h2>
            <ol className="mt-10 grid gap-px overflow-hidden rounded-[20px] bg-[var(--app-border)] min-[860px]:grid-cols-2">
              {decisions.map((decision, index) => (
                <li
                  className="bg-[var(--app-card)] p-6 min-[720px]:p-8"
                  key={decision.title}
                >
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
          className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1440px]:px-[120px]"
          aria-labelledby="case-result-heading"
        >
          <div className="mx-auto grid w-full max-w-[1200px] gap-10 min-[960px]:grid-cols-[minmax(0,700px)_minmax(260px,340px)] min-[960px]:items-end min-[960px]:justify-between">
            <div>
              <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--app-label-text)]">
                PRODUCTION RESULT
              </p>
              <h2
                className="font-heading mt-3 text-[40px] leading-[1.04] font-medium min-[720px]:text-[48px]"
                id="case-result-heading"
              >
                {logicallyCopy.titles[3]}
              </h2>
              <p className="mt-6 max-w-[680px] text-[17px] leading-[1.7] text-[var(--app-text-secondary)]">
                {logicallyCopy.paragraphs[3]}
              </p>
            </div>
            <a
              className={`link-sweep inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] hover:text-[var(--app-sky-text)] min-[960px]:self-end ${focusClasses}`}
              href="https://logically.ai"
              rel="noopener noreferrer"
              target="_blank"
            >
              <span className="link-sweep-label">Visit Logically</span>
              <ArrowUpRight
                aria-hidden="true"
                className="size-4"
                strokeWidth={2}
              />
              <span className="sr-only">, opens in a new tab</span>
            </a>
          </div>
        </section>

        <CaseStudyContact
          nextHref="/client-work/eruptiv"
          nextLabel="Read the Eruptiv case"
        />
      </article>
    </main>
  );
}
