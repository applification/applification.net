import { ArrowUpRight, Check } from "lucide-react";
import { contractPositioning } from "@/lib/contract-positioning";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

export const careerTimeline = [
  {
    year: "2003",
    title: "Founded Applification Ltd",
    description: "Independent consulting, product delivery and software engineering.",
  },
  {
    year: "2013",
    title: "Mobile product teams",
    description:
      "React Native, Node.js APIs and delivery leadership across travel and public-sector products.",
  },
  {
    year: "2018",
    title: "Secure government work",
    description:
      "Security-cleared frontend delivery for Cabinet Office and other government agencies.",
  },
  {
    year: "2021",
    title: "Clinician platforms",
    description:
      "Pando and Peppy: reliable admin surfaces, component systems and testing practices.",
  },
  {
    year: "2024",
    title: "Greenfield contract builds",
    description:
      "Sole frontend ownership for Eruptiv, taking the recruitment product from API integration to production in five months.",
  },
  {
    year: "2025",
    title: "Product and AI engineering at Logically.ai",
    description:
      "Rebuilt the frontend in Next.js, then co-built Agentic Chat for threat analysts with AI SDK UI, MCP and Databricks tools.",
    href: "https://www.logically.ai/",
  },
  {
    year: "2026",
    title: "AI product R&D at Applification",
    description:
      "Building StoryLoops, Contexture and Voiced, with each product testing a different use for agentic workflows.",
    current: true,
  },
] as const;

const positions = [
  {
    number: "01",
    title: "Frontend by instinct.",
    description:
      "React, TypeScript and Tailwind are where I move fastest. I care about composition, interaction quality and the architecture beneath both.",
  },
  {
    number: "02",
    title: "Full-stack in practice.",
    description:
      "I use Node.js and Convex when the product needs a complete vertical slice, especially in small teams and greenfield work.",
  },
  {
    number: "03",
    title: "AI-native.",
    description:
      "Claude Code and Codex speed up the work. Product context, narrow scope, tests, visible checks and human-controlled MCP workflows keep it honest.",
  },
] as const;

const profileFacts = [
  ["Role", contractPositioning.role, "text-[#f9a8d4]"],
  ["Stack", contractPositioning.stack, "text-[#fde68a]"],
  ["Location", contractPositioning.location, "text-[#bbf7d0]"],
  ["Fit", contractPositioning.teamFit, "text-[#bae6fd]"],
  ["Contract", contractPositioning.contractBasis, "text-[#c4b5fd]"],
] as const;

const bestFit = [
  "Greenfield or architectural reset",
  "React, TypeScript and Tailwind",
  "AI product interfaces and agent workflows",
  "Direct access to product decisions",
] as const;

function SectionHeading({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="grid gap-4 min-[900px]:grid-cols-[1fr_460px] min-[900px]:items-start min-[900px]:gap-16">
      <h2 className="font-heading text-[clamp(2.25rem,4vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.02em]">
        {title}
      </h2>
      <p className="max-w-[460px] text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[900px]:justify-self-end">
        {description}
      </p>
    </div>
  );
}

