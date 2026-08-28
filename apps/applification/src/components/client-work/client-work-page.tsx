import { ContractCta } from "@/components/home/contract-cta";

type EvidenceSectionProps = {
  description: string;
  eyebrow: string;
  headingId: string;
  id: string;
  title: string;
  tone: "base" | "muted";
};

const contractFit = [
  "Greenfield architecture",
  "React + TypeScript",
  "AI product UX",
  "Remote UK",
];

function ClientWorkIntro() {
  return (
    <section
      aria-labelledby="client-work-heading"
      className="bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 py-16 min-[720px]:px-12 min-[1024px]:py-24 min-[1280px]:px-20 min-[1440px]:px-[120px]"
      data-client-work-section="opening-brief"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)]">
          CLIENT WORK&nbsp; · &nbsp;EVIDENCE OVER CLAIMS
        </p>
        <h1
          className="font-heading mt-4 max-w-[820px] text-[46px] leading-[1.02] font-medium text-[var(--app-text-primary)] min-[720px]:text-[56px] min-[1024px]:text-[62px]"
          id="client-work-heading"
        >
          Production work, with the decisions and outcomes attached.
        </h1>
        <p className="mt-5 max-w-[700px] text-lg leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[19px]">
          More than 20 years building greenfield products and rebuilding
          brittle frontends for startups, scale-ups and public services, close
          to both product decisions and code.
        </p>
      </div>
    </section>
  );
}

function EvidenceSection({
  description,
  eyebrow,
  headingId,
  id,
  title,
  tone,
}: EvidenceSectionProps) {
  return (
    <section
      aria-labelledby={headingId}
      className={`${tone === "base" ? "bg-[var(--app-section)]" : "bg-[var(--app-muted-section)]"} px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[88px] min-[1280px]:px-20 min-[1440px]:px-[120px]`}
      data-client-work-section={id}
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-5 min-[1024px]:grid-cols-[minmax(0,720px)_minmax(280px,360px)] min-[1024px]:items-end min-[1024px]:justify-between min-[1024px]:gap-12">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)]">
            {eyebrow}
          </p>
          <h2
            className="font-heading mt-3 text-[38px] leading-[1.06] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[48px]"
            id={headingId}
          >
            {title}
          </h2>
        </div>
        <p className="text-base leading-[1.55] text-[var(--app-text-secondary)]">
          {description}
        </p>
      </div>
    </section>
  );
}

function ContractFit() {
  return (
    <section
      aria-labelledby="contract-fit-heading"
      className="bg-[var(--app-muted-section)] px-6 py-12 min-[720px]:px-12 min-[1024px]:px-[120px] min-[1024px]:py-[54px]"
      data-client-work-section="best-contract-fit"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7 min-[1024px]:flex-row min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-12">
        <div className="max-w-[520px]">
          <p className="font-caption text-[10px] font-bold tracking-[0.9px] text-[var(--app-accent)]">
            BEST CONTRACT FIT
          </p>
          <h2
            className="font-heading mt-2 text-[34px] leading-[1.08] font-medium text-[var(--app-text-primary)]"
            id="contract-fit-heading"
          >
            Small teams with a real product problem.
          </h2>
        </div>

        <ul
          aria-label="Best contract fit"
          className="flex max-w-[600px] flex-wrap gap-2.5"
        >
          {contractFit.map((item) => (
            <li
              className="font-caption rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-3 py-2 text-[10px] font-semibold tracking-[0.4px] text-[var(--app-text-primary)]"
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

export function ClientWorkPage() {
  return (
    <main>
      <ClientWorkIntro />
      <EvidenceSection
        description="Built most of the v2 frontend, then co-built its production Agentic Chat for threat analysts."
        eyebrow="FEATURED CASE / LOGICALLY"
        headingId="logically-case-heading"
        id="featured-logically-case"
        title="Rebuilt the frontend, then connected AI to production."
        tone="base"
      />
      <EvidenceSection
        description="Two frontend contracts where the work changed how the teams designed, tested and released the product."
        eyebrow="SELECTED CONTRACTS"
        headingId="selected-contracts-heading"
        id="selected-contracts"
        title="Build the new thing. Leave it easier to change."
        tone="muted"
      />
      <EvidenceSection
        description="Healthcare, secure government services and public-facing tax systems."
        eyebrow="SUPPORTING EVIDENCE"
        headingId="supporting-evidence-heading"
        id="supporting-evidence"
        title="More production context"
        tone="base"
      />
      <ContractFit />
      <div data-client-work-section="contract-action">
        <ContractCta
          description="Remote contracts across the UK. Hybrid considered in North East England."
          eyebrow="AVAILABLE FOR CONTRACT WORK"
          title="Need a senior product engineer to turn an AI idea into working software?"
        />
      </div>
    </main>
  );
}
