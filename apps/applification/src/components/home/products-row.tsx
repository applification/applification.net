import { ArrowRight } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";
import { MotionReveal } from "./motion";
import { ProductStatus } from "./product-status";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

type ProductCardProps = {
  children: ReactNode;
  className: string;
  description: string;
  href: string;
  kicker: string;
  label: string;
  labelClassName: string;
  linkClassName: string;
  mutedClassName: string;
  name: string;
  status: "In Development" | "Live";
  title: string;
};

function ProductCard({
  children,
  className,
  description,
  href,
  kicker,
  label,
  labelClassName,
  linkClassName,
  mutedClassName,
  name,
  status,
  title,
}: ProductCardProps) {
  return (
    <article
      className={`flex min-w-0 flex-col gap-5 rounded-[20px] border p-5 min-[1024px]:rounded-3xl min-[1024px]:p-6 ${className}`}
      data-product-card={name.toLowerCase()}
    >
      <div className="font-caption flex flex-wrap items-center justify-between gap-x-4 gap-y-2 text-[11px] font-bold tracking-[0.7px] uppercase">
        <span className={labelClassName}>
          {label}
          <span className={`font-semibold ${mutedClassName}`}>&nbsp; · &nbsp;{kicker}</span>
        </span>
        <ProductStatus status={status} />
      </div>

      <div aria-hidden="true" className="min-h-[104px]">
        {children}
      </div>

      <div className="flex flex-1 flex-col gap-2.5">
        <h3 className="font-heading text-[28px] leading-[1.05] font-medium min-[1280px]:text-[30px]">
          {title}
        </h3>
        <p className={`text-[15px] leading-[1.5] ${mutedClassName}`}>{description}</p>
        <Link
          className={`link-sweep mt-auto inline-flex min-h-11 items-center gap-2 self-start pt-1 text-[15px] font-semibold ${linkClassName} ${focusClasses}`}
          data-product-link
          href={href}
        >
          <span className="link-sweep-label">Explore {name}</span>
          <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
        </Link>
      </div>
    </article>
  );
}

const schemaNodes = [
  { name: "source model", tone: "border-[var(--contexture-purple)]" },
  { name: "generated Convex files", tone: "border-[var(--contexture-pink)]" },
  { name: "agent changes via MCP", tone: "border-[var(--contexture-amber)]" },
];

function ContextureVisual() {
  return (
    <div className="font-caption flex flex-col gap-1.5">
      {schemaNodes.map((node, index) => (
        <div
          className={`flex items-center justify-between rounded-md border-l-2 bg-[var(--contexture-surface-raised)] px-2.5 py-1.5 text-[10px] font-semibold text-[var(--contexture-text)] ${node.tone}`}
          key={node.name}
        >
          <span>{node.name}</span>
          <span className="text-[var(--contexture-muted)]">0{index + 1}</span>
        </div>
      ))}
    </div>
  );
}

const waveformBars = [
  { height: "h-2.5", tone: "bg-[var(--voiced-mint)]" },
  { height: "h-[18px]", tone: "bg-[var(--voiced-muted)]" },
  { height: "h-7", tone: "bg-[var(--voiced-mint-soft)]" },
  { height: "h-[15px]", tone: "bg-[var(--voiced-ink)]" },
  { height: "h-[31px]", tone: "bg-[var(--voiced-mint)]" },
  { height: "h-[22px]", tone: "bg-[var(--voiced-muted)]" },
  { height: "h-3", tone: "bg-[var(--voiced-mint-soft)]" },
];

function VoicedVisual() {
  return (
    <div className="flex items-center gap-5">
      <div className="flex size-[88px] shrink-0 flex-col justify-between rounded-2xl bg-[var(--voiced-ink)] p-3 text-[var(--voiced-action-text)]">
        <span className="text-[26px] leading-none">⌘</span>
        <span className="font-caption text-[8px] font-bold tracking-[0.5px] text-[var(--voiced-mint-soft)]">
          RIGHT CMD
        </span>
      </div>
      <div className="flex flex-col gap-2.5">
        <div className="flex h-8 items-center gap-[5px]">
          {waveformBars.map((bar, index) => (
            <span
              className={`w-1 rounded-full ${bar.tone} ${bar.height}`}
              key={`${bar.height}-${index}`}
            />
          ))}
        </div>
        <span className="font-caption text-[10px] font-bold tracking-[0.45px] text-[var(--voiced-accent)]">
          SPEAK → TRANSCRIBE → PASTE
        </span>
      </div>
    </div>
  );
}

const storyNotes = [
  {
    label: "Homepage",
    tone: "border-[var(--storyloop-note-blue-border)] bg-[var(--storyloop-note-blue)] text-[var(--storyloop-note-blue-text)]",
  },
  {
    label: "Hero",
    tone: "border-[var(--storyloop-note-yellow-border)] bg-[var(--storyloop-note-yellow)] text-[var(--storyloop-note-yellow-text)]",
  },
  {
    label: "Approve?",
    tone: "border-[var(--storyloop-pink)] bg-[var(--storyloop-pink)] text-[var(--storyloop-ink)]",
  },
];

