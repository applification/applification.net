import {
  ArrowUpRight,
  BadgeCheck,
  Blocks,
  Bot,
  Box,
  PackageOpen,
  Rocket,
  ShoppingBag,
} from "lucide-react";
import type { ReactNode } from "react";
import { ContractCta } from "@/components/home/contract-cta";
import { StoryLoopsProductMap } from "@/components/home/storyloops-showcase";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const ownershipLabels = [
  "SOURCE INCLUDED",
  "DEPLOY YOUR INSTANCE",
  "CHANGE WITH YOUR AGENT",
];

type OwnershipStep = {
  description: string;
  icon: ReactNode;
  number: string;
  title: string;
};

const ownershipSteps: OwnershipStep[] = [
  {
    number: "01",
    title: "Purchase V1",
    description:
      "Receive the complete working application and the source code for the version you bought.",
    icon: <ShoppingBag aria-hidden="true" size={24} strokeWidth={1.7} />,
  },
  {
    number: "02",
    title: "Open with your agent",
    description:
      "Ask your preferred coding agent to install StoryLoops for your organisation.",
    icon: <Bot aria-hidden="true" size={24} strokeWidth={1.7} />,
  },
  {
    number: "03",
    title: "Deploy your instance",
    description:
      "The agent provisions services, configures the app, deploys it and runs smoke tests.",
    icon: <Rocket aria-hidden="true" size={24} strokeWidth={1.7} />,
  },
  {
    number: "04",
    title: "Make it yours",
    description:
      "Change the brand, roles, estimates, workflow or integrations in your owned version.",
    icon: <Blocks aria-hidden="true" size={24} strokeWidth={1.7} />,
  },
];

const buildPrinciples = [
  {
    title: "Production core",
    description:
      "Next.js, React, TypeScript, Convex and WorkOS form an opinionated collaborative stack.",
  },
  {
    title: "Agent-native installation",
    description:
      "The playbook covers provisioning, environment setup, deployment and verification.",
  },
  {
    title: "Safe to customise",
    description:
      "Predictable modules, documented invariants and tests help an unfamiliar agent change it correctly.",
  },
];

function Eyebrow({
  children,
  className = "text-[light-dark(#0369a1,#7dd3fc)]",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <p
      className={`${className} font-caption text-[11px] font-bold tracking-[1px] min-[1024px]:text-xs min-[1024px]:font-semibold`}
    >
      {children}
    </p>
  );
}

function StoryLoopsHero() {
  return (
    <section
      aria-labelledby="storyloops-heading"
      className="bg-[linear-gradient(180deg,var(--app-bg),var(--app-bg-end))] px-6 py-12 min-[1024px]:px-20 min-[1440px]:h-[560px] min-[1440px]:py-0"
    >
      <div className="mx-auto grid h-full w-full max-w-[1280px] gap-10 min-[1440px]:grid-cols-[560px_minmax(0,664px)] min-[1440px]:items-center min-[1440px]:gap-14">
        <div className="flex flex-col items-start gap-5">
          <Eyebrow className="text-[#0284c7]">
            PRODUCTS&nbsp; / &nbsp;STORYLOOPS
          </Eyebrow>
          <h1
            className="font-heading max-w-[560px] text-[48px] leading-[0.98] font-medium tracking-[-0.025em] text-[var(--app-text-primary)] min-[1024px]:text-[60px] min-[1024px]:leading-[1.02]"
            id="storyloops-heading"
          >
            Stop renting story-mapping software. Own it.
          </h1>
          <p className="max-w-[560px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-lg min-[1024px]:leading-[1.5]">
            Buy a complete collaborative story-mapping application, deploy it
            with your coding agent, and own the source for the version you
            purchase.
          </p>
          <div className="flex flex-wrap items-center gap-3">
            <a
              className={`inline-flex h-[42px] items-center justify-center gap-[9px] rounded-full bg-[#0369a1] px-[17px] text-sm font-semibold text-white transition-colors hover:bg-[#075985] ${focusClasses}`}
              href="#ownership-path"
            >
              See what you own
              <PackageOpen aria-hidden="true" size={16} strokeWidth={1.8} />
            </a>
            <span className="inline-flex h-[42px] items-center gap-[9px] rounded-full bg-[#e0f2fe] px-[17px] text-sm font-semibold text-[#0369a1]">
              Product in a Box V1
              <Box aria-hidden="true" size={16} strokeWidth={1.8} />
            </span>
          </div>
        </div>

        <div className="min-w-0">
          <StoryLoopsProductMap compact ownershipLabels={ownershipLabels} />
        </div>
      </div>
    </section>
  );
}

