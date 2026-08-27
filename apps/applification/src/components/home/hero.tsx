const contactHref = "#contact";

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

function ArrowUpRightIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[17px] stroke-current"
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

function FlowArrow({
  className = "",
  direction,
}: {
  className?: string;
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
      className={`${vertical ? "h-6 w-[18px]" : "h-[18px] w-[30px]"} ${className}`}
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
    label: "Human",
    detail: "Intent + context",
    border: "border-[var(--loop-yellow)]",
    text: "text-[var(--loop-yellow)]",
    background: "bg-[var(--loop-yellow-bg)]",
  },
  {
    label: "Agentic loop",
    detail: "Scope · act · test",
    border: "border-[var(--loop-green)]",
    text: "text-[var(--loop-green)]",
    background: "bg-[var(--loop-green-bg)]",
  },
  {
    label: "HITL approval",
    detail: "Human in the loop",
    border: "border-[var(--loop-pink)]",
    text: "text-[var(--loop-pink)]",
    background: "bg-[var(--loop-pink-bg)]",
  },
  {
    label: "Outcome",
    detail: "Shipped + verified",
    border: "border-[var(--loop-cyan)]",
    text: "text-[var(--loop-cyan)]",
    background: "bg-[var(--loop-cyan-bg)]",
  },
];