function StoryLoopsVisual() {
  return (
    <div className="flex flex-col gap-2">
      <div className="grid grid-cols-3 gap-2">
        {storyNotes.map((note) => (
          <span
            className={`font-storyloop-title flex h-14 items-center rounded-sm border px-2 ${note.tone}`}
            key={note.label}
          >
            {note.label}
          </span>
        ))}
      </div>
      <span className="font-caption flex items-center gap-2 text-[10px] font-semibold tracking-[0.5px] text-[var(--storyloop-indigo)] uppercase">
        <span className="size-[7px] rounded-full bg-[var(--storyloop-indigo)]" />
        Waiting for human approval
      </span>
    </div>
  );
}

export function ProductsRow() {
  return (
    <section
      aria-labelledby="products-heading"
      className="bg-[var(--app-section)] px-6 py-12 min-[720px]:px-12 min-[1024px]:py-[72px] min-[1280px]:px-20 min-[1440px]:px-[120px]"
      id="products"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 min-[1024px]:gap-9">
        <header className="grid gap-4 min-[1024px]:grid-cols-[minmax(0,1fr)_minmax(280px,360px)] min-[1024px]:items-start min-[1024px]:gap-x-12">
          <div className="min-w-0">
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)]">
              PRODUCTS · LIVE AND IN DEVELOPMENT
            </p>
            <h2
              className="font-heading mt-3 max-w-[700px] text-[34px] leading-[1.06] font-medium text-[var(--app-text-primary)] min-[1024px]:mt-2.5 min-[1024px]:text-[40px]"
              id="products-heading"
            >
              Products I design, build and run.
            </h2>
          </div>
          <div className="flex min-w-0 flex-col gap-1 min-[1024px]:pt-[30px]">
            <p className="text-base leading-[1.55] text-[var(--app-text-secondary)]">
              Contexture and Voiced are live and open source. StoryLoops is in
              development and already plans the work on this site.
            </p>
            <Link
              className={`link-sweep inline-flex min-h-11 items-center gap-2 self-start text-[15px] font-semibold text-[var(--app-label-text)] ${focusClasses}`}
              href="/products"
            >
              <span className="link-sweep-label">See all products</span>
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </Link>
          </div>
        </header>

        <MotionReveal>
          <div className="grid gap-4 min-[720px]:grid-cols-2 min-[1024px]:grid-cols-3 min-[1024px]:gap-6">
            <ProductCard
              className="scheme-dark border-[var(--contexture-border)] bg-[var(--contexture-shell)] text-[var(--contexture-text)] shadow-[0_12px_30px_var(--contexture-shadow)]"
              description="Model tables, refs and indexes once. Generate the files your app imports and let coding agents propose reviewable changes."
              href="/products/contexture"
              kicker="Open source"
              label="Contexture"
              labelClassName="text-[var(--contexture-cyan)]"
              linkClassName="text-[var(--contexture-purple)]"
              mutedClassName="text-[var(--contexture-muted)]"
              name="Contexture"
              status="Live"
              title="The visual source of truth for Convex apps."
            >
              <ContextureVisual />
            </ProductCard>
            <ProductCard
              className="scheme-light border-[var(--voiced-border)] bg-[var(--voiced-card)] text-[var(--voiced-ink)] shadow-[0_12px_28px_var(--voiced-shadow)]"
              description="Hold Right Command, speak, and paste the transcription into the text field you are already using."
              href="/products/voiced"
              kicker="Open source"
              label="Voiced"
              labelClassName="text-[var(--voiced-accent)]"
              linkClassName="text-[var(--voiced-ink)]"
              mutedClassName="text-[var(--voiced-muted)]"
              name="Voiced"
              status="Live"
              title="Hold a key. Speak. Keep typing."
            >
              <VoicedVisual />
            </ProductCard>
            <ProductCard
              className="scheme-light border-[var(--storyloop-border)] bg-[var(--storyloop-canvas)] text-[var(--storyloop-ink)] shadow-[0_12px_28px_var(--storyloop-shadow)] min-[720px]:col-span-2 min-[1024px]:col-span-1"
              description="Gives each task product context, then makes scope changes visible for approval before the map changes."
              href="/products/storyloops"
              kicker="Product R&D"
              label="StoryLoops"
              labelClassName="text-[var(--storyloop-indigo)]"
              linkClassName="text-[var(--storyloop-indigo)]"
              mutedClassName="text-[var(--storyloop-muted)]"
              name="StoryLoops"
              status="In Development"
              title="A product map coding agents cannot quietly ignore."
            >
              <StoryLoopsVisual />
            </ProductCard>
          </div>
        </MotionReveal>
      </div>
    </section>
  );
}