function StoryLoopsRationale() {
  return (
    <section
      aria-labelledby="storyloops-rationale-heading"
      className="bg-[#0b1220] px-6 py-14 text-white min-[1024px]:px-20 min-[1440px]:flex min-[1440px]:h-[390px] min-[1440px]:items-center min-[1440px]:py-0"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-9 min-[1440px]:grid-cols-[470px_minmax(0,1fr)] min-[1440px]:items-center min-[1440px]:gap-24">
        <div className="flex flex-col gap-4">
          <Eyebrow className="text-[#7dd3fc]">WHY THIS EXISTS</Eyebrow>
          <h2
            className="font-heading text-[36px] leading-[1.08] font-medium min-[1024px]:text-[40px]"
            id="storyloops-rationale-heading"
          >
            Start with a production product, not an empty directory.
          </h2>
        </div>
        <div className="flex flex-col gap-5">
          <p className="text-base leading-[1.55] text-[#cbd5e1] min-[1024px]:text-[17px]">
            An agent can generate code, but starting from zero still means
            hundreds of architecture, security, data and product decisions.
            StoryLoops gives the agent a coherent application that already
            works.
          </p>
          <div className="flex gap-4 rounded-[14px] border border-[#334155] bg-[#172033] p-5 min-[1024px]:h-[84px] min-[1024px]:items-center min-[1024px]:py-0">
            <BadgeCheck
              aria-hidden="true"
              className="shrink-0 text-[#7dd3fc]"
              size={28}
              strokeWidth={1.7}
            />
            <p className="text-[16px] leading-[1.4] font-semibold text-[#f8fafc]">
              You are buying the decisions, implementation and debugging already
              done, plus the source to take it further.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function StoryLoopsOwnership() {
  return (
    <section
      aria-labelledby="ownership-path-heading"
      className="scroll-mt-16 bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20 min-[1440px]:h-[580px] min-[1440px]:py-[62px]"
      id="ownership-path"
    >
      <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col gap-[34px]">
        <div className="grid gap-4 min-[1440px]:h-[114px] min-[1440px]:grid-cols-[690px_390px] min-[1440px]:items-end min-[1440px]:justify-between">
          <div className="flex flex-col gap-3">
            <Eyebrow>THE OWNERSHIP PATH</Eyebrow>
            <h2
              className="font-heading text-[36px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[40px]"
              id="ownership-path-heading"
            >
              Purchase. Give it to your agent. Receive a production URL.
            </h2>
          </div>
          <p className="text-sm leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[15px] min-[1024px]:leading-[1.5]">
            The installation playbook tells the agent what to provision, how to
            deploy and what to verify before handover.
          </p>
        </div>

        <ol className="grid gap-[14px] sm:grid-cols-2 min-[1024px]:h-[308px] lg:grid-cols-4">
          {ownershipSteps.map((step) => (
            <li
              className="flex min-h-[250px] flex-col gap-4 rounded-2xl bg-[var(--app-muted-section)] p-[22px] min-[1024px]:min-h-0"
              key={step.number}
            >
              <div className="flex h-6 items-center justify-between text-[var(--app-label-text)]">
                <span className="font-caption text-sm font-bold">{step.number}</span>
                <span className="text-[var(--app-action)]">{step.icon}</span>
              </div>
              <h3 className="font-heading text-2xl leading-[1.15] font-medium text-[var(--app-text-primary)]">
                {step.title}
              </h3>
              <p className="text-sm leading-[1.5] text-[var(--app-text-secondary)]">
                {step.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function StoryLoopsBuildPrinciples() {
  return (
    <section
      aria-labelledby="storyloops-principles-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:px-20 min-[1440px]:flex min-[1440px]:h-[420px] min-[1440px]:items-center min-[1440px]:py-0"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1440px]:grid-cols-[500px_700px] min-[1440px]:items-center min-[1440px]:gap-20">
        <div className="flex flex-col gap-4">
          <Eyebrow>BUILT FOR OWNERSHIP</Eyebrow>
          <h2
            className="font-heading text-[35px] leading-[1.1] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px]"
            id="storyloops-principles-heading"
          >
            <span className="min-[1440px]:whitespace-nowrap">
              Production software shaped for
            </span>{" "}
            <br className="hidden min-[1440px]:block" />
            the agent that will change it.
          </h2>
          <p className="text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-base">
            The application favours obvious architecture, explicit domain
            concepts and typed boundaries. Agent documentation is part of the
            product, not an appendix added before release.
          </p>
        </div>
        <ul>
          {buildPrinciples.map((principle) => (
            <li
              className="grid min-h-[79px] grid-cols-[9px_minmax(0,1fr)] items-center gap-5 border-t border-[var(--app-border)] py-3 min-[1024px]:h-[79px] min-[1024px]:py-0"
              key={principle.title}
            >
              <span className="size-[9px] rounded-full bg-[#0284c7]" />
              <div className="flex flex-col gap-[5px]">
                <strong className="text-[15px] leading-none font-semibold text-[var(--app-text-primary)]">
                  {principle.title}
                </strong>
                <p className="text-[13px] leading-[1.45] text-[var(--app-text-secondary)]">
                  {principle.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function StoryLoopsAvailability() {
  return (
    <section
      aria-labelledby="storyloops-availability-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20 min-[1440px]:flex min-[1440px]:h-[270px] min-[1440px]:items-center min-[1440px]:py-0"
    >
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-8 min-[1440px]:flex-row min-[1440px]:items-center min-[1440px]:justify-between min-[1440px]:gap-[60px]">
        <div className="flex max-w-[760px] flex-col gap-3 min-[1440px]:w-[760px]">
          <Eyebrow className="text-[light-dark(#0369a1,#7dd3fc)]">
            WHERE TO GET IT&nbsp; / &nbsp;PRODUCT IN A BOX V1
          </Eyebrow>
          <h2
            className="font-heading text-[35px] leading-[1.1] font-medium text-[light-dark(#082f49,#f8fafc)] min-[1024px]:text-[38px]"
            id="storyloops-availability-heading"
          >
            One purchase. The product and source are yours.
          </h2>
          <p className="text-[15px] leading-[1.5] text-[light-dark(#0c4a6e,#cbd5e1)]">
            V1 is in preparation. Buyers receive the working app, source code,
            deployment configuration and agent playbooks. There is no hosted
            SaaS subscription.
          </p>
        </div>
        <a
          className={`inline-flex h-[49px] w-full shrink-0 items-center justify-center gap-[10px] rounded-full bg-[#0b1220] px-[21px] text-[15px] font-semibold text-white transition-colors hover:bg-[#1e293b] min-[1440px]:w-[221px] ${focusClasses}`}
          href="mailto:dave@applification.net?subject=StoryLoops%20V1%20launch%20details"
        >
          Get V1 launch details
          <ArrowUpRight
            aria-hidden="true"
            className="text-[#7dd3fc]"
            size={18}
            strokeWidth={1.8}
          />
        </a>
      </div>
    </section>
  );
}

function StoryLoopsContractCta() {
  return (
    <div className="min-[1024px]:[&>section]:h-[310px] min-[1024px]:[&>section>div>div>p:last-child]:leading-[1.27] min-[1024px]:[&>section>div>a]:h-[51px] min-[1024px]:[&>section>div>a]:w-[218px] min-[1024px]:[&>section>div>a]:px-5 [&>section>div>a]:whitespace-nowrap [&>section>div>a]:bg-[#f8fafc] [&>section>div>div>p:first-child]:text-[#94a3b8]">
      <ContractCta
        description="I can join an existing team or assemble the product, design and engineering team needed to deliver the project. Remote work across the UK."
        title="Need a senior product engineer or a team to build your AI product?"
        variant="dark"
      />
    </div>
  );
}

export function StoryLoopsProductPage() {
  return (
    <main>
      <StoryLoopsHero />
      <StoryLoopsRationale />
      <StoryLoopsOwnership />
      <StoryLoopsBuildPrinciples />
      <StoryLoopsAvailability />
      <StoryLoopsContractCta />
    </main>
  );
}
