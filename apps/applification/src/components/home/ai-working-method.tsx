const methodSteps = [
  { number: "01", title: "Intent", owner: "HUMAN", tone: "border-[var(--workflow-human)] text-[var(--workflow-human)]" },
  { number: "02", title: "Context", owner: "TOOLS", tone: "border-[var(--workflow-agent)] text-[var(--workflow-agent)]" },
  { number: "03", title: "Build", owner: "AGENT", tone: "border-[var(--workflow-agent)] text-[var(--workflow-agent)]" },
  { number: "04", title: "Evidence", owner: "CHECKS", tone: "border-[var(--workflow-checks)] text-[var(--workflow-checks)]" },
  { number: "05", title: "Approve", owner: "HUMAN", tone: "border-[var(--workflow-human)] text-[var(--workflow-human)]" },
];

const workingSetup = [
  "Planning and design tools connected through MCP",
  "Agents get context from the tools the team already uses",
  "Tests, QA and verification before approval",
];

function WorkflowDiagram() {
  return (
    <div
      className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4"
      data-motion-sequence="delivery-workflow"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="font-caption text-[10px] font-bold tracking-[0.7px] text-[var(--app-label-text)]">
            DELIVERY WORKFLOW
          </p>
          <p className="mt-1 text-xs text-[var(--app-text-secondary)]">
            Checks and approval can send the slice back.
          </p>
        </div>
        <span className="font-caption shrink-0 rounded-full bg-[var(--app-label)] px-2.5 py-1.5 text-[8px] font-bold text-[var(--app-label-text)]">
          2 FEEDBACK LOOPS
        </span>
      </div>

      <ol className="mt-5 flex flex-col gap-7 min-[1024px]:grid min-[1024px]:grid-cols-5 min-[1024px]:gap-[22px]">
        {methodSteps.map((step, index) => (
          <li
            className={`relative flex min-h-[54px] items-center gap-3 rounded-xl border bg-[var(--workflow-step)] px-3 py-2 min-[1024px]:min-h-[138px] min-[1024px]:flex-col min-[1024px]:justify-center min-[1024px]:gap-2 min-[1024px]:text-center ${step.tone}`}
            data-motion-step={step.title.toLowerCase()}
            key={step.title}
          >
            <span className="font-caption text-[9px] font-bold">
              {step.number}
            </span>
            <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[var(--app-card)] text-sm min-[1024px]:size-8">
              {index === 0 ? "◎" : index === 1 ? "◇" : index === 2 ? "⌘" : index === 3 ? "✓" : "●"}
            </span>
            <span className="min-w-0 text-[var(--app-text-primary)]">
              <span className="block text-[13px] font-semibold min-[1024px]:text-sm">
                {step.title}
              </span>
              <span className="font-caption mt-0.5 block text-[8px] font-semibold tracking-[0.5px] text-[var(--app-text-muted)]">
                {step.owner}
              </span>
            </span>
            {index < methodSteps.length - 1 ? (
              <span
                aria-hidden="true"
                className="pointer-events-none absolute -bottom-7 left-1/2 flex h-7 w-6 -translate-x-1/2 items-center justify-center text-[var(--workflow-agent)] min-[1024px]:top-1/2 min-[1024px]:-right-[22px] min-[1024px]:bottom-auto min-[1024px]:left-auto min-[1024px]:h-6 min-[1024px]:w-[22px] min-[1024px]:-translate-y-1/2 min-[1024px]:translate-x-0"
              >
                <svg
                  className="h-6 w-[18px] min-[1024px]:hidden"
                  fill="none"
                  viewBox="0 0 18 24"
                >
                  <path
                    d="M9 2v18m-6-6 6 6 6-6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.25"
                  />
                </svg>
                <svg
                  className="hidden h-[18px] w-[22px] min-[1024px]:block"
                  fill="none"
                  viewBox="0 0 22 18"
                >
                  <path
                    d="M2 9h16m-5-6 6 6-6 6"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.25"
                  />
                </svg>
              </span>
            ) : null}
          </li>
        ))}
      </ol>

      <ul className="mt-5 grid gap-2 min-[1024px]:grid-cols-2">
        <li
          className="rounded-xl border border-[var(--workflow-checks)] bg-[var(--workflow-loop)] p-3"
          data-motion-loop="checks-to-build"
        >
          <p className="font-caption text-[8px] font-bold tracking-[0.6px] text-[var(--workflow-checks)]">
            CHECKS → BUILD
          </p>
          <p className="mt-1.5 text-xs leading-[1.45] text-[var(--app-text-secondary)]">
            Failed tests, types, accessibility checks or QA send the slice back
            for another build pass.
          </p>
        </li>
        <li
          className="rounded-xl border border-[var(--workflow-human)] bg-[var(--workflow-loop)] p-3"
          data-motion-loop="approval-to-context"
        >
          <p className="font-caption text-[8px] font-bold tracking-[0.6px] text-[var(--workflow-human)]">
            APPROVAL → CONTEXT
          </p>
          <p className="mt-1.5 text-xs leading-[1.45] text-[var(--app-text-secondary)]">
            A human change to intent or scope returns the work to Context before
            the agent continues.
          </p>
        </li>
      </ul>
    </div>
  );
}

export function AiWorkingMethod() {
  return (
    <section
      aria-labelledby="ai-working-method-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-12 min-[1024px]:py-[84px] min-[1280px]:px-20 min-[1440px]:px-[120px]"
      id="method"
    >
      <div className="mx-auto grid w-full max-w-[1200px] gap-6 min-[1280px]:grid-cols-[minmax(0,500px)_minmax(0,540px)] min-[1280px]:items-center min-[1280px]:justify-between min-[1280px]:gap-[60px]">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)]">
            HOW I WORK WITH AI
          </p>
          <h2
            className="font-heading mt-3 max-w-[500px] text-[38px] leading-[1.06] font-medium text-[var(--app-text-primary)] min-[1024px]:mt-[22px] min-[1024px]:text-[48px]"
            id="ai-working-method-heading"
          >
            AI is in the workflow, not the sales pitch.
          </h2>
          <p className="mt-4 max-w-[500px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:mt-[22px] min-[1024px]:text-lg">
            I use Claude Code and Codex every day. Each task starts with agreed
            scope and product context, then ends with tests, QA and explicit
            human approval.
          </p>

          <ul className="mt-[22px] flex flex-col gap-2 rounded-[14px] bg-[var(--app-card)] p-4 min-[1024px]:gap-2.5 min-[1024px]:rounded-none min-[1024px]:bg-transparent min-[1024px]:p-0">
            {workingSetup.map((item) => (
              <li className="flex items-center gap-3 text-sm text-[var(--app-text-primary)] min-[1024px]:text-[15px]" key={item}>
                <span
                  aria-hidden="true"
                  className="font-caption flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[var(--app-control)] text-[var(--app-label-text)]"
                >
                  ✓
                </span>
                {item}
              </li>
            ))}
          </ul>
        </div>

        <WorkflowDiagram />
      </div>
    </section>
  );
}
