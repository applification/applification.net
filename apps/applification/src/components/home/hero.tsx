import { heroTopSpacing } from "@/components/page-hero";
import { ExternalLink } from "@/components/external-link";
import { contractPositioning, personalLinkedInUrl } from "@/lib/contract-positioning";
import { buildContactHref, isContactWorkflowAvailable } from "@/lib/contact";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { HeroEntrance, HeroSequenceController } from "./motion";
import { WorkflowBorderBeam } from "./workflow-border-beam";

const contactHref = buildContactHref({ route: "contract" });

const heroFocusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]";

function DownArrowIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[17px] stroke-current"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        d="M12 5v14m0 0 5-5m-5 5-5-5"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.8"
      />
    </svg>
  );
}

function FlowArrow({
  className = "",
  connector,
  direction,
}: {
  className?: string;
  connector?: string;
  direction: "down" | "left" | "right" | "up";
}) {
  const vertical = direction === "down" || direction === "up";
  const path = {
    down: "M9 2v18m-6-6 6 6 6-6",
    left: "M28 9H4m6-6-6 6 6 6",
    right: "M2 9h24m-6-6 6 6-6 6",
    up: "M9 22V4m-6 6 6-6 6 6",
  }[direction];

  return (
    <svg
      aria-hidden="true"
      className={`${vertical ? "h-6 w-[18px]" : "h-[18px] w-[30px] min-[1280px]:h-5 min-[1280px]:w-9"} ${className}`}
      data-motion-connector={connector}
      fill="none"
      viewBox={vertical ? "0 0 18 24" : "0 0 30 18"}
    >
      <path
        d={path}
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25"
      />
    </svg>
  );
}

const loopNodes = [
  {
    id: "human",
    label: "Human",
    detail: "Intent + context",
    border: "border-[var(--loop-yellow)]",
    text: "text-[var(--loop-yellow)]",
    background: "bg-[var(--loop-yellow-bg)]",
  },
  {
    id: "agent",
    label: "Agentic loop",
    detail: "Scope · act · test",
    border: "border-[var(--loop-green)]",
    text: "text-[var(--loop-green)]",
    background: "bg-[var(--loop-green-bg)]",
  },
  {
    id: "approval",
    label: "HITL approval",
    detail: "Human in the loop",
    border: "border-[var(--loop-pink)]",
    text: "text-[var(--loop-pink)]",
    background: "bg-[var(--loop-pink-bg)]",
  },
  {
    id: "outcome",
    label: "Outcome",
    detail: "Shipped + verified",
    border: "border-[var(--loop-cyan)]",
    text: "text-[var(--loop-cyan)]",
    background: "bg-[var(--loop-cyan-bg)]",
  },
];

type BeamEdge = "bottom" | "left" | "right" | "top";

function AgentLoopNode({
  beamFrom,
  beamTo,
  node,
}: {
  beamFrom: BeamEdge;
  beamTo: BeamEdge;
  node: (typeof loopNodes)[number];
}) {
  return (
    <div
      className={`relative flex h-[34px] min-w-0 items-center rounded border px-2 min-[1280px]:h-[42px] min-[1280px]:px-3 ${node.background} ${node.border} ${node.text}`}
      data-motion-node={node.id}
    >
      <WorkflowBorderBeam from={beamFrom} radius={4} to={beamTo} />
      <div className="flex min-w-0 flex-col justify-center">
        <span
          className={`truncate text-[9px] font-bold tracking-[0.6px] uppercase min-[1280px]:text-[11px] min-[1280px]:tracking-[0.75px] ${node.text}`}
        >
          {node.label}
        </span>
        <span className="truncate text-[6.5px] font-medium tracking-[0.35px] text-[var(--loop-muted)] uppercase min-[1280px]:text-[8px] min-[1280px]:tracking-[0.45px]">
          {node.detail}
        </span>
      </div>
    </div>
  );
}

