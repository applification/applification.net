import type { LucideIcon } from "lucide-react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpenText,
  Crosshair,
  Database,
  RotateCcw,
  ShieldCheck,
  SquareTerminal,
  UserCheck,
  Waypoints,
} from "lucide-react";
import { WorkflowSequenceController } from "./motion";
import { WorkflowBorderBeam } from "./workflow-border-beam";

type WorkflowStep = {
  number: string;
  title: string;
  owner: string;
  Icon: LucideIcon;
  desktopTone: string;
  desktopIcon: string;
  mobileTone: string;
  mobileBorder: string;
  mobileIcon: string;
};

const workflowSteps: WorkflowStep[] = [
  {
    number: "01",
    title: "Intent",
    owner: "HUMAN",
    Icon: Crosshair,
    desktopTone: "text-[var(--workflow-human)]",
    desktopIcon: "bg-[var(--workflow-human-soft)]",
    mobileTone: "text-[var(--workflow-mobile-human)]",
    mobileBorder: "border-[var(--workflow-mobile-human-border)]",
    mobileIcon: "bg-[var(--workflow-mobile-human-soft)]",
  },
  {
    number: "02",
    title: "Context",
    owner: "TOOLS",
    Icon: Database,
    desktopTone: "text-[var(--workflow-agent)]",
    desktopIcon: "bg-[var(--workflow-agent-soft)]",
    mobileTone: "text-[var(--workflow-mobile-agent)]",
    mobileBorder: "border-[var(--workflow-mobile-agent-border)]",
    mobileIcon: "bg-[var(--workflow-mobile-agent-soft)]",
  },
  {
    number: "03",
    title: "Build",
    owner: "AGENT",
    Icon: SquareTerminal,
    desktopTone: "text-[var(--workflow-agent)]",
    desktopIcon: "bg-[var(--workflow-agent-soft)]",
    mobileTone: "text-[var(--workflow-mobile-agent)]",
    mobileBorder: "border-[var(--workflow-mobile-agent-border)]",
    mobileIcon: "bg-[var(--workflow-mobile-agent-soft)]",
  },
  {
    number: "04",
    title: "Evidence",
    owner: "CHECKS",
    Icon: ShieldCheck,
    desktopTone: "text-[var(--workflow-checks)]",
    desktopIcon: "bg-[var(--workflow-checks-soft)]",
    mobileTone: "text-[var(--workflow-mobile-checks)]",
    mobileBorder: "border-[var(--workflow-mobile-checks-border)]",
    mobileIcon: "bg-[var(--workflow-mobile-checks-soft)]",
  },
  {
    number: "05",
    title: "Approve",
    owner: "HUMAN",
    Icon: UserCheck,
    desktopTone: "text-[var(--workflow-human)]",
    desktopIcon: "bg-[var(--workflow-human-soft)]",
    mobileTone: "text-[var(--workflow-mobile-human)]",
    mobileBorder: "border-[var(--workflow-mobile-human-border)]",
    mobileIcon: "bg-[var(--workflow-mobile-human-soft)]",
  },
];

const workingSetup = [
  {
    text: "Planning and design tools connected through MCP",
    Icon: Waypoints,
  },
  {
    text: "Agents get context from the tools the team already uses",
    Icon: BookOpenText,
  },
  {
    text: "Tests, QA and verification before approval",
    Icon: ShieldCheck,
  },
];

function DesktopWorkflowStep({ step }: { step: WorkflowStep }) {
  const { Icon } = step;

  return (
    <li
      className={`relative z-10 flex h-[138px] w-[84px] flex-col items-center gap-[7px] rounded-xl border border-[var(--app-border)] bg-[var(--workflow-node)] px-2 py-2.5 text-center ${step.desktopTone}`}
      data-motion-node={step.title.toLowerCase()}
      data-motion-step={step.title.toLowerCase()}
    >
      <WorkflowBorderBeam from="left" radius={12} to="right" />
      <span className={`font-caption text-[9px] leading-[11px] font-bold tracking-[0.6px] ${step.desktopTone}`}>
        {step.number}
      </span>
      <span className={`flex size-8 shrink-0 items-center justify-center rounded-[9px] ${step.desktopIcon} ${step.desktopTone}`}>
        <Icon aria-hidden="true" className="size-4" strokeWidth={2} />
      </span>
      <span className="text-xs leading-[18px] font-[650] text-[var(--app-text-primary)]">
        {step.title}
      </span>
      <span className="font-caption text-[7px] leading-[10px] font-semibold tracking-[0.5px] text-[var(--workflow-owner)]">
        {step.owner}
      </span>
    </li>
  );
}

