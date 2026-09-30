import { StoryLoopsProductMap } from "@/components/home/storyloops-showcase";
import { ExternalLink } from "@/components/external-link";
import { LoamiCard } from "./loami-product-page";
import { sitePageCopy } from "@/lib/content/site-pages";
import Link from "next/link";
import type { ReactNode } from "react";
import { ProductStatus } from "@/components/home/product-status";
import { AstackRouteMap } from "./astack-product-page";
import { PageHero } from "@/components/page-hero";
import { ContextureSchemaPreview } from "@/components/products/contexture-schema-preview";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const portfolioStatuses = [
  { count: "02", status: "Live" },
  { count: "02", status: "In Development" },
  { count: "02", status: "Archived" },
] as const;

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

export function ProductsHero() {
  return (
    <PageHero
      aside={
        <div className="border-t border-[var(--app-border)] pt-[22px] min-[1024px]:self-end min-[1024px]:border-t-0 min-[1024px]:border-l min-[1024px]:py-1.5 min-[1024px]:pl-7">
          <div className="font-heading text-[76px] leading-[0.82] font-medium text-[var(--app-text-primary)] min-[821px]:text-[96px]">
            06
          </div>
          <div className="font-caption mt-5 text-[11px] font-semibold tracking-[0.9px] text-[var(--app-text-muted)] min-[821px]:text-xs">
            PRODUCTS IN THE PORTFOLIO
          </div>
          <ul className="font-caption mt-3 grid gap-2 text-[11px] font-semibold tracking-[0.45px] text-[var(--app-text-secondary)] min-[821px]:text-xs">
            {portfolioStatuses.map(({ count, status }) => (
              <li className="flex items-center gap-2" key={status}>
                <span className="w-5">{count}</span>
                <ProductStatus status={status} />
              </li>
            ))}
          </ul>
        </div>
      }
      density="compact"
      description={
        <p>
          {sitePageCopy.products.description}
        </p>
      }
      eyebrow="PRODUCTS"
      eyebrowDetail="LIVE, IN DEVELOPMENT AND ARCHIVED"
      headingId="products-page-heading"
      title={sitePageCopy.products.title}
    />
  );
}