function DesktopAgentLoop() {
  return (
    <div
      aria-hidden="true"
      className="font-caption hidden h-[112px] w-full max-w-[1200px] overflow-hidden rounded-[7px] border border-[var(--hero-border)] bg-[var(--loop-bg)] min-[1060px]:block min-[1280px]:h-[140px]"
      data-motion-sequence="hero-approval"
    >
      <div className="flex h-5 items-center border-b border-[color-mix(in_srgb,var(--app-accent)_35%,transparent)] bg-[var(--loop-header)] px-[10px] min-[1280px]:h-6 min-[1280px]:px-3">
        <div className="flex items-center gap-[5px]">
          <span className="size-1.5 rounded-full bg-[var(--loop-red)] min-[1280px]:size-2" />
          <span className="size-1.5 rounded-full bg-[var(--loop-yellow)] min-[1280px]:size-2" />
          <span className="size-1.5 rounded-full bg-[var(--loop-green)] min-[1280px]:size-2" />
          <span className="ml-1 text-[8px] font-semibold tracking-[0.8px] text-[var(--loop-cyan)] min-[1280px]:text-[10px] min-[1280px]:tracking-[1px]">
            AGENT_LOOP://HITL
          </span>
        </div>
      </div>

      <div className="relative mx-6 h-[92px] pt-[9px] min-[1280px]:mx-[30px] min-[1280px]:h-[116px] min-[1280px]:pt-[14px]">
        <div className="grid grid-cols-[14%_6%_26%_6%_22%_6%_20%] items-center">
          {loopNodes.map((node, index) => (
            <div className="contents" key={node.label}>
              <AgentLoopNode beamFrom="left" beamTo="right" node={node} />
              {index < loopNodes.length - 1 ? (
                <span
                  className={`relative flex items-center justify-center ${index === 2 ? loopNodes[3].text : node.text}`}
                >
                  <FlowArrow
                    connector={
                      index === 0
                        ? "human-agent"
                        : index === 1
                          ? "agent-approval"
                          : "yes"
                    }
                    direction="right"
                  />
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <svg
          aria-hidden="true"
          className="absolute top-[43px] left-[33%] h-[35px] w-[30%] overflow-visible text-[var(--loop-pink)] min-[1280px]:top-[56px] min-[1280px]:h-[45px]"
          data-motion-connector="reject"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 227 35"
        >
          <path
            d="M227 0v31H0V7"
            vectorEffect="non-scaling-stroke"
            data-motion-path-base
            opacity="0.67"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M-8 15 0 7l8 8"
            vectorEffect="non-scaling-stroke"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
          />
        </svg>
        <div className="absolute top-[64px] left-[48%] -translate-x-1/2 flex h-4 w-[120px] items-center justify-center bg-[color-mix(in_srgb,var(--loop-bg)_93%,transparent)] text-[6.5px] font-bold tracking-[0.55px] text-[var(--loop-pink)] uppercase min-[1280px]:top-[91px] min-[1280px]:h-5 min-[1280px]:w-[145px] min-[1280px]:text-[8px] min-[1280px]:tracking-[0.7px]" data-motion-connector="reject" data-motion-label>
          No · revise · run again
        </div>
      </div>
    </div>
  );
}

function TabletAgentLoop() {
  return (
    <div
      aria-hidden="true"
      className="font-caption hidden h-[176px] w-full max-w-[640px] overflow-hidden rounded-[7px] border border-[var(--hero-border)] bg-[var(--loop-bg)] min-[720px]:block min-[1060px]:hidden"
      data-motion-sequence="hero-approval"
    >
      <div className="flex h-5 items-center border-b border-[color-mix(in_srgb,var(--app-accent)_35%,transparent)] bg-[var(--loop-header)] px-[10px]">
        <div className="flex items-center gap-[5px]">
          <span className="size-1.5 rounded-full bg-[var(--loop-red)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-yellow)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-green)]" />
          <span className="ml-1 text-[8px] font-semibold tracking-[0.8px] text-[var(--loop-cyan)]">
            AGENT_LOOP://HITL
          </span>
        </div>
      </div>

      <div className="relative h-[156px] px-4 pt-3">
        <div className="mx-8 grid grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] grid-rows-[34px_24px_34px] items-center">
          <AgentLoopNode beamFrom="left" beamTo="right" node={loopNodes[0]} />
          <span className="flex justify-center text-[var(--loop-yellow)]">
            <FlowArrow connector="human-agent" direction="right" />
          </span>
          <AgentLoopNode beamFrom="left" beamTo="bottom" node={loopNodes[1]} />
          <span className="col-start-3 row-start-2 flex items-center justify-center gap-1">
            <FlowArrow
              className="text-[var(--loop-green)]"
              connector="agent-approval"
              direction="down"
            />
          </span>
          <div className="col-start-1 row-start-3">
            <AgentLoopNode beamFrom="right" beamTo="left" node={loopNodes[3]} />
          </div>
          <span className="relative col-start-2 row-start-3 flex justify-center text-[var(--loop-cyan)]">
            <FlowArrow connector="yes" direction="left" />
          </span>
          <div className="col-start-3 row-start-3">
            <AgentLoopNode beamFrom="top" beamTo="left" node={loopNodes[2]} />
          </div>
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-4 left-4 h-[144px] w-[calc(100%_-_2rem)] overflow-visible text-[var(--loop-pink)]"
          data-motion-connector="reject"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 100 144"
        >
          <path
            d="M74 92V132H99.5V17H96"
            data-motion-path-base
            opacity="0.72"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="M97 11l-1 6 1 6"
            data-motion-path-base
            opacity="0.72"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="absolute right-6 bottom-[8px] bg-[var(--loop-bg)] px-3 text-[6.5px] font-bold tracking-[0.55px] whitespace-nowrap text-[var(--loop-pink)] uppercase" data-motion-connector="reject" data-motion-label>
          No · revise · run again
        </span>
      </div>
    </div>
  );
}

function MobileAgentLoop() {
  return (
    <div
      aria-hidden="true"
      className="font-caption w-full overflow-hidden rounded-[7px] border border-[var(--hero-border)] bg-[var(--loop-bg)] min-[720px]:hidden"
      data-motion-sequence="hero-approval"
    >
      <div className="flex h-5 items-center border-b border-[color-mix(in_srgb,var(--app-accent)_35%,transparent)] bg-[var(--loop-header)] px-[10px]">
        <div className="flex items-center gap-[5px]">
          <span className="size-1.5 rounded-full bg-[var(--loop-red)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-yellow)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-green)]" />
          <span className="ml-1 text-[8px] font-semibold tracking-[0.8px] text-[var(--loop-cyan)]">
            AGENT_LOOP://HITL
          </span>
        </div>
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="relative">
          <div className="mx-9 flex flex-col">
            {loopNodes.map((node, index) => (
              <div className="contents" key={node.label}>
                <AgentLoopNode beamFrom="top" beamTo="bottom" node={node} />
                {index < loopNodes.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`relative flex items-center justify-center gap-1 ${index === 1 ? "h-10" : "h-7"}`}
                  >
                    {index === 1 ? (
                      <FlowArrow
                        className="text-[var(--loop-green)]"
                        connector="agent-approval"
                        direction="down"
                      />
                    ) : (
                      <>
                        <FlowArrow
                          className={
                            index === 2
                              ? "text-[var(--loop-cyan)]"
                              : node.text
                          }
                          connector={index === 0 ? "human-agent" : "yes"}
                          direction="down"
                        />
                      </>
                    )}
                  </span>
                ) : null}
              </div>
            ))}
          </div>
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 h-full w-full overflow-visible text-[var(--loop-pink)]"
            data-motion-connector="reject"
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 100 232"
          >
            <path
              d="M94 153H99V79"
              data-motion-path-base
              opacity="0.72"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="pointer-events-none absolute top-[70px] right-0.75 flex text-[var(--loop-pink)]" data-motion-connector="reject">
            <FlowArrow direction="left" />
          </span>
          <span className="absolute top-[108px] right-7 bg-[var(--loop-bg)] px-2 text-[6.5px] font-bold tracking-[0.55px] whitespace-nowrap text-[var(--loop-pink)] uppercase" data-motion-connector="reject" data-motion-label>
            No · revise · run again
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  const contactAvailable = isContactWorkflowAvailable();
  const contractSummary = [
    ["Availability", contractPositioning.availability],
    ["Working location", contractPositioning.location],
    ["Contract basis", contractPositioning.contractBasis],
  ] as const;

  return (
    <section
      aria-labelledby="hero-heading"
      className={`${heroTopSpacing} bg-linear-to-b from-[var(--hero-bg)] to-[var(--hero-bg-end)] px-6 pb-8 text-[var(--hero-text)] min-[720px]:px-12 min-[720px]:pb-10 min-[1060px]:pb-12 min-[1280px]:px-20 min-[1440px]:px-[120px]`}
      data-hero-surface
    >
      <HeroSequenceController />
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 min-[720px]:gap-7 min-[1060px]:gap-9">
        <HeroEntrance order={0}>
          <div className="font-caption flex flex-col gap-2">
            <p className="flex items-start gap-2.5 text-[11px] leading-[16px] font-bold tracking-[0.7px] text-[var(--hero-text)] uppercase min-[720px]:items-center min-[720px]:text-xs min-[720px]:tracking-[0.9px]">
              <span
                aria-hidden="true"
                className="mt-[5px] size-2 shrink-0 rounded-full bg-[var(--hero-availability)] min-[720px]:mt-0"
              />
              <span>
                Dave Hudson · {contractPositioning.role}
              </span>
            </p>
            <dl
              aria-label="Contract summary"
              className="ml-[18px] flex flex-wrap items-center gap-x-2.5 gap-y-1 text-[11px] leading-[16px] font-semibold tracking-[0.6px] text-[var(--hero-label)] uppercase"
            >
              {contractSummary.map(([label, value], index) => (
                <div
                  className={`items-center gap-2.5 ${index === contractSummary.length - 1 ? "hidden min-[720px]:flex" : "flex"}`}
                  key={label}
                >
                  {index > 0 ? (
                    <span aria-hidden="true" className="text-[var(--hero-text-muted)]">
                      ·
                    </span>
                  ) : null}
                  <dt className="sr-only">{label}</dt>
                  <dd>{value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </HeroEntrance>

        <HeroEntrance order={1}>
          <h1
            className="font-heading max-w-[1080px] text-[clamp(2.75rem,12vw,3.25rem)] leading-[0.98] font-medium tracking-[-0.025em] text-[var(--hero-text)] min-[720px]:text-[64px] min-[720px]:leading-[1] min-[1060px]:text-[78px] min-[1060px]:tracking-[-0.03em] min-[1280px]:text-[84px]"
            id="hero-heading"
          >
            React and Next.js products.
            <br className="hidden min-[720px]:block" /> Production AI that earns its place.
          </h1>
        </HeroEntrance>

        <div className="grid gap-6 min-[1060px]:grid-cols-[minmax(0,660px)_minmax(0,1fr)] min-[1060px]:items-end min-[1060px]:gap-x-16">
          <HeroEntrance className="flex flex-col gap-6" order={2}>
            <p className="max-w-[640px] text-base leading-[1.5] text-[var(--hero-text-secondary)] min-[720px]:text-[19px] min-[720px]:leading-[1.45] min-[1060px]:text-xl">
              I join product teams to build web applications, modernise existing
              frontends and put AI into production. Senior engineering, from the
              first technical decision through to release.
            </p>
            <div className="flex flex-col items-stretch gap-2 min-[560px]:flex-row min-[560px]:flex-wrap min-[560px]:items-center min-[560px]:gap-3">
              {contactAvailable ? (
                <a
                  className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--hero-action)] px-6 text-base font-bold text-[var(--hero-action-text)] transition-[background-color,transform] hover:bg-[var(--hero-action-hover)] active:scale-[0.985] motion-reduce:transform-none min-[720px]:font-semibold ${heroFocusClasses}`}
                  href={contactHref}
                >
                  Discuss a contract
                  <ArrowRight aria-hidden="true" className="size-[17px]" strokeWidth={1.8} />
                </a>
              ) : null}
              <a
                className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-[var(--hero-label)] bg-transparent px-6 text-base font-semibold text-[var(--hero-label)] transition-[background-color,color,transform] hover:bg-[var(--hero-action-secondary-hover)] active:scale-[0.985] motion-reduce:transform-none ${heroFocusClasses}`}
                href="#client-work"
              >
                See client outcomes
                <DownArrowIcon />
              </a>
              <ExternalLink
                className={`link-sweep inline-flex min-h-11 items-center justify-center text-sm text-[var(--hero-text-secondary)] min-[560px]:ml-1 ${heroFocusClasses}`}
                href={personalLinkedInUrl}
              >
                <span className="link-sweep-label">View my LinkedIn profile</span>
              </ExternalLink>
            </div>
          </HeroEntrance>

          <HeroEntrance
            className="border-t border-[var(--hero-border)] pt-5 min-[1060px]:max-w-[400px] min-[1060px]:justify-self-end min-[1060px]:border-t-0 min-[1060px]:border-l min-[1060px]:pt-0 min-[1060px]:pl-6"
            order={3}
          >
            <p className="font-caption text-[11px] leading-[14px] font-bold tracking-[1px] text-[var(--hero-label)] uppercase">
              How I work with AI
            </p>
            <p className="mt-2.5 text-[15px] leading-[1.5] text-[var(--hero-text-secondary)] min-[1060px]:text-base">
              I use agents to shape scope, gather context, implement, test and
              review. The work still ships on evidence and human approval.
            </p>
            <Link
              className={`link-sweep mt-1 inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[var(--hero-text)] ${heroFocusClasses}`}
              href="/about#method"
            >
              <span className="link-sweep-label">See how I work with AI</span>
              <ArrowRight aria-hidden="true" className="size-4" strokeWidth={2} />
            </Link>
          </HeroEntrance>
        </div>

        <div aria-label="How I use AI in delivery" role="group">
          <p className="sr-only">
            The delivery loop starts with human intent and context. An agent works
            within that scope and runs tests. A person reviews the evidence before
            the outcome ships, or sends the work back for another pass.
          </p>
          <DesktopAgentLoop />
          <TabletAgentLoop />
          <MobileAgentLoop />
        </div>
      </div>
    </section>
  );
}
