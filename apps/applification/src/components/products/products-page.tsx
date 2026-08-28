import Link from "next/link";
import type { ReactNode } from "react";
import { ContractCta } from "@/components/home/contract-cta";
import { StoryLoopsProductMap } from "@/components/home/storyloops-showcase";
import { ContextureSchemaPreview } from "@/components/products/contexture-schema-preview";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const portfolioStatuses = [
  "01 SHIPPED",
  "01 OPEN SOURCE",
  "02 IN DEVELOPMENT",
];

const principles = [
  {
    title: "Start with real work",
    description: "Each product begins with a constraint people already feel.",
  },
  {
    title: "Keep systems visible",
    description: "State, structure and proposed changes should be inspectable.",
  },
  {
    title: "Make control explicit",
    description: "People decide when scope, data or behaviour changes.",
  },
  {
    title: "Ship useful software",
    description: "The product has to earn its place before the theory matters.",
  },
];

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

function ProductsHero() {
  return (
    <section
      aria-labelledby="products-page-heading"
      className="bg-[linear-gradient(180deg,var(--app-bg),var(--app-bg-end))] px-6 py-12 min-[821px]:min-h-[420px] min-[821px]:px-20 min-[821px]:py-[72px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-7 min-[821px]:grid-cols-[minmax(0,760px)_320px] min-[821px]:items-center min-[821px]:justify-between min-[821px]:gap-20">
        <div className="flex flex-col gap-[18px] min-[821px]:gap-[22px]">
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] min-[821px]:text-[13px] min-[821px]:font-semibold">
            PRODUCTS&nbsp; / &nbsp;BUILT, SHIPPED AND IN DEVELOPMENT
          </p>
          <h1
            className="font-heading max-w-[760px] text-[48px] leading-[0.96] font-medium tracking-[-0.025em] text-[var(--app-text-primary)] min-[821px]:text-[64px]"
            id="products-page-heading"
          >
            Products built around real work.
          </h1>
          <p className="max-w-[720px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[821px]:text-[19px]">
            A small portfolio of tools for clearer agent collaboration, shared
            domain context and useful everyday software.
          </p>
        </div>

        <div className="border-t border-[var(--app-border)] pt-[22px] min-[821px]:border-t-0 min-[821px]:border-l min-[821px]:py-1.5 min-[821px]:pl-7">
          <div className="font-heading text-[76px] leading-[0.82] font-medium text-[var(--app-text-primary)] min-[821px]:text-[96px]">
            04
          </div>
          <div className="font-caption mt-5 text-[11px] font-semibold tracking-[0.9px] text-[var(--app-text-muted)] min-[821px]:text-xs">
            PRODUCTS IN THE PORTFOLIO
          </div>
          <ul className="font-caption mt-3 grid gap-1.5 text-[11px] font-medium tracking-[0.45px] text-[var(--app-text-secondary)] min-[821px]:text-xs">
            {portfolioStatuses.map((status) => (
              <li key={status}>{status}</li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}

function FeaturedStoryLoops() {
  return (
    <section
      aria-labelledby="featured-storyloops-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20 min-[1024px]:py-[68px]"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 min-[1024px]:gap-[30px]">
        <div className="font-caption flex items-center justify-between text-[11px] font-bold tracking-[1px] min-[1024px]:text-xs min-[1024px]:font-semibold">
          <span className="text-[var(--app-label-text)]">FEATURED PRODUCT</span>
          <span className="text-[var(--app-text-muted)]">01 / 04</span>
        </div>

        <div className="grid gap-7 min-[1024px]:grid-cols-[420px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:gap-[42px]">
          <div className="flex flex-col items-start gap-[17px] min-[1024px]:gap-5">
            <span className="font-caption rounded-full bg-[var(--app-label)] px-2.5 py-1.5 text-[10px] font-bold tracking-[0.65px] text-[var(--app-label-text)] min-[1024px]:text-[11px]">
              IN DEVELOPMENT
            </span>
            <h2
              className="font-heading text-[42px] leading-none font-medium text-[var(--app-text-primary)] min-[1024px]:text-[46px]"
              id="featured-storyloops-heading"
            >
              StoryLoops
            </h2>
            <p className="font-heading text-[25px] leading-[1.05] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[27px]">
              A product map that coding agents cannot quietly ignore.
            </p>
            <p className="text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-base">
              StoryLoops routes agent context and proposed changes through the
              product map, with human approval before scope moves.
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="StoryLoops capabilities">
              {["PRODUCT MAP", "AGENT CONTEXT", "HUMAN APPROVAL"].map((item) => (
                <li
                  className="font-caption rounded-full border border-[var(--app-border)] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.6px] text-[var(--app-text-muted)] min-[1024px]:text-[10px]"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-4 text-sm font-semibold text-[var(--app-text-on-action)] transition-[background-color,color,transform] hover:bg-[var(--app-action-hover)] active:translate-y-px ${focusClasses}`}
              href="/products/storyloops"
            >
              Explore StoryLoops
              <ArrowUpRightIcon />
            </Link>
          </div>

          <StoryLoopsProductMap compact />
        </div>
      </div>
    </section>
  );
}

function ProductCardCopy({ children }: { children: ReactNode }) {
  return <div className="flex flex-1 flex-col p-5 min-[1024px]:p-6">{children}</div>;
}

function ContextureCard() {
  return (
    <article className="flex min-h-[475px] flex-col overflow-hidden rounded-md bg-[var(--contexture-shell)] text-[var(--contexture-text)] min-[1024px]:min-h-[540px]">
      <div className="h-[215px] shrink-0 min-[1024px]:h-[238px]">
        <ContextureSchemaPreview />
      </div>
      <ProductCardCopy>
        <span className="font-caption w-fit rounded-full bg-[var(--contexture-purple)] px-2.5 py-1 text-[9px] font-bold tracking-[0.6px] text-[var(--contexture-shell)] min-[1024px]:text-[10px]">
          OPEN SOURCE
        </span>
        <h3 className="font-heading mt-3 text-[30px] leading-none font-medium">Contexture</h3>
        <p className="mt-3 text-lg leading-[1.2] font-semibold">
          Give people and agents the same domain model.
        </p>
        <p className="mt-3 text-sm leading-[1.5] text-[var(--contexture-muted)]">
          A live visual graph for Convex schemas, shared with coding agents through MCP.
        </p>
        <div className="mt-auto pt-5">
          <Link
            className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[var(--contexture-purple)] px-4 text-sm font-semibold text-[var(--contexture-shell)] transition-[background-color,transform] hover:bg-[var(--contexture-text)] active:translate-y-px ${focusClasses}`}
            href="/products/contexture"
          >
            View Contexture
            <ArrowUpRightIcon />
          </Link>
        </div>
      </ProductCardCopy>
    </article>
  );
}

function VoiceWaveform() {
  const bars = [14, 26, 38, 30, 50, 36, 22, 42, 28, 16];

  return (
    <div aria-hidden="true" className="flex h-14 items-center gap-1.5">
      {bars.map((height, index) => (
        <span
          className={`${index % 3 === 0 ? "bg-[var(--voiced-ink)]" : index % 2 === 0 ? "bg-[var(--voiced-mint)]" : "bg-[var(--voiced-mint-soft)]"} w-1 rounded-full`}
          key={`${height}-${index}`}
          style={{ height }}
        />
      ))}
    </div>
  );
}

function VoicedCard() {
  return (
    <article className="flex min-h-[475px] flex-col overflow-hidden rounded-md border border-[var(--voiced-border)] bg-[var(--voiced-card)] text-[var(--voiced-ink)] min-[1024px]:min-h-[540px]">
      <div
        aria-label="A Right Command key beside a voice waveform."
        className="flex h-[215px] shrink-0 items-center justify-center gap-6 bg-[var(--voiced-preview)] px-5 min-[1024px]:h-[238px]"
        role="img"
      >
        <div aria-hidden="true" className="flex items-center gap-6">
          <div className="flex size-[92px] flex-col justify-between rounded-2xl bg-[var(--voiced-ink)] p-3 text-[var(--voiced-action-text)]">
            <span className="text-3xl">⌘</span>
            <span className="font-caption text-[7px] font-bold tracking-[0.6px] text-[var(--voiced-mint-soft)]">
              RIGHT COMMAND
            </span>
          </div>
          <VoiceWaveform />
        </div>
      </div>
      <ProductCardCopy>
        <span className="font-caption w-fit rounded-full bg-[#D8F5E1] px-2.5 py-1 text-[9px] font-bold tracking-[0.6px] text-[#197A45] min-[1024px]:text-[10px]">
          SHIPPED
        </span>
        <h3 className="font-heading mt-3 text-[30px] leading-none font-medium">Voiced</h3>
        <p className="mt-3 text-lg leading-[1.2] font-semibold">
          Voice input for the text field you are already using.
        </p>
        <p className="mt-3 text-sm leading-[1.5] text-[var(--voiced-muted)]">
          Hold Right Command, speak, and paste the transcription without changing context.
        </p>
        <div className="mt-auto pt-5">
          <Link
            className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[var(--voiced-action)] px-4 text-sm font-semibold text-[var(--voiced-action-text)] transition-[background-color,transform] hover:bg-[var(--voiced-muted)] active:translate-y-px ${focusClasses}`}
            href="/products/voiced"
          >
            View Voiced
            <ArrowUpRightIcon />
          </Link>
        </div>
      </ProductCardCopy>
    </article>
  );
}

function PlantryCard() {
  return (
    <article className="flex min-h-[475px] flex-col overflow-hidden rounded-md border border-[#DED5C4] bg-[#FFFDF7] text-[#153447] min-[1024px]:min-h-[540px]">
      <div className="relative h-[215px] shrink-0 overflow-hidden bg-[#F3EEE0] min-[1024px]:h-[238px]">
        {/* A native image keeps this static preview portable in Storybook. */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          alt="Plantry on iPhone showing a household meal plan."
          className="absolute top-3 left-1/2 h-auto w-[142px] -translate-x-1/2 drop-shadow-[0_12px_18px_#15344726] min-[1024px]:w-[158px]"
          decoding="async"
          height={940}
          loading="lazy"
          src="/images/plantry-phone.png"
          width={536}
        />
      </div>
      <ProductCardCopy>
        <span className="font-caption w-fit rounded-full bg-[#2F7D49] px-2.5 py-1 text-[9px] font-bold tracking-[0.6px] text-[#FFFBef] min-[1024px]:text-[10px]">
          PRODUCT R&amp;D
        </span>
        <h3 className="font-heading mt-3 text-[30px] leading-none font-medium">Plantry</h3>
        <p className="mt-3 text-lg leading-[1.2] font-semibold">
          Meal planning that understands the household.
        </p>
        <p className="mt-3 text-sm leading-[1.5] text-[#526879]">
          Plans the next 2 to 7 days around preferences, food that needs using and what is in season.
        </p>
        <div className="mt-auto pt-5">
          <Link
            className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[#153447] px-4 text-sm font-semibold text-[#FFFBef] transition-[background-color,transform] hover:bg-[#204F67] active:translate-y-px ${focusClasses}`}
            href="/products/plantry"
          >
            View Plantry
            <ArrowUpRightIcon />
          </Link>
        </div>
      </ProductCardCopy>
    </article>
  );
}

function ProductDirectory() {
  return (
    <section
      aria-labelledby="product-directory-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:px-20 min-[1024px]:py-[68px]"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-7 min-[1024px]:gap-[38px]">
        <header className="grid gap-[18px] min-[1024px]:grid-cols-[minmax(0,720px)_minmax(0,1fr)] min-[1024px]:items-end min-[1024px]:gap-[60px]">
          <div>
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] min-[1024px]:text-xs min-[1024px]:font-semibold">
              EXPLORE THE PORTFOLIO
            </p>
            <h2
              className="font-heading mt-2.5 text-[36px] leading-[1.02] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[40px]"
              id="product-directory-heading"
            >
              Choose a product to go deeper.
            </h2>
          </div>
          <p className="text-[15px] leading-[1.5] text-[var(--app-text-secondary)]">
            Each product page covers the problem, the working product and what comes next.
          </p>
        </header>

        <div className="grid gap-[18px] min-[821px]:grid-cols-2 min-[1024px]:gap-5 min-[1280px]:grid-cols-3">
          <ContextureCard />
          <VoicedCard />
          <PlantryCard />
        </div>
      </div>
    </section>
  );
}

function SharedProductPrinciples() {
  return (
    <section
      aria-labelledby="shared-principles-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-7 min-[1024px]:grid-cols-[360px_minmax(0,1fr)] min-[1024px]:gap-[70px]">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            HOW THEY RELATE
          </p>
          <h2
            className="font-heading mt-3 text-[34px] leading-[1.05] font-medium text-[var(--app-text-primary)]"
            id="shared-principles-heading"
          >
            Different products. The same working principles.
          </h2>
        </div>

        <div className="grid gap-6 min-[1024px]:grid-cols-4 min-[1024px]:gap-0">
          {principles.map((principle) => (
            <article
              className="border-l border-[var(--app-border)] py-0.5 pl-[18px] min-[1024px]:px-5 min-[1024px]:first:pl-5"
              key={principle.title}
            >
              <h3 className="text-base font-semibold text-[var(--app-text-primary)]">
                {principle.title}
              </h3>
              <p className="mt-2 text-[13px] leading-[1.45] text-[var(--app-text-secondary)]">
                {principle.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ProductsPageContent() {
  return (
    <main className="flex-1">
      <ProductsHero />
      <FeaturedStoryLoops />
      <ProductDirectory />
      <SharedProductPrinciples />
      <ContractCta
        description="I can join an existing team or assemble the product, design and engineering team needed to deliver the project. Remote work across the UK."
        title="Need a senior product engineer or a team to build your AI product?"
      />
    </main>
  );
}