function FeaturedAstack() {
  return (
    <section
      aria-labelledby="featured-astack-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20 min-[1024px]:py-[68px]"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-6 min-[1024px]:gap-[30px]">
        <div className="font-caption flex items-center justify-between gap-4 text-[11px] font-bold tracking-[1px] min-[1024px]:text-xs min-[1024px]:font-semibold">
          <div className="flex flex-wrap items-center gap-3">
            <span className="text-[var(--app-label-text)]">FEATURED PRODUCT</span>
            <ProductStatus status="In Development" />
          </div>
          <span className="text-[var(--app-text-muted)]">01 / 04</span>
        </div>

        <div className="grid gap-7 min-[1024px]:grid-cols-[420px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:gap-[42px]">
          <div className="flex flex-col items-start gap-[17px] min-[1024px]:gap-5">
            <h2
              className="font-heading text-[42px] leading-none font-medium text-[var(--app-text-primary)] min-[1024px]:text-[46px]"
              id="featured-astack-heading"
            >
              astack
            </h2>
            <p className="font-heading text-[25px] leading-[1.05] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[27px]">
              Outcome first. Proof built in.
            </p>
            <p className="text-base leading-[1.58] text-[var(--app-text-secondary)] min-[1024px]:text-[17px]">
              Give Codex an outcome. astack chooses the route, works within project guardrails and verifies the result.
            </p>
            <p className="text-sm text-[var(--app-text-secondary)]">
              Inspired by{" "}
              <ExternalLink
                className={`link-sweep inline-flex min-h-11 items-center font-semibold text-[var(--app-label-text)] ${focusClasses}`}
                href="https://github.com/cursor/plugins/tree/main/pstack"
              >
                <span className="link-sweep-label">Poteto’s pstack</span>
              </ExternalLink>
            </p>
            <ul className="flex flex-wrap gap-2" aria-label="astack capabilities">
              {["OPEN SOURCE", "CODEX", "VERIFICATION"].map((item) => (
                <li
                  className="font-caption rounded-full border border-[var(--app-border)] px-2.5 py-1.5 text-[9px] font-bold tracking-[0.6px] text-[var(--app-text-muted)] min-[1024px]:text-[10px]"
                  key={item}
                >
                  {item}
                </li>
              ))}
            </ul>
            <Link
              className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-4 text-base font-semibold text-[var(--app-text-on-action)] transition-[background-color,color,transform] hover:bg-[var(--app-action-hover)] active:translate-y-px ${focusClasses}`}
              href="/products/astack"
            >
              Explore astack
              <ArrowUpRightIcon />
            </Link>
          </div>

          <AstackRouteMap />
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
        <div className="font-caption flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold tracking-[0.55px] text-[var(--contexture-cyan)]">
          <span>OPEN SOURCE&nbsp; · &nbsp;CONVEX</span>
          <ProductStatus status="Live" />
        </div>
        <h3 className="font-heading mt-3 text-[30px] leading-none font-medium">Contexture</h3>
        <p className="mt-3 text-lg leading-[1.2] font-semibold">
          Give people and agents the same domain model.
        </p>
        <p className="mt-3 text-base leading-[1.55] text-[var(--contexture-muted)]">
          A live visual graph for Convex schemas, shared with coding agents through MCP.
        </p>
        <div className="mt-auto pt-5">
          <Link
            className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[var(--contexture-purple)] px-4 text-base font-semibold text-[var(--contexture-shell)] transition-[background-color,transform] hover:bg-[var(--contexture-text)] active:translate-y-px ${focusClasses}`}
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
        <div className="font-caption flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold tracking-[0.55px] text-[var(--voiced-accent)]">
          <span>OPEN SOURCE&nbsp; · &nbsp;NOTARISED</span>
          <ProductStatus status="Live" />
        </div>
        <h3 className="font-heading mt-3 text-[30px] leading-none font-medium">Voiced</h3>
        <p className="mt-3 text-lg leading-[1.2] font-semibold">
          Voice input for the text field you are already using.
        </p>
        <p className="mt-3 text-base leading-[1.55] text-[var(--voiced-muted)]">
          Hold Right Command, speak, and paste the transcription without changing context.
        </p>
        <div className="mt-auto pt-5">
          <Link
            className={`inline-flex min-h-11 w-fit items-center justify-center gap-2 rounded-full bg-[var(--voiced-action)] px-4 text-base font-semibold text-[var(--voiced-action-text)] transition-[background-color,transform] hover:bg-[var(--voiced-muted)] active:translate-y-px ${focusClasses}`}
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

function ArchiveCard({ name, href, summary, children }: { name: string; href: string; summary: string; children: ReactNode }) {
  return (
    <article className="overflow-hidden rounded-md border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-primary)]" data-archive-card>
      <div className="relative h-[112px] overflow-hidden border-b border-[var(--app-border)]">{children}</div>
      <div className="p-5">
        <ProductStatus status="Archived" />
        <h3 className="font-heading mt-3 text-[26px] leading-none">{name}</h3>
        <p className="mt-3 text-sm leading-relaxed text-[var(--app-text-secondary)]">{summary}</p>
        <Link href={href} className={`link-sweep mt-3 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--app-label-text)] ${focusClasses}`}><span className="link-sweep-label">Explore the archive</span><ArrowUpRightIcon /><span className="sr-only"> for {name}</span></Link>
      </div>
    </article>
  );
}

function StoryLoopsArchiveCard() {
  return (
    <ArchiveCard name="StoryLoops" href="/products/storyloops" summary="A story-mapping experiment whose lessons shaped astack.">
      <div className="absolute top-2 left-1/2 w-[1040px] -translate-x-1/2">
        <div className="origin-top scale-[0.32]"><StoryLoopsProductMap compact /></div>
      </div>
    </ArchiveCard>
  );
}

function PlantryCard() {
  return (
    <ArchiveCard name="Plantry" href="/products/plantry" summary="A household meal-planning experiment. Its work continues in Loami.">
      <div className="flex h-full items-start justify-center bg-[#F3EEE0] pt-2">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img alt="Plantry on iPhone showing a household meal plan." className="h-auto w-[140px] shrink-0" decoding="async" height={940} loading="lazy" src="/images/plantry-phone.png" width={536} />
      </div>
    </ArchiveCard>
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
          <p className="text-[17px] leading-[1.6] text-[var(--app-text-secondary)]">
            Each product page covers the problem, the working product and what comes next.
          </p>
        </header>

        <div data-active-products className="grid gap-[18px] min-[821px]:grid-cols-2 min-[1024px]:gap-5 min-[1280px]:grid-cols-3">
          <LoamiCard />
          <ContextureCard />
          <VoicedCard />
        </div>
        <div className="mt-8 border-t border-[var(--app-border)] pt-8">
          <h2 className="font-heading mb-5 text-3xl text-[var(--app-text-primary)]">From the archive</h2>
          <div className="grid gap-5 min-[720px]:grid-cols-2 max-w-[840px]">
            <StoryLoopsArchiveCard />
            <PlantryCard />
          </div>
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
              <p className="mt-2 text-base leading-[1.55] text-[var(--app-text-secondary)]">
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
    <main id="main-content" className="flex-1">
      <ProductsHero />
      <FeaturedAstack />
      <ProductDirectory />
      <SharedProductPrinciples />
    </main>
  );
}
