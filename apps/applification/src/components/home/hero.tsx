import { contractPositioning } from "@/lib/contract-positioning";
import { buildContactHref, isContactWorkflowAvailable } from "@/lib/contact";
import { HeroEntrance, HeroSequenceController } from "./motion";
import { WorkflowBorderBeam } from "./workflow-border-beam";

const contactHref = buildContactHref({ route: "contract" });

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

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
      className="font-caption order-4 hidden h-[112px] w-full max-w-[820px] overflow-hidden rounded-[7px] border border-[var(--app-border)] bg-[var(--loop-bg)] min-[1060px]:block min-[1280px]:h-[140px] min-[1280px]:max-w-[980px]"
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

      <div className="relative h-[92px] px-6 pt-[9px] min-[1280px]:h-[116px] min-[1280px]:px-[30px] min-[1280px]:pt-[14px]">
        <div className="grid grid-cols-[110px_42px_198px_42px_160px_42px_178px] items-center min-[1280px]:grid-cols-[130px_50px_236px_50px_192px_50px_212px]">
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
          className="absolute top-[43px] left-[270px] h-[35px] w-[227px] text-[var(--loop-pink)] min-[1280px]:top-[55px] min-[1280px]:left-[315px] min-[1280px]:h-[45px] min-[1280px]:w-[278px]"
          data-motion-connector="reject"
          fill="none"
          viewBox="0 0 227 35"
        >
          <path
            d="M226 0v31H13V7"
            data-motion-path-base
            opacity="0.67"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M1 19 13 7l12 12"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
          />
        </svg>
        <div className="absolute top-[64px] left-[326px] flex h-4 w-[120px] items-center justify-center bg-[color-mix(in_srgb,var(--loop-bg)_93%,transparent)] text-[6.5px] font-bold tracking-[0.55px] text-[var(--loop-pink)] uppercase min-[1280px]:top-[91px] min-[1280px]:left-[393px] min-[1280px]:h-5 min-[1280px]:w-[145px] min-[1280px]:text-[8px] min-[1280px]:tracking-[0.7px]" data-motion-connector="reject" data-motion-label>
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
      className="font-caption order-4 hidden h-[176px] w-full max-w-[640px] overflow-hidden rounded-[7px] border border-[var(--app-border)] bg-[var(--loop-bg)] min-[720px]:block min-[1060px]:hidden"
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
      className="font-caption order-5 w-full overflow-hidden rounded-[7px] border border-[var(--app-border)] bg-[var(--loop-bg)] min-[720px]:hidden"
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
    ["Core stack", contractPositioning.stack],
    ["Working location", contractPositioning.location],
    ["Team fit", contractPositioning.teamFit],
  ] as const;

  return (
    <section className="flex flex-col gap-[18px] bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 pt-6 pb-9 min-[720px]:min-h-[620px] min-[720px]:items-center min-[720px]:gap-[22px] min-[720px]:px-12 min-[720px]:pt-12 min-[720px]:pb-10 min-[1060px]:min-h-[606px] min-[1060px]:px-20 min-[1060px]:pt-14 min-[1060px]:pb-11">
      <HeroSequenceController />
      <HeroEntrance className="order-1 w-full min-[720px]:flex min-[720px]:justify-center" order={0}>
        <div className="font-caption flex flex-col gap-[7px] min-[720px]:items-center">
          <div className="flex items-center gap-2">
            <span className="size-2 shrink-0 rounded-full bg-[var(--loop-yellow-strong)]" />
            <span className="text-[10px] font-bold tracking-[0.6px] text-[var(--app-text-primary)] uppercase min-[720px]:text-xs min-[720px]:font-semibold min-[720px]:tracking-[0.8px]">
              Dave Hudson · {contractPositioning.role}
            </span>
          </div>
          <dl
            aria-label="Contract summary"
            className="ml-4 flex max-w-[540px] flex-wrap items-center gap-x-2 gap-y-1 text-[9px] font-semibold tracking-[0.45px] text-[var(--app-action)] uppercase min-[720px]:ml-0 min-[720px]:justify-center min-[720px]:text-[10px] min-[720px]:tracking-[0.65px] min-[720px]:text-[var(--app-text-primary)]"
          >
            {contractSummary.map(([label, value], index) => (
              <div className="flex items-center gap-2" key={label}>
                {index > 0 ? (
                  <span aria-hidden="true" className="text-[var(--app-text-muted)]">
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

      <HeroEntrance className="order-2" order={1}>
        <h1 className="font-heading max-w-[1020px] text-[clamp(2.5rem,12vw,3rem)] leading-[0.98] font-medium tracking-[-0.025em] text-[var(--app-text-primary)] min-[720px]:text-center min-[720px]:text-[64px] min-[720px]:leading-[1.01] min-[1060px]:text-[70px]">
          Products and AI workflows, built around human judgement.
        </h1>
      </HeroEntrance>

      <HeroEntrance className="order-3" order={2}>
        <p className="max-w-[820px] text-base leading-[1.5] text-[var(--app-text-secondary)] min-[720px]:text-center min-[720px]:text-[19px] min-[720px]:leading-[1.45] min-[1060px]:text-xl">
          <span className="min-[720px]:hidden">
            I join small teams to shape ideas and ship production React and
            TypeScript. Agents do the repetitive work; scope, tests and approval
            keep people in control.
          </span>
          <span className="hidden min-[720px]:inline">
            I join small teams to shape early ideas and ship production React and
            TypeScript. Agents handle the repetitive work; agreed scope, tests and
            approval keep the team in control.
          </span>
        </p>
      </HeroEntrance>

      <p className="sr-only">
        The delivery loop starts with human intent and context. An agent works
        within that scope and runs tests. A person reviews the evidence before
        the outcome ships, or sends the work back for another pass.
      </p>
      <DesktopAgentLoop />
      <TabletAgentLoop />

      <HeroEntrance className="order-4 flex w-full flex-col items-stretch gap-2 min-[560px]:flex-row min-[560px]:items-center min-[560px]:gap-3 min-[720px]:order-5 min-[720px]:w-auto" order={4}>
        {contactAvailable ? <a
          className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-[24px] text-base font-bold text-[var(--app-text-on-action)] transition-[background-color,transform] hover:bg-[var(--app-action-hover)] active:scale-[0.985] motion-reduce:transform-none min-[720px]:font-semibold ${focusClasses}`}
          href={contactHref}
        >
          Discuss a contract
          <DownArrowIcon />
        </a> : null}
        <a
          className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-[var(--app-sky-text)] bg-transparent px-6 text-base font-semibold text-[var(--app-sky-text)] transition-[background-color,color,transform] hover:bg-[var(--app-selected)] active:scale-[0.985] motion-reduce:transform-none ${focusClasses}`}
          href="#client-work"
        >
          See client outcomes
          <DownArrowIcon />
        </a>
      </HeroEntrance>

      <MobileAgentLoop />
    </section>
  );
}