export function AboutHero() {
  return (
    <section
      className="bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)]"
      data-about-section="profile"
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 min-[900px]:grid-cols-[minmax(0,760px)_350px] min-[900px]:items-center min-[900px]:gap-20 min-[1200px]:px-0 min-[1200px]:py-[84px]">
        <div className="flex flex-col gap-[18px]">
          <p className="font-caption text-xs font-bold tracking-[1.4px] text-[var(--app-label-text)] uppercase">
            About&nbsp; · &nbsp;Dave Hudson
          </p>
          <h1 className="font-heading max-w-[760px] text-[clamp(3rem,6vw,3.875rem)] leading-[1.04] font-medium tracking-[-1.4px]">
            I build software, shape the work and stay close to the product.
          </h1>
          <p className="max-w-[680px] text-[clamp(1.0625rem,2vw,1.1875rem)] leading-[1.55] text-[var(--app-text-secondary)]">
            A {contractPositioning.role} with a frontend bias, full-stack depth
            and more than twenty years of experience turning uncertain product
            ideas into working software.
          </p>
        </div>

        <aside className="rounded-[20px] bg-[#0b1220] p-[26px] text-[#f8fafc]" aria-label="Profile facts">
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[#7dd3fc] uppercase">
            &gt; whoami
          </p>
          <p className="font-caption mt-2 text-lg font-bold tracking-[1.2px] uppercase">
            Dave Hudson
          </p>
          <dl className="mt-5 grid gap-5">
            {profileFacts.map(([label, value, colour]) => (
              <div className="flex items-baseline justify-between gap-5" key={label}>
                <dt className="font-caption text-[10px] font-bold tracking-[0.8px] text-[#94a3b8] uppercase">
                  {label}
                </dt>
                <dd className={`text-right text-sm font-medium ${colour}`}>{value}</dd>
              </div>
            ))}
          </dl>
        </aside>
      </div>
    </section>
  );
}

export function Positioning() {
  return (
    <section className="bg-[var(--app-section)]" data-about-section="positioning">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 min-[1200px]:px-0 min-[1200px]:py-[86px]">
        <SectionHeading
          title="Where I sit"
          description="The useful overlap between product thinking, interface engineering and modern AI-assisted delivery."
        />
        <ol className="mt-10 grid gap-10 min-[700px]:grid-cols-2 min-[1050px]:grid-cols-3 min-[1050px]:gap-[42px]">
          {positions.map((position) => (
            <li className="flex flex-col gap-3" key={position.number}>
              <span className="font-caption text-[11px] font-bold text-[var(--app-label-text)]">
                {position.number}
              </span>
              <h3 className="font-heading text-[28px] leading-[1.1] font-medium">
                {position.title}
              </h3>
              <p className="max-w-[360px] text-[15px] leading-[1.58] text-[var(--app-text-secondary)]">
                {position.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function CareerTimeline() {
  return (
    <section className="bg-[var(--app-muted-section)]" data-about-section="timeline">
      <div className="mx-auto grid w-full max-w-[1200px] gap-12 px-6 py-16 min-[900px]:grid-cols-[350px_minmax(0,1fr)] min-[900px]:gap-24 min-[1200px]:px-0 min-[1200px]:py-[84px]">
        <div className="flex flex-col gap-3.5 min-[900px]:sticky min-[900px]:top-24 min-[900px]:self-start">
          <p className="font-caption text-xs font-bold tracking-[1.2px] text-[var(--app-label-text)] uppercase">
            Selected timeline
          </p>
          <h2 className="font-heading text-[clamp(2.5rem,4vw,2.75rem)] leading-[1.05] font-medium tracking-[-0.02em]">
            More than twenty years, condensed.
          </h2>
          <p className="max-w-[380px] text-[15px] leading-[1.58] text-[var(--app-text-secondary)]">
            The through-line is consistent: understand the product, make the
            architecture legible and help a small team ship it.
          </p>
          <div className="mt-3 flex items-center gap-3" aria-hidden="true">
            <span className="font-caption text-[10px] font-bold tracking-[0.8px] text-[var(--app-text-muted)] uppercase">
              2003
            </span>
            <span className="h-px w-16 bg-[var(--app-border)]" />
            <span className="font-caption text-[10px] font-bold tracking-[0.8px] text-[var(--app-text-muted)] uppercase">
              Now
            </span>
          </div>
        </div>

        <ol>
          {careerTimeline.map((entry, index) => (
            <li
              className="relative grid grid-cols-[24px_minmax(0,1fr)] gap-x-4 pb-5 last:pb-0 min-[520px]:grid-cols-[64px_24px_minmax(0,1fr)] min-[520px]:gap-x-5"
              key={entry.year}
            >
              <time
                className="font-caption col-start-2 row-start-1 mb-2 text-[11px] font-bold tracking-[0.5px] text-[var(--app-label-text)] min-[520px]:col-start-1 min-[520px]:mb-0 min-[520px]:pt-[19px]"
                dateTime={entry.year}
              >
                {entry.year}
              </time>
              <span
                className="relative z-10 col-start-1 row-span-2 row-start-1 flex h-full min-h-7 justify-center min-[520px]:col-start-2 min-[520px]:row-span-1"
                aria-hidden="true"
              >
                <span className="mt-[17px] size-3.5 rounded-full border-[3px] border-[var(--app-muted-section)] bg-[var(--app-accent)] ring-1 ring-[var(--app-accent)]" />
                {index < careerTimeline.length - 1 ? (
                  <span className="absolute top-8 -bottom-5 left-1/2 w-px -translate-x-1/2 bg-[var(--app-border)]" />
                ) : null}
              </span>
              <article className="col-start-2 row-start-2 rounded-[18px] border border-[var(--app-border)] bg-[var(--app-card)] px-5 py-[18px] shadow-[0_16px_38px_-34px_#0b1220] min-[520px]:col-start-3 min-[520px]:row-start-1">
                <div className="flex items-start justify-between gap-4">
                  <h3 className="font-heading text-[clamp(1.25rem,2.4vw,1.45rem)] leading-[1.15] font-medium">
                    {"href" in entry ? (
                      <a
                        className={`inline-flex items-center gap-2 underline decoration-[var(--app-border)] underline-offset-4 transition-colors hover:text-[var(--app-action)] motion-reduce:transition-none ${focusClasses}`}
                        href={entry.href}
                        rel="noreferrer"
                        target="_blank"
                      >
                        {entry.title}
                        <ArrowUpRight aria-hidden="true" className="size-4 shrink-0" />
                        <span className="sr-only">, opens in a new tab</span>
                      </a>
                    ) : (
                      entry.title
                    )}
                  </h3>
                  {"current" in entry ? (
                    <span className="font-caption mt-0.5 shrink-0 rounded-full bg-[var(--app-label)] px-2.5 py-1 text-[9px] font-bold tracking-[0.7px] text-[var(--app-label-text)] uppercase">
                      Now
                    </span>
                  ) : null}
                </div>
                <p className="mt-2 max-w-[590px] text-[15px] leading-[1.52] text-[var(--app-text-secondary)]">
                  {entry.description}
                </p>
              </article>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function ContractFit() {
  return (
    <section className="bg-[var(--app-section)]" data-about-section="contract-fit">
      <div className="mx-auto w-full max-w-[1200px] px-6 py-16 min-[1200px]:px-0 min-[1200px]:py-[78px]">
        <SectionHeading
          title="The work I am looking for"
          description="Contract roles only. Remote by default; North East hybrid considered."
        />
        <div className="mt-[34px] grid items-start gap-6 min-[800px]:grid-cols-2">
          <article className="rounded-[20px] bg-[var(--app-card)] p-7">
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] uppercase">
              Best fit
            </p>
            <h3 className="font-heading mt-3 text-3xl leading-[1.1] font-medium">
              A small team with a product to shape.
            </h3>
            <ul className="mt-6 grid gap-3">
              {bestFit.map((item) => (
                <li className="flex gap-2.5 text-[15px] leading-[1.4]" key={item}>
                  <Check aria-hidden="true" className="mt-0.5 size-[15px] shrink-0 text-[var(--app-action)]" strokeWidth={2.4} />
                  {item}
                </li>
              ))}
            </ul>
          </article>

          <article className="rounded-[20px] bg-[var(--app-card)] p-7">
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] uppercase">
              Deliberate focus
            </p>
            <h3 className="font-heading mt-3 text-3xl leading-[1.1] font-medium">
              AI product engineering, not data science consultancy.
            </h3>
            <p className="mt-5 text-[15px] leading-[1.58] text-[var(--app-text-secondary)]">
              I build LLM-enabled products, coding-agent loops, MCP integrations
              and the interfaces that make them usable. I focus on hands-on web
              product engineering, not specialist Python, RAG or big-data
              consultancy. I take on contract work rather than permanent roles.
            </p>
          </article>
        </div>

        <div className="mt-6 flex flex-col gap-2 rounded-2xl bg-[var(--app-muted-section)] px-[22px] py-[18px] min-[780px]:flex-row min-[780px]:items-center min-[780px]:gap-6">
          <span className="font-caption text-[10px] font-bold tracking-[0.8px] text-[var(--app-label-text)] uppercase">
            Credentials
          </span>
          <p className="text-sm leading-[1.5] text-[var(--app-text-secondary)]">
            Certified Scrum Master&nbsp; · &nbsp;Certified Product Owner&nbsp; ·
            &nbsp;Government security clearance held for relevant engagements
          </p>
        </div>

      </div>
    </section>
  );
}

export function AboutPage() {
  return (
    <main className="flex-1 overflow-x-clip">
      <AboutHero />
      <Positioning />
      <CareerTimeline />
      <ContractFit />
    </main>
  );
}
