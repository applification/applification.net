import type { CSSProperties, ReactNode } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Heart,
  Leaf,
  ListChecks,
  RefreshCw,
  Smartphone,
  Sparkles,
  Timer,
  Users,
} from "lucide-react";
import { DetailContextRail } from "@/components/detail-context-rail";
import { ProductNavigator } from "@/components/products/product-navigator";
import {
  ProductDetailEyebrow,
  ProductDetailSteps,
  type ProductDetailStep,
} from "@/components/products/product-detail";
import { buildContactHref, isContactWorkflowAvailable } from "@/lib/contact";

const followBuildHref = buildContactHref({ route: "product", product: "plantry" });

const plantryTheme = {
  "--app-bg": "light-dark(#fffbef, #102a3a)",
  "--app-bg-end": "light-dark(#fffbef, #153447)",
  "--app-section": "light-dark(#fffdf7, #102a3a)",
  "--app-muted-section": "light-dark(#f3eee0, #193b4a)",
  "--app-card": "light-dark(#fffdf7, #193b4a)",
  "--app-label": "light-dark(#e3f3e6, #1d5037)",
  "--app-text-primary": "light-dark(#153447, #fffBEf)",
  "--app-text-secondary": "light-dark(#526879, #d7e3e3)",
  "--app-text-muted": "light-dark(#526879, #a9bdc3)",
  "--app-border": "light-dark(#ded5c4, #466474)",
  "--app-accent": "light-dark(#267343, #78d696)",
  "--app-label-text": "light-dark(#23683b, #9be4b1)",
  "--app-action": "light-dark(#153447, #78d696)",
  "--app-action-hover": "light-dark(#204f67, #9be4b1)",
  "--app-text-on-action": "light-dark(#fffbef, #102a3a)",
  "--app-focus": "light-dark(#2e7d4a, #9be4b1)",
} as CSSProperties;

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

type SignalProps = {
  detail: string;
  icon: ReactNode;
  title: string;
};

function HouseholdSignal({ detail, icon, title }: SignalProps) {
  return (
    <li className="flex h-[60px] items-center gap-3 rounded-xl bg-[var(--app-section)] p-3.5 ring-1 ring-inset ring-[var(--app-border)]">
      <span aria-hidden="true" className="shrink-0 text-[var(--app-accent)]">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col gap-[3px]">
        <strong className="text-[13px] leading-[17px] font-semibold text-[var(--app-text-primary)]">
          {title}
        </strong>
        <span className="font-caption text-[9px] leading-3 text-[var(--app-text-secondary)]">
          {detail}
        </span>
      </span>
    </li>
  );
}