function MobileWorkflowStep({ step }: { step: WorkflowStep }) {
  const { Icon } = step;

  return (
    <li
      className={`relative z-10 flex h-[54px] items-center gap-2.5 rounded-[11px] border bg-[var(--app-muted-section)] px-2.5 py-2 ${step.mobileBorder} ${step.mobileTone}`}
      data-motion-node={step.title.toLowerCase()}
      data-motion-step={step.title.toLowerCase()}
    >
      <WorkflowBorderBeam from="top" radius={11} to="bottom" />
      <span className={`font-caption text-[9px] leading-[11px] font-bold ${step.mobileTone}`}>
        {step.number}
      </span>
      <span className={`flex size-[30px] shrink-0 items-center justify-center rounded-lg ${step.mobileIcon} ${step.mobileTone}`}>
        <Icon aria-hidden="true" className="size-[15px]" strokeWidth={2} />
      </span>
      <span className="flex min-w-0 flex-1 flex-col gap-0.5">
        <span className="text-[13px] leading-4 font-[650] text-[var(--app-text-primary)]">
          {step.title}
        </span>
        <span className="font-caption text-[8px] leading-[10px] font-semibold tracking-[0.5px] text-[var(--workflow-owner)]">
          {step.owner}
        </span>
      </span>
    </li>
  );
}

function DesktopWorkflowDiagram() {
  return (
    <div
      className="hidden h-[386px] w-[540px] flex-col justify-between rounded-[20px] border border-[var(--app-border)] bg-[var(--app-card)] p-4 min-[768px]:flex"
      data-motion-sequence="delivery-workflow"
      id="workflow-diagram-desktop"
    >
      <div className="flex h-8 items-center justify-between">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              className="size-[7px] rounded-full bg-[var(--workflow-live)] shadow-[0_0_8px_var(--workflow-live-glow)]"
              data-motion-live
            />
            <p className="font-caption text-[11px] leading-[13px] font-[650] tracking-[0.8px] text-[var(--workflow-heading)]">
              DELIVERY WORKFLOW
            </p>
          </div>
          <p className="text-[11px] leading-[15px] text-[var(--app-text-secondary)]">
            Checks and approval can send the slice back.
          </p>
        </div>
        <span className="font-caption rounded-full bg-[var(--workflow-badge)] px-[9px] py-1.5 text-[9px] leading-3 font-semibold text-[var(--workflow-badge-text)]">
          2 FEEDBACK LOOPS
        </span>
      </div>

      <div className="relative h-[258px] w-full">
        <div aria-hidden="true">
          <span className="absolute top-[136px] left-[359px] h-[38px] w-0.5 bg-[var(--workflow-checks-line)]" data-motion-connector="checks-return" />
          <span className="absolute top-[172px] left-[254px] h-0.5 w-[107px] bg-[var(--workflow-checks-line)]" data-motion-connector="checks-return" />
          <span className="absolute top-[136px] left-[253px] h-[38px] w-0.5 bg-[var(--workflow-checks-line)]" data-motion-connector="checks-return" />
          <ArrowLeft className="absolute top-[164px] left-[257px] z-20 size-4 text-[var(--workflow-checks)]" data-motion-connector="checks-return" strokeWidth={2} />
          <ArrowUp className="absolute top-[136px] left-[246px] z-20 size-4 text-[var(--workflow-checks)]" data-motion-connector="checks-return" strokeWidth={2} />
          <span className="font-caption absolute top-[160px] left-[278px] z-20 rounded-full bg-[var(--app-card)] px-[7px] py-1 text-[8px] leading-[10px] font-[650] tracking-[0.5px] text-[var(--workflow-checks)]" data-motion-connector="checks-return" data-motion-label>
            CHECK FAILS
          </span>

          <span className="absolute top-[136px] left-[465px] h-[82px] w-0.5 bg-[var(--workflow-human-line)]" data-motion-connector="human-return" />
          <span className="absolute top-[216px] left-[148px] h-0.5 w-[319px] bg-[var(--workflow-human-line)]" data-motion-connector="human-return" />
          <span className="absolute top-[136px] left-[147px] h-[82px] w-0.5 bg-[var(--workflow-human-line)]" data-motion-connector="human-return" />
          <ArrowDown className="absolute top-[150px] left-[458px] z-20 size-4 text-[var(--workflow-human)]" data-motion-connector="human-return" strokeWidth={2} />
          <ArrowLeft className="absolute top-[208px] left-[152px] z-20 size-4 text-[var(--workflow-human)]" data-motion-connector="human-return" strokeWidth={2} />
          <ArrowUp className="absolute top-[136px] left-[140px] z-20 size-4 text-[var(--workflow-human)]" data-motion-connector="human-return" strokeWidth={2} />
          <span className="font-caption absolute top-[204px] left-[271px] z-20 rounded-full bg-[var(--app-card)] px-[7px] py-1 text-[8px] leading-[10px] font-[650] tracking-[0.5px] text-[var(--workflow-human)]" data-motion-connector="human-return" data-motion-label>
            HUMAN REDIRECTS
          </span>

          <ArrowRight className="absolute top-[58px] left-[84px] z-20 size-[22px] text-[var(--workflow-agent)]" data-motion-connector="intent-context" strokeWidth={2} />
          <ArrowRight className="absolute top-[58px] left-[190px] z-20 size-[22px] text-[var(--workflow-agent)]" data-motion-connector="context-build" strokeWidth={2} />
          <ArrowRight className="absolute top-[58px] left-[296px] z-20 size-[22px] text-[var(--workflow-agent)]" data-motion-connector="build-evidence" strokeWidth={2} />
          <ArrowRight className="absolute top-[58px] left-[402px] z-20 size-[22px] text-[var(--workflow-agent)]" data-motion-connector="evidence-approve" strokeWidth={2} />
        </div>

        <ol className="absolute inset-x-0 top-0 grid grid-cols-[repeat(5,84px)] gap-[22px]">
          {workflowSteps.map((step) => (
            <DesktopWorkflowStep key={step.title} step={step} />
          ))}
        </ol>
        <p className="sr-only">
          Failed checks return the work to Build. Human redirects return the
          work to Context.
        </p>
      </div>
    </div>
  );
}

