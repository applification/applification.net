import Link from "next/link";
import { Bot, ChevronDown, CloudUpload, CodeXml } from "lucide-react";
import { MotionReveal } from "./motion";
import { ProductStatus } from "./product-status";

const mapStories = [
  ["S-01", "Availability banner"],
  ["S-02", "Header navigation"],
  ["S-03", "Footer navigation"],
  ["S-04", "Hero"],
  ["S-05", "Currently building"],
];

const reviewStories = [
  { title: "Try a stronger product crop", status: "In progress", tone: "text-[var(--storyloop-approval-text)]" },
  { title: "Review mobile composition", status: "Approved", tone: "text-[var(--storyloop-approved)]" },
  { title: "Update supporting copy", status: "Proposed", tone: "text-[var(--storyloop-pink)]" },
];

function WindowDots({ small = false }: { small?: boolean }) {
  const size = small ? "size-2" : "size-2.5";

  return (
    <span className="flex items-center gap-1.5">
      <span className={`${size} rounded-full bg-[var(--storyloop-window-close)]`} />
      <span className={`${size} rounded-full bg-[var(--storyloop-window-minimise)]`} />
      <span className={`${size} rounded-full bg-[var(--storyloop-window-expand)]`} />
    </span>
  );
}

function DesktopStoryMap({
  compact = false,
  detail = false,
}: {
  compact?: boolean;
  detail?: boolean;
}) {
  const backboneNotes = compact
    ? ["Architecture", "Products", "Client work", "Writing"]
    : ["Architecture", "Home", "Products"];
  const narrativeNotes = compact
    ? ["Navigation", "Homepage", "Product pages", "StoryLoops"]
    : ["Availability", "Navigation", "Sections", "StoryLoops"];
  const visibleStories = compact ? mapStories.slice(0, 4) : mapStories;

  return (
    <div
      className={`${detail ? "h-[410px] p-5" : compact ? "h-[440px] rounded-[20px] p-4" : "h-[560px] rounded-3xl p-5"} storyloop-map-container hidden w-full flex-col gap-4 bg-[var(--storyloop-shell)] ${detail ? "" : "shadow-[0_16px_40px_var(--storyloop-shadow)]"} min-[1024px]:flex`}
    >
      <div className="flex h-[30px] shrink-0 items-center justify-between">
        <div className="flex items-center gap-2.5">
          <WindowDots />
          <span className="font-caption text-[11px] font-semibold tracking-[1px] text-[var(--storyloop-text-strong)]">
            STORYLOOP
          </span>
        </div>
        <span className="font-caption flex items-center gap-2 rounded-full bg-[var(--storyloop-badge)] px-2.5 py-1.5 text-[9px] font-medium tracking-[0.5px] text-[var(--storyloop-badge-text)]">
          <span className="size-[7px] rounded-full bg-[var(--storyloop-indigo)]" />
          LIVE MAP · v3
        </span>
      </div>

      <div
        className={`${compact ? "grid-cols-[128px_minmax(0,1fr)_220px]" : "grid-cols-[184px_minmax(0,1fr)_310px]"} grid min-h-0 flex-1 overflow-hidden rounded-xl bg-[var(--storyloop-canvas)]`}
      >
        <aside className="flex flex-col gap-[18px] border-r border-[var(--storyloop-border)] bg-[var(--storyloop-sidebar)] px-3.5 py-[18px]">
          <div className="flex flex-col gap-1">
            <span className="font-caption text-[9px] font-medium tracking-[0.8px] text-[var(--storyloop-muted)]">
              CONTROL PLANE
            </span>
            <span className={`${compact ? "text-xs" : "text-sm"} font-semibold text-[var(--storyloop-ink)]`}>
              Applification.net
            </span>
          </div>
          <div className="flex flex-col gap-[7px] text-xs">
            <span className="rounded-lg bg-[var(--storyloop-indigo-soft)] px-2.5 py-2 font-semibold text-[var(--storyloop-ink)]">
              ⊞&nbsp;&nbsp; Story map
            </span>
            <span className="px-2.5 py-2 text-[var(--storyloop-nav-muted)]">⌁&nbsp;&nbsp; Activity</span>
            <span className="px-2.5 py-2 text-[var(--storyloop-nav-muted)]">☷&nbsp;&nbsp; Decisions</span>
          </div>
          <div className="h-px bg-[var(--storyloop-border)]" />
          <div className="flex flex-col gap-2.5">
            <span className="font-caption text-[9px] font-medium tracking-[0.8px] text-[var(--storyloop-muted)]">
              STORY MAPS
            </span>
            <span className="flex items-center gap-2 text-xs text-[var(--storyloop-nav-text)]">
              <span className="size-[7px] rounded-full bg-[var(--storyloop-indigo)]" />
              v3 · live map
            </span>
            <span className="flex items-center gap-2 text-xs text-[var(--storyloop-nav-subtle)]">
              <span className="size-[7px] rounded-full bg-[var(--storyloop-offline)]" />
              9 stories
            </span>
          </div>
        </aside>

        <div className="flex min-w-0 flex-col bg-[var(--storyloop-canvas)]">
          <div className="flex h-[58px] shrink-0 items-center justify-between border-b border-[var(--storyloop-canvas-border)] px-4 py-2.5">
            <div>
              <div className="font-caption text-[9px] font-semibold tracking-[0.7px] text-[var(--storyloop-canvas-muted)]">
                PRODUCT / APPLIFICATION.NET
              </div>
              <div className="text-[19px] font-semibold text-[var(--storyloop-canvas-title)]">v3</div>
            </div>
            <span className="text-[10px] font-semibold text-[var(--storyloop-canvas-action)]">⌘&nbsp; Quick actions</span>
          </div>
          <div className="flex items-center justify-between border-b border-[var(--storyloop-canvas-border)] px-4 py-2.5">
            <span className="text-xs font-semibold text-[var(--storyloop-map-title)]">◇&nbsp; Product story map · 9 stories</span>
            <span className="inline-flex h-6 items-center gap-1 rounded-md border border-[var(--storyloop-card-border)] bg-[var(--storyloop-filter)] px-2 text-[10px] font-semibold text-[var(--storyloop-filter-text)]">
              All
              <ChevronDown aria-hidden="true" size={11} strokeWidth={1.8} />
            </span>
          </div>
          <div className="flex h-[72px] shrink-0 border-b border-[var(--storyloop-row-border)]">
            <div className={`${compact ? "w-20 px-2.5" : "w-28 px-3.5"} shrink-0 bg-[var(--storyloop-row-label)] py-3.5`}>
              <div className="font-caption text-[8px] font-semibold tracking-[0.8px] text-[var(--storyloop-canvas-muted)]">BACKBONE</div>
              <div className="mt-1 text-[10px] text-[var(--storyloop-row-text)]">User goals</div>
            </div>
            <div className={`${compact ? "storyloop-card-grid-compact" : ""} storyloop-card-grid flex-1`}>
              {backboneNotes.map((label) => (
                <div className={`${compact ? "text-[11px] leading-[1.05]" : ""} font-storyloop-title flex min-w-0 items-center overflow-hidden rounded-sm border border-[var(--storyloop-note-blue-border)] bg-[var(--storyloop-note-blue)] px-2 text-[var(--storyloop-note-blue-text)]`} key={label}>{label}</div>
              ))}
            </div>
          </div>
          <div className="flex h-[72px] shrink-0 border-b border-[var(--storyloop-row-border)]">
            <div className={`${compact ? "w-20 px-2.5" : "w-28 px-3.5"} shrink-0 bg-[var(--storyloop-row-label)] py-3.5`}>
              <div className="font-caption text-[8px] font-semibold tracking-[0.8px] text-[var(--storyloop-canvas-muted)]">NARRATIVE</div>
              <div className="mt-1 text-[10px] text-[var(--storyloop-row-text)]">User steps</div>
            </div>
            <div className={`${compact ? "storyloop-card-grid-compact" : ""} storyloop-card-grid storyloop-card-grid-scroll flex-1`}>
              {narrativeNotes.map((label) => (
                <div className={`${compact ? "text-[11px] leading-[1.05]" : ""} font-storyloop-title flex min-w-0 items-center overflow-hidden rounded-sm border border-[var(--storyloop-note-yellow-border)] bg-[var(--storyloop-note-yellow)] px-2 text-[var(--storyloop-note-yellow-text)]`} key={label}>{label}</div>
              ))}
            </div>
          </div>
          <div className="flex min-h-0 flex-1">
            <div className={`${compact ? "w-20 px-2.5" : "w-28 px-3.5"} shrink-0 border-r border-[var(--storyloop-row-border)] bg-[var(--storyloop-row-label)] py-4`}>
              <div className="text-[10px] font-semibold text-[var(--storyloop-now)]">◆&nbsp; Now</div>
              <div className="mt-2 text-[9px] leading-relaxed text-[var(--storyloop-muted)]">9 stories<br />0% complete</div>
            </div>
            <div className={`${compact ? "storyloop-card-grid-compact" : ""} storyloop-card-grid flex-1`}>
              {visibleStories.map(([reference, title]) => (
                <div className={`${compact ? "h-[84px]" : "h-fit"} rounded border border-[var(--storyloop-card-border)] bg-[var(--storyloop-canvas)] px-2 py-1.5 shadow-[0_3px_6px_var(--storyloop-card-shadow)]`} key={reference}>
                  <div className="font-caption text-[7px] font-semibold text-[var(--storyloop-card-id)]">• {reference}</div>
                  <div className="font-storyloop-title mt-1 text-[var(--storyloop-ink)]">{title}</div>
                  <div className="mt-1 text-[7px] text-[var(--storyloop-card-status)]">• Approved</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <aside className="flex flex-col gap-4 bg-[var(--storyloop-panel)] px-[18px] py-[22px] text-[var(--storyloop-text-strong)]">
          <div className="flex items-center justify-between">
            <span className="font-caption text-[10px] font-semibold tracking-[0.8px]">✦&nbsp; CODEX</span>
            <span className="font-caption text-[8px] text-[var(--storyloop-positive)]">WORKING</span>
          </div>
          <div className="rounded-[10px] bg-[var(--storyloop-panel-card)] p-3">
            <div className="font-caption text-[8px] font-semibold text-[var(--storyloop-text-subtle)]">DAVE</div>
            <p className="mt-1.5 text-[11px] leading-[1.4] text-[var(--storyloop-text-secondary)]">Flesh out the story based on our discussion about the homepage image.</p>
          </div>
          <div className="rounded-[10px] border border-[var(--storyloop-border-dark)] bg-[var(--storyloop-shell)] p-3">
            <div className="font-caption text-[9px] text-[var(--storyloop-text-secondary)]">⌘ storyloops.read_map</div>
            <p className="mt-2 text-[10px] leading-[1.4] text-[var(--storyloop-text-subtle)]">Found the current product goal and bounded work.</p>
          </div>
          <div className="rounded-[10px] bg-[var(--storyloop-panel-card)] p-3">
            <div className="font-caption text-[8px] font-semibold text-[var(--storyloop-agent)]">CODEX</div>
            <p className="mt-1.5 text-[11px] leading-[1.4] text-[var(--storyloop-text-secondary)]">I proposed three scoped changes. Nothing will be written until you approve them.</p>
          </div>
          <div className="rounded-[10px] border border-[var(--storyloop-note-yellow-text)] bg-[var(--storyloop-proposal)] p-3">
            <div className="font-caption text-[8px] font-semibold tracking-[0.5px] text-[var(--storyloop-approval-label)]">WAITING FOR HUMAN APPROVAL</div>
            <p className="mt-2 text-[10px] leading-[1.4] text-[var(--storyloop-approval-text)]">Review all three changes on the story map canvas.</p>
          </div>
        </aside>
      </div>
    </div>
  );
}

function MobileStoryMap({ detail = false }: { detail?: boolean }) {
  return (
    <div className={`${detail ? "" : "rounded-[20px]"} overflow-hidden bg-[var(--storyloop-shell)] min-[1024px]:hidden`}>
      <div className="flex h-[42px] items-center justify-between bg-[var(--storyloop-chrome)] px-4">
        <WindowDots small />
        <span className="font-caption text-[8px] font-semibold text-[var(--storyloop-text-dim)]">storyloops / product map</span>
      </div>
      <div className="flex flex-col gap-3.5 px-4 pt-5 pb-[18px]">
        <div className="flex items-center justify-between">
          <span className="font-caption text-[9px] font-bold tracking-[0.8px] text-[var(--loop-cyan)]">APPLIFICATION.NET</span>
          <span className="font-caption text-[8px] font-semibold text-[var(--storyloop-text-subtle)]">9 STORIES</span>
        </div>
        {reviewStories.map((story) => (
          <div className="rounded-xl bg-[var(--storyloop-panel-card)] p-3.5" key={story.title}>
            <div className="text-sm font-semibold text-[var(--storyloop-text-strong)]">{story.title}</div>
            <div className={`font-caption mt-2 text-[8px] font-bold tracking-[0.7px] uppercase ${story.tone}`}>{story.status}</div>
          </div>
        ))}
        <div
          className="rounded-xl bg-[var(--storyloop-panel-card)] p-3.5"
          data-storyloop-mobile-approval
        >
          <div className="font-caption text-[8px] font-bold tracking-[0.7px] text-[var(--storyloop-pink)]">AGENT REQUESTED 3 CHANGES</div>
          <div className="mt-2.5 grid grid-cols-2 gap-2">
            <span
              className="flex h-11 items-center justify-center rounded-full bg-[var(--app-action)] text-[13px] font-bold text-[var(--app-text-on-action)]"
              data-storyloop-review-action
            >
              Review
            </span>
            <span className="flex h-11 items-center justify-center rounded-full bg-[var(--storyloop-shell)] text-[13px] font-bold text-[var(--storyloop-text-secondary)]">Reject</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function OwnershipStrip({ labels }: { labels: string[] }) {
  const icons = [CodeXml, CloudUpload, Bot];

  return (
    <ul className="grid gap-2 border-t border-[#334155] bg-[#111827] px-[18px] py-3 sm:grid-cols-3 min-[1024px]:h-12 min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-0 min-[1024px]:py-0">
      {labels.map((label, index) => {
        const Icon = icons[index] ?? CodeXml;

        return (
        <li
          className="font-caption flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.5px] text-[#cbd5e1] min-[1024px]:justify-start"
          key={label}
        >
          <Icon aria-hidden="true" className="text-[#7dd3fc]" size={14} strokeWidth={1.8} />
          {label}
        </li>
        );
      })}
    </ul>
  );
}

export function StoryLoopsProductMap({
  compact = false,
  ownershipLabels,
}: {
  compact?: boolean;
  ownershipLabels?: string[];
}) {
  const detail = Boolean(ownershipLabels?.length);

  return (
    <figure className="w-full">
      <div aria-hidden="true">
        {detail && ownershipLabels ? (
          <>
            <div className="hidden overflow-hidden rounded-[18px] border border-[#334155] shadow-[0_16px_40px_var(--storyloop-shadow)] min-[1024px]:block">
              <DesktopStoryMap compact={compact} detail />
              <OwnershipStrip labels={ownershipLabels} />
            </div>
            <div className="overflow-hidden rounded-[20px] min-[1024px]:hidden">
              <MobileStoryMap detail />
              <OwnershipStrip labels={ownershipLabels} />
            </div>
          </>
        ) : (
          <>
            <DesktopStoryMap compact={compact} />
            <MobileStoryMap />
          </>
        )}
      </div>
      <figcaption className="sr-only">
        A StoryLoops product map pairs product work with an agent panel that waits
        for human approval before changing scope.
      </figcaption>
    </figure>
  );
}

export function StoryLoopsShowcase() {
  return (
    <MotionReveal>
      <section className="bg-[var(--app-section)] px-6 py-12 min-[720px]:px-12 min-[1024px]:py-16 min-[1280px]:px-20 min-[1440px]:px-[120px]" id="products">
        <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 min-[720px]:items-center min-[720px]:gap-[18px]">
        <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)] min-[720px]:tracking-[1.1px]">PRODUCT R&amp;D&nbsp; · &nbsp;STORYLOOPS</p>
        <ProductStatus status="In Development" />
        <h2 className="font-heading max-w-[1020px] text-[36px] leading-[1.04] font-medium text-[var(--app-text-primary)] min-[720px]:text-center min-[720px]:text-[44px] min-[720px]:leading-none">A product map that coding agents cannot quietly ignore.</h2>
        <p className="max-w-[760px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[720px]:text-center min-[1024px]:text-[17px]">StoryLoops gives each task product context, then makes scope changes visible for approval before the map changes.</p>

        <div className="min-[720px]:self-center"><Link href="/products/storyloops" className="link-sweep inline-flex min-h-11 items-center self-start text-[15px] font-semibold text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"><span className="link-sweep-label">Explore StoryLoops →</span></Link></div>
        <StoryLoopsProductMap compact />

        <aside className="flex w-full flex-col gap-2 rounded-[14px] bg-[var(--app-muted-section)] p-4 min-[720px]:mt-2 min-[720px]:flex-row min-[720px]:items-center min-[720px]:gap-7 min-[720px]:rounded-2xl min-[720px]:px-[26px] min-[720px]:py-[18px]">
          <h3 className="font-caption shrink-0 text-[11px] font-bold tracking-[0.9px] text-[var(--app-label-text)] min-[720px]:tracking-[1.2px]">USED ON THIS SITE</h3>
          <p className="text-base leading-[1.55] text-[var(--app-text-secondary)]">Codex proposed this work in chat and on the map, then implemented only the approved scope.</p>
        </aside>
        </div>
      </section>
    </MotionReveal>
  );
}