function AgentLoopNode({ node }: { node: (typeof loopNodes)[number] }) {
  return (
    <div
      className={`flex h-[34px] min-w-0 items-center rounded border px-2 ${node.background} ${node.border}`}
    >
      <div className="flex min-w-0 flex-col justify-center">
        <span
          className={`truncate text-[9px] font-bold tracking-[0.6px] uppercase ${node.text}`}
        >
          {node.label}
        </span>
        <span className="truncate text-[6.5px] font-medium tracking-[0.35px] text-[var(--loop-muted)] uppercase">
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
      className="font-caption order-4 hidden h-[94px] w-full max-w-[820px] overflow-hidden rounded-[7px] border border-[var(--app-accent)] bg-[var(--loop-bg)] shadow-[0_0_18px_color-mix(in_srgb,var(--app-accent)_20%,transparent)] min-[1060px]:block"
    >
      <div className="flex h-5 items-center justify-between border-b border-[color-mix(in_srgb,var(--app-accent)_35%,transparent)] bg-[var(--loop-header)] px-[10px]">
        <div className="flex items-center gap-[5px]">
          <span className="size-1.5 rounded-full bg-[var(--loop-red)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-yellow)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-green)]" />
          <span className="ml-1 text-[8px] font-semibold tracking-[0.8px] text-[var(--loop-cyan)]">
            AGENT_LOOP://HITL
          </span>
        </div>
        <span className="flex items-center gap-[5px] text-[8px] font-bold tracking-[1px] text-[var(--loop-green)]">
          <span className="size-[5px] rounded-full bg-[var(--loop-green)]" />
          LIVE
        </span>
      </div>

      <div className="relative h-[74px] px-6 pt-[9px]">
        <div className="grid grid-cols-[110px_42px_198px_42px_160px_42px_178px] items-center">
          {loopNodes.map((node, index) => (
            <div className="contents" key={node.label}>
              <AgentLoopNode node={node} />
              {index < loopNodes.length - 1 ? (
                <span
                  className={`relative flex items-center justify-center ${index === 2 ? loopNodes[3].text : node.text}`}
                >
                  {index === 2 ? (
                    <span className="absolute -top-[7px] text-[6.5px] font-bold tracking-[0.8px]">
                      YES
                    </span>
                  ) : null}
                  <FlowArrow direction="right" />
                </span>
              ) : null}
            </div>
          ))}
        </div>
        <svg
          aria-hidden="true"
          className="absolute top-[43px] left-[270px] h-[17px] w-[227px] text-[var(--loop-pink)]"
          fill="none"
          viewBox="0 0 227 17"
        >
          <path
            d="M226 0v14H5.5V1"
            opacity="0.67"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M0.5 6 5.5 1l5 5"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
        <div className="absolute top-[47px] left-[326px] flex h-4 w-[120px] items-center justify-center bg-[color-mix(in_srgb,var(--loop-bg)_93%,transparent)] text-[6.5px] font-bold tracking-[0.55px] text-[var(--loop-pink)] uppercase">
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
      className="font-caption order-4 hidden h-[176px] w-full max-w-[640px] overflow-hidden rounded-[7px] border border-[var(--app-accent)] bg-[var(--loop-bg)] shadow-[0_0_18px_color-mix(in_srgb,var(--app-accent)_20%,transparent)] min-[821px]:block min-[1060px]:hidden"
    >
      <div className="flex h-5 items-center justify-between border-b border-[color-mix(in_srgb,var(--app-accent)_35%,transparent)] bg-[var(--loop-header)] px-[10px]">
        <div className="flex items-center gap-[5px]">
          <span className="size-1.5 rounded-full bg-[var(--loop-red)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-yellow)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-green)]" />
          <span className="ml-1 text-[8px] font-semibold tracking-[0.8px] text-[var(--loop-cyan)]">
            AGENT_LOOP://HITL
          </span>
        </div>
        <span className="flex items-center gap-[5px] text-[8px] font-bold tracking-[1px] text-[var(--loop-green)]">
          <span className="size-[5px] rounded-full bg-[var(--loop-green)]" />
          LIVE
        </span>
      </div>

      <div className="relative h-[156px] px-4 pt-3">
        <div className="grid grid-cols-[minmax(0,1fr)_40px_minmax(0,1fr)] grid-rows-[34px_24px_34px] items-center">
          <AgentLoopNode node={loopNodes[0]} />
          <span className="flex justify-center text-[var(--loop-yellow)]">
            <FlowArrow direction="right" />
          </span>
          <AgentLoopNode node={loopNodes[1]} />
          <span className="col-start-3 row-start-2 flex items-center justify-center gap-1">
            <FlowArrow
              className="text-[var(--loop-green)]"
              direction="down"
            />
          </span>
          <div className="col-start-1 row-start-3">
            <AgentLoopNode node={loopNodes[3]} />
          </div>
          <span className="relative col-start-2 row-start-3 flex justify-center text-[var(--loop-cyan)]">
            <span className="absolute -top-[7px] text-[6.5px] font-bold tracking-[0.8px]">
              YES
            </span>
            <FlowArrow direction="left" />
          </span>
          <div className="col-start-3 row-start-3">
            <AgentLoopNode node={loopNodes[2]} />
          </div>
        </div>
        <svg
          aria-hidden="true"
          className="pointer-events-none absolute top-3 right-4 left-4 h-[144px] w-[calc(100%_-_2rem)] overflow-visible text-[var(--loop-pink)]"
          fill="none"
          preserveAspectRatio="none"
          viewBox="0 0 100 144"
        >
          <path
            d="M76 92V132H100V17H96"
            opacity="0.72"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
            vectorEffect="non-scaling-stroke"
          />
          <path
            d="m99 13-4 4 4 4"
            stroke="currentColor"
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.25"
            vectorEffect="non-scaling-stroke"
          />
        </svg>
        <span className="absolute right-6 bottom-[8px] bg-[var(--loop-bg)] px-3 text-[6.5px] font-bold tracking-[0.55px] whitespace-nowrap text-[var(--loop-pink)] uppercase">
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
      className="font-caption order-5 w-full overflow-hidden rounded-[7px] border border-[var(--app-accent)] bg-[var(--loop-bg)] shadow-[0_0_18px_color-mix(in_srgb,var(--app-accent)_20%,transparent)] min-[821px]:hidden"
    >
      <div className="flex h-5 items-center justify-between border-b border-[color-mix(in_srgb,var(--app-accent)_35%,transparent)] bg-[var(--loop-header)] px-[10px]">
        <div className="flex items-center gap-[5px]">
          <span className="size-1.5 rounded-full bg-[var(--loop-red)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-yellow)]" />
          <span className="size-1.5 rounded-full bg-[var(--loop-green)]" />
          <span className="ml-1 text-[8px] font-semibold tracking-[0.8px] text-[var(--loop-cyan)]">
            AGENT_LOOP://HITL
          </span>
        </div>
        <span className="flex items-center gap-[5px] text-[8px] font-bold tracking-[1px] text-[var(--loop-green)]">
          <span className="size-[5px] rounded-full bg-[var(--loop-green)]" />
          LIVE
        </span>
      </div>

      <div className="px-4 pt-3 pb-4">
        <div className="relative">
          <div className="mx-2 flex flex-col">
            {loopNodes.map((node, index) => (
              <div className="contents" key={node.label}>
                <AgentLoopNode node={node} />
                {index < loopNodes.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className={`relative flex items-center justify-center gap-1 ${index === 1 ? "h-10" : "h-7"}`}
                  >
                    {index === 1 ? (
                      <FlowArrow
                        className="text-[var(--loop-green)]"
                        direction="down"
                      />
                    ) : (
                      <>
                        {index === 2 ? (
                          <span className="absolute left-1/2 ml-4 text-[6.5px] font-bold tracking-[0.8px] text-[var(--loop-cyan)]">
                            YES
                          </span>
                        ) : null}
                        <FlowArrow
                          className={
                            index === 2
                              ? "text-[var(--loop-cyan)]"
                              : node.text
                          }
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
            fill="none"
            preserveAspectRatio="none"
            viewBox="0 0 100 232"
          >
            <path
              d="M98 153H100V79H96"
              opacity="0.72"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
              vectorEffect="non-scaling-stroke"
            />
            <path
              d="m99 75-4 4 4 4"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.25"
              vectorEffect="non-scaling-stroke"
            />
          </svg>
          <span className="absolute top-[108px] right-7 bg-[var(--loop-bg)] px-2 text-[6.5px] font-bold tracking-[0.55px] whitespace-nowrap text-[var(--loop-pink)] uppercase">
            No · revise · run again
          </span>
        </div>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="flex min-h-[706px] flex-col gap-[22px] bg-linear-to-b from-[var(--app-bg)] to-[var(--app-bg-end)] px-6 pt-12 pb-11 min-[821px]:min-h-[593px] min-[821px]:items-center min-[821px]:gap-6 min-[821px]:px-[120px] min-[821px]:pt-14 min-[821px]:pb-11">
      <div className="order-1 w-full min-[821px]:flex min-[821px]:justify-center">
        <div className="font-caption flex flex-col gap-[5px] min-[821px]:flex-row min-[821px]:items-center min-[821px]:gap-[10px]">
          <div className="flex items-center gap-2 min-[821px]:contents">
            <span className="size-2 shrink-0 rounded-full bg-[var(--loop-yellow-strong)]" />
            <span className="text-[10px] font-bold tracking-[0.6px] text-[var(--app-text-primary)] uppercase min-[821px]:text-xs min-[821px]:font-semibold min-[821px]:tracking-[0.8px]">
              Contract AI product engineer
            </span>
          </div>
          <span className="ml-4 text-[9px] font-semibold tracking-[0.45px] text-[var(--app-action)] uppercase min-[821px]:ml-0 min-[821px]:text-xs min-[821px]:tracking-[0.8px] min-[821px]:text-[var(--app-text-primary)]">
            <span className="hidden min-[821px]:inline">·&nbsp; </span>
            React + TypeScript
          </span>
        </div>
      </div>

      <h1 className="font-heading order-2 max-w-[874px] text-[48px] leading-none font-medium tracking-[-0.025em] text-[var(--app-text-primary)] min-[821px]:text-center min-[821px]:text-[76px] min-[821px]:leading-[1.02]">
        Products &amp; AI workflows, built with people in control.
      </h1>

      <p className="order-3 max-w-[820px] text-[17px] leading-[1.52] text-[var(--app-text-secondary)] min-[821px]:text-center min-[821px]:text-[21px] min-[821px]:leading-[1.45]">
        I help teams turn early ideas into production software with React and
        TypeScript. Agents speed up the work; clear scope, tests and approval
        points keep people in charge.
      </p>

      <p className="sr-only">
        The delivery loop starts with human intent and context. An agent works
        within that scope and runs tests. A person reviews the evidence before
        the outcome ships, or sends the work back for another pass.
      </p>
      <DesktopAgentLoop />
      <TabletAgentLoop />

      <div className="order-4 grid w-full gap-3 min-[640px]:grid-cols-2 min-[821px]:order-5 min-[821px]:flex min-[821px]:w-auto min-[821px]:items-center">
        <a
          className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-[22px] text-[15px] font-bold text-[var(--app-text-on-action)] transition-colors hover:bg-[var(--app-action-hover)] min-[821px]:font-semibold ${focusClasses}`}
          href={contactHref}
        >
          Discuss your project
          <DownArrowIcon />
        </a>
        <a
          className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-control)] px-[22px] text-[15px] font-bold text-[var(--app-text-primary)] transition-colors hover:border-[var(--app-accent)] min-[821px]:font-semibold ${focusClasses}`}
          href="#client-work"
        >
          See selected work
          <ArrowUpRightIcon />
        </a>
      </div>

      <MobileAgentLoop />
    </section>
  );
}