function MobileWorkflowDiagram() {
  return (
    <div
      className="flex h-[448px] w-full max-w-[342px] flex-col gap-3.5 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-4 min-[768px]:hidden"
      data-motion-sequence="delivery-workflow"
      id="workflow-diagram-mobile"
    >
      <div className="flex h-5 shrink-0 items-center justify-between">
        <div className="flex items-center gap-1.5">
          <span
            aria-hidden="true"
            className="size-1.5 rounded-full bg-[var(--workflow-live)] shadow-[0_0_8px_var(--workflow-live-glow)]"
            data-motion-live
          />
          <p className="font-caption text-[10px] leading-[13px] font-[650] tracking-[0.7px] text-[var(--workflow-mobile-heading)]">
            DELIVERY WORKFLOW
          </p>
        </div>
        <span className="font-caption rounded-full bg-[var(--workflow-mobile-badge)] px-[7px] py-[5px] text-[8px] leading-[10px] font-[650] text-[var(--workflow-mobile-heading)]">
          2 LOOPS
        </span>
      </div>

      <div className="relative h-[382px] w-full shrink-0">
        <div aria-hidden="true">
          <span className="absolute top-[170px] right-2.5 h-0.5 w-6 bg-[var(--workflow-mobile-checks-line)]" data-motion-connector="checks-return" />
          <span className="absolute top-[170px] right-2.5 h-[74px] w-0.5 bg-[var(--workflow-mobile-checks-line)]" data-motion-connector="checks-return" />
          <span className="absolute top-[242px] right-2.5 h-0.5 w-6 bg-[var(--workflow-mobile-checks-line)]" data-motion-connector="checks-return" />
          <ArrowLeft className="absolute top-[162px] right-[18px] z-20 size-4 text-[var(--workflow-mobile-checks)]" data-motion-connector="checks-return" strokeWidth={2} />
          <RotateCcw className="absolute top-[194px] right-2 z-20 size-4 text-[var(--workflow-mobile-checks)]" data-motion-connector="checks-return" strokeWidth={2} />

          <span className="absolute top-[98px] left-2.5 h-0.5 w-6 bg-[var(--workflow-mobile-human-line)]" data-motion-connector="human-return" />
          <span className="absolute top-[98px] left-2.5 h-[218px] w-0.5 bg-[var(--workflow-mobile-human-line)]" data-motion-connector="human-return" />
          <span className="absolute top-[314px] left-2.5 h-0.5 w-6 bg-[var(--workflow-mobile-human-line)]" data-motion-connector="human-return" />
          <ArrowRight className="absolute top-[90px] left-[18px] z-20 size-4 text-[var(--workflow-mobile-human)]" data-motion-connector="human-return" strokeWidth={2} />
          <RotateCcw className="absolute top-[198px] left-0.5 z-20 size-4 text-[var(--workflow-mobile-human)]" data-motion-connector="human-return" strokeWidth={2} />

          <ArrowDown className="absolute top-[54px] left-1/2 z-20 h-[18px] w-4 -translate-x-1/2 text-[var(--workflow-mobile-agent)]" data-motion-connector="intent-context" strokeWidth={2} />
          <ArrowDown className="absolute top-[126px] left-1/2 z-20 h-[18px] w-4 -translate-x-1/2 text-[var(--workflow-mobile-agent)]" data-motion-connector="context-build" strokeWidth={2} />
          <ArrowDown className="absolute top-[198px] left-1/2 z-20 h-[18px] w-4 -translate-x-1/2 text-[var(--workflow-mobile-agent)]" data-motion-connector="build-evidence" strokeWidth={2} />
          <ArrowDown className="absolute top-[270px] left-1/2 z-20 h-[18px] w-4 -translate-x-1/2 text-[var(--workflow-mobile-agent)]" data-motion-connector="evidence-approve" strokeWidth={2} />
        </div>

        <ol className="absolute inset-x-[34px] top-0 flex flex-col gap-[18px]">
          {workflowSteps.map((step) => (
            <MobileWorkflowStep key={step.title} step={step} />
          ))}
        </ol>

        <div className="font-caption absolute inset-x-[34px] top-[354px] flex items-center justify-between text-[7px] leading-[9px] font-semibold">
          <span className="flex items-center gap-[5px] text-[var(--workflow-mobile-checks)]" data-motion-connector="checks-return" data-motion-label>
            <span className="size-1.5 rounded-full bg-current" />
            CHECKS → BUILD
          </span>
          <span className="flex items-center gap-[5px] text-[var(--workflow-mobile-human)]" data-motion-connector="human-return" data-motion-label>
            <span className="size-1.5 rounded-full bg-current" />
            APPROVAL → CONTEXT
          </span>
        </div>
      </div>
    </div>
  );
}