function PlantryPlanningPreview() {
  return (
    <figure className="grid min-w-0 gap-7 overflow-hidden rounded-[22px] bg-[var(--app-muted-section)] p-5 ring-1 ring-inset ring-[var(--app-border)] sm:grid-cols-[minmax(190px,240px)_272px] sm:items-center sm:justify-center sm:justify-items-center min-[1024px]:h-[500px] min-[1024px]:px-[30px] min-[1024px]:py-6">
      <figcaption className="sr-only">
        Plantry combines food that needs using, available cooking effort and
        household preferences to propose tonight&apos;s plan.
      </figcaption>

      <div className="w-full">
        <p className="font-caption mb-3 text-[10px] leading-[13px] font-bold tracking-[0.8px] text-[var(--app-accent)]">
          TONIGHT&apos;S PLAN
        </p>
        <ul className="grid gap-3">
          <HouseholdSignal
            detail="Spinach · 2 days"
            icon={<Leaf size={20} strokeWidth={1.8} />}
            title="Use first"
          />
          <HouseholdSignal
            detail="25 minutes"
            icon={<Timer size={20} strokeWidth={1.8} />}
            title="Effort"
          />
          <HouseholdSignal
            detail="Family favourite"
            icon={<Heart size={20} strokeWidth={1.8} />}
            title="Preference"
          />
        </ul>
      </div>

      {/* A native image keeps this static product preview portable in Storybook. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Plantry on an iPhone showing a three-day household meal plan and a prompt to plan tonight's dinner."
        className="h-auto max-h-[443px] w-[210px] object-contain drop-shadow-[0_10px_24px_#00000026] min-[1024px]:h-[443px] min-[1024px]:w-[272px]"
        decoding="async"
        height={940}
        loading="eager"
        src="/images/plantry-phone.png"
        width={536}
      />
    </figure>
  );
}

function PlantryHero() {
  return (
    <section
      aria-labelledby="plantry-detail-heading"
      className="bg-[var(--app-bg)] px-6 py-12 min-[720px]:px-12 min-[1024px]:min-h-[610px] min-[1024px]:pt-[66px] min-[1024px]:pb-[55px] min-[1440px]:px-[120px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <DetailContextRail
          backHref="/products"
          backLabel="Product index"
          detail="Plantry"
          family="Products"
        />
        <div className="mt-5 grid gap-10 min-[1360px]:grid-cols-[520px_minmax(0,616px)] min-[1360px]:items-center min-[1360px]:gap-16">
          <div className="flex flex-col items-start gap-5">
            <h1
              className="font-heading max-w-[580px] text-[48px] leading-[0.98] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[60px] min-[1024px]:leading-[1.02]"
              id="plantry-detail-heading"
            >
              Plan meals around the household you actually have.
            </h1>
            <p className="max-w-[580px] text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-lg min-[1024px]:leading-[1.5]">
              A meal planner for the next two to seven days. It accounts for
              preferences, effort, what needs using and what is in season, then
              hands the shopping list to Reminders.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              {isContactWorkflowAvailable() ? <a
                className={`inline-flex min-h-11 items-center justify-center gap-[9px] rounded-full border border-[var(--app-border)] bg-[var(--app-action)] px-5 text-base font-semibold whitespace-nowrap text-[var(--app-text-on-action)] transition-[background-color,transform] hover:bg-[var(--app-action-hover)] active:translate-y-px ${focusClasses}`}
                href={followBuildHref}
              >
                Follow the build
                <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
              </a> : null}
              <span className="inline-flex min-h-11 items-center gap-[9px] rounded-full border border-[var(--app-border)] bg-[var(--app-muted-section)] px-5 text-base font-semibold whitespace-nowrap text-[var(--app-text-secondary)]">
                Apple platforms R&amp;D
                <Smartphone aria-hidden="true" size={16} strokeWidth={1.8} />
              </span>
            </div>
          </div>

          <PlantryPlanningPreview />
        </div>
      </div>
    </section>
  );
}

function PlantryRationale() {
  return (
    <section
      aria-labelledby="plantry-rationale-heading"
      className="bg-[#153447] px-6 py-14 text-[#fffbef] min-[1024px]:flex min-[1024px]:min-h-[370px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-9 min-[1024px]:grid-cols-[500px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:gap-[90px]">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[#78d696] min-[1024px]:text-xs min-[1024px]:font-semibold">
            WHY THIS EXISTS
          </p>
          <h2
            className="font-heading mt-4 text-[36px] leading-[1.08] font-medium min-[1024px]:text-[40px]"
            id="plantry-rationale-heading"
          >
            A technically perfect meal plan can still be useless by Tuesday.
          </h2>
        </div>
        <div>
          <p className="text-base leading-[1.55] text-[#d7e3e3] min-[1024px]:text-[17px]">
            Meal planning breaks when it ignores energy, leftovers and the
            people around the table. Plantry treats the plan as a short
            household forecast, then learns from what was cooked, skipped or
            changed.
          </p>
          <div className="mt-[18px] flex items-center gap-[14px] rounded-[14px] bg-[#244354] p-[18px]">
            <RefreshCw
              aria-hidden="true"
              className="shrink-0 text-[#78d696]"
              size={26}
              strokeWidth={1.7}
            />
            <p className="text-base leading-[21px] font-semibold text-[#fffbef]">
              A useful plan adapts to the household instead of asking the
              household to obey it.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

const planningSteps: ProductDetailStep[] = [
  {
    number: "01",
    title: "Read the household",
    description:
      "Preferences, available effort, seasonality and food that needs using.",
    icon: <Users aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
  {
    number: "02",
    title: "Propose 2–7 days",
    description: "Build a plan short enough to stay realistic and useful.",
    icon: <CalendarDays aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
  {
    number: "03",
    title: "Hand off shopping",
    description: "Put the resulting list into Apple Reminders.",
    icon: <ListChecks aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
  {
    number: "04",
    title: "Learn what happened",
    description:
      "Use cooked, skipped and changed meals to shape the next plan.",
    icon: <Sparkles aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
];

const buildPrinciples = [
  {
    title: "Household first",
    description:
      "Preferences and constraints belong to the people, not a generic meal plan.",
  },
  {
    title: "Native handoff",
    description:
      "Shopping moves into Reminders instead of becoming another list to maintain.",
  },
  {
    title: "Feedback over streaks",
    description:
      "Cooked, skipped and changed are useful signals, not failure states.",
  },
];

function PlantryBuildPrinciples() {
  return (
    <section
      aria-labelledby="plantry-build-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:flex min-[1024px]:min-h-[430px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1024px]:grid-cols-[500px_minmax(0,700px)] min-[1024px]:items-center min-[1024px]:gap-20">
        <div>
          <ProductDetailEyebrow>HOW IT IS BEING BUILT</ProductDetailEyebrow>
          <h2
            className="font-heading mt-4 text-[35px] leading-[1.1] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px]"
            id="plantry-build-heading"
          >
            The household model comes before recipe volume.
          </h2>
          <p className="mt-4 text-base leading-[1.58] text-[var(--app-text-secondary)] min-[1024px]:text-[17px]">
            The first prototypes focus on the decisions that make a plan usable:
            who is eating, how much effort is available, what should be used
            soon and what changed last time. The recipe catalogue can grow after
            that loop earns trust.
          </p>
        </div>

        <dl>
          {buildPrinciples.map((principle) => (
            <div
              className="grid gap-2 border-t border-[var(--app-border)] py-[18px] min-[640px]:min-h-[56px] min-[640px]:grid-cols-[150px_minmax(0,1fr)] min-[640px]:items-center min-[640px]:gap-6 min-[640px]:py-0"
              key={principle.title}
            >
              <dt className="font-caption text-[11px] leading-[14px] font-bold text-[var(--app-label-text)]">
                {principle.title}
              </dt>
              <dd className="text-[15px] leading-[1.5] text-[var(--app-text-primary)]">
                {principle.description}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function PlantryAvailability() {
  return (
    <section
      aria-labelledby="plantry-availability-heading"
      className="flex min-h-[270px] items-center bg-[var(--app-section)] px-6 py-14 min-[1024px]:px-20 min-[1200px]:h-[270px] min-[1200px]:py-[54px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 min-[1200px]:grid-cols-[760px_auto] min-[1200px]:items-center min-[1200px]:justify-between">
        <div>
          <p className="font-caption text-[11px] leading-4 font-bold tracking-[1px] text-[light-dark(#2e7d4a,#9be4b1)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            WHERE TO GET IT&nbsp; / &nbsp;PRODUCT R&amp;D
          </p>
          <h2
            className="font-heading mt-3 text-[35px] leading-[1.1] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px]"
            id="plantry-availability-heading"
          >
            Plantry is still in product development.
          </h2>
          <p className="mt-3 max-w-[760px] text-[17px] leading-[1.6] text-[var(--app-text-secondary)]">
            The current iPhone prototype is testing the household planning loop
            before a wider release. Follow the build for availability and test
            invitations.
          </p>
        </div>
        {isContactWorkflowAvailable() ? <a
          className={`inline-flex h-[49px] w-full items-center justify-center gap-2.5 rounded-full bg-[var(--app-text-primary)] px-[21px] text-[15px] font-semibold text-[var(--app-section)] transition-[background-color,transform] hover:bg-[var(--app-text-secondary)] active:translate-y-px min-[1200px]:w-[185px] ${focusClasses}`}
          href={followBuildHref}
        >
          Follow the build
          <ArrowUpRight
            aria-hidden="true"
            className="shrink-0 text-[#78d696]"
            size={18}
            strokeWidth={1.8}
          />
        </a> : null}
      </div>
    </section>
  );
}

export function PlantryProductPage() {
  return (
    <main className="overflow-x-clip" style={plantryTheme}>
      <PlantryHero />

      <PlantryRationale />

      <ProductDetailSteps
        eyebrow="A SHORT, ADAPTIVE LOOP"
        id="adaptive-loop"
        note="The product keeps the planning horizon deliberately small, so a changed evening does not wreck an entire month."
        steps={planningSteps}
        title="Plan a few days. Cook what works. Teach the next plan."
        variant="plantry"
      />

      <PlantryBuildPrinciples />

      <PlantryAvailability />

      <ProductNavigator current="plantry" />
    </main>
  );
}