function DesktopWorkingSetup() {
  return (
    <ul className="hidden h-[110px] flex-col gap-2.5 min-[768px]:flex">
      {workingSetup.map(({ text, Icon }) => (
        <li className="flex h-[30px] items-center gap-[11px] text-sm text-[var(--app-text-primary)]" key={text}>
          <span className="flex size-[30px] shrink-0 items-center justify-center rounded-lg bg-[var(--workflow-tool-bg)] text-[var(--workflow-tool-icon)]">
            <Icon aria-hidden="true" className="size-3.5" strokeWidth={2} />
          </span>
          {text}
        </li>
      ))}
    </ul>
  );
}

function MobileWorkingSetup() {
  return (
    <div className="flex min-h-[105px] w-full max-w-[342px] flex-col gap-2 rounded-[14px] bg-[var(--app-card)] p-4 min-[768px]:hidden">
      <p className="font-caption text-[11px] leading-[14px] font-bold tracking-[0.9px] text-[var(--workflow-mobile-heading)]">
        WORKING SETUP
      </p>
      <p className="font-caption text-[10px] leading-[1.7] font-semibold whitespace-pre-line text-[var(--app-text-secondary)]">
        {"MCP-connected planning and design\nContext from the team's existing tools\nTests, QA and human approval"}
      </p>
    </div>
  );
}

export function AiWorkingMethod() {
  return (
    <section
      aria-labelledby="ai-working-method-heading"
      className="bg-[var(--app-section)] px-6 py-12 min-[720px]:px-12 min-[1024px]:py-[72px] min-[1100px]:px-6 min-[1280px]:px-20 min-[1440px]:px-[120px]"
      id="method"
    >
      <WorkflowSequenceController />
      <div className="mx-auto grid w-full max-w-[1200px] gap-6 min-[768px]:justify-items-center min-[1100px]:grid-cols-[470px_540px] min-[1100px]:items-center min-[1100px]:justify-between min-[1100px]:justify-items-stretch min-[1100px]:gap-10 min-[1280px]:grid-cols-[500px_540px] min-[1280px]:gap-[60px]">
        <div className="flex w-full max-w-[500px] flex-col gap-6 min-[768px]:h-[386px] min-[768px]:gap-[22px] min-[1100px]:max-w-[470px] min-[1280px]:max-w-[500px]">
          <p className="font-caption text-[11px] leading-[14px] font-bold tracking-[1px] text-[var(--workflow-section-label)] min-[768px]:text-xs min-[768px]:leading-4 min-[768px]:font-semibold">
            HOW I WORK WITH AI
          </p>
          <h2
            className="font-heading max-w-[500px] text-[36px] leading-[1.12] font-medium tracking-[-0.01em] text-[var(--app-text-primary)] min-[768px]:text-[48px] min-[768px]:leading-[1.06] min-[768px]:tracking-normal min-[1280px]:text-[52px]"
            id="ai-working-method-heading"
          >
            AI is in the workflow,
            <br />
            not the sales pitch.
          </h2>
          <p className="max-w-[500px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[768px]:text-lg">
            I use Claude Code and Codex every day. Each task starts with agreed
            scope and product context, then ends with tests, QA and explicit
            human approval.
          </p>
          <DesktopWorkingSetup />
        </div>

        <MobileWorkflowDiagram />
        <MobileWorkingSetup />
        <DesktopWorkflowDiagram />
      </div>
    </section>
  );
}
