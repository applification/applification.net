import { RefreshCw } from "lucide-react";
import { ProductNavigator } from "@/components/products/product-navigator";
import {
  ContextureSchemaPreview,
  contextureDomainEntities,
} from "@/components/products/contexture-schema-preview";
import {
  ProductDetailHero,
  type ProductDetailSpecification,
} from "@/components/products/product-detail";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const contractSteps = [
  {
    accent: "text-[#cba6f7]",
    detail: ".contexture.json",
    line: "bg-[#cba6f7]",
    number: "01",
    title: "Model",
  },
  {
    accent: "text-[#89dceb]",
    detail: "Convex schema",
    line: "bg-[#89dceb]",
    number: "02",
    title: "Generate",
  },
  {
    accent: "text-[#a6e3a1]",
    detail: "Zod + JSON Schema",
    line: "bg-[#a6e3a1]",
    number: "03",
    title: "Validate",
  },
  {
    accent: "text-[#fab387]",
    detail: "MCP tools + AI contracts",
    line: "bg-[#fab387]",
    number: "04",
    title: "Describe",
  },
];

const buildRows: ProductDetailSpecification[] = [
  {
    label: "Desktop editor",
    value: "Electron · React · TypeScript · React Flow",
  },
  {
    label: "Application stack",
    value: "Convex · Zod · JSON Schema",
  },
  {
    label: "Distribution",
    value: "Open source · MIT · GitHub releases",
  },
];

function ContextureContractFlow() {
  return (
    <section
      aria-labelledby="contexture-contract-flow-heading"
      className="bg-[#181825] px-6 py-14 text-[#cdd6f4] min-[1024px]:h-[560px] min-[1024px]:px-20 min-[1024px]:py-[58px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-5 min-[1024px]:grid-cols-[minmax(0,700px)_390px] min-[1024px]:items-end min-[1024px]:justify-between">
          <div>
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[#89dceb] min-[1024px]:text-xs min-[1024px]:font-semibold">
              FROM MODEL TO WORKING CONTRACTS
            </p>
            <h2
              className="font-heading mt-3 text-[36px] leading-[1.08] font-medium min-[1024px]:text-[40px] min-[1024px]:leading-[43px]"
              id="contexture-contract-flow-heading"
            >
              Change the model. Regenerate. Check the drift is gone.
            </h2>
          </div>
          <p className="text-sm leading-[1.55] text-[#a6adc8] min-[1024px]:text-[15px]">
            Derived fields can declare who writes them, so forms and agent tools
            do not accept backend-owned values.
          </p>
        </div>

        <ol
          aria-label="Contexture turns one reviewed model into generated, validated and described application contracts."
          className="mt-[30px] grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {contractSteps.map((step) => (
            <li
              className="flex min-h-[230px] flex-col rounded-[14px] bg-[#313244] p-[22px] ring-1 ring-[#45475a] ring-inset min-[1024px]:min-h-[300px]"
              key={step.number}
            >
              <span
                className={`${step.accent} font-data text-[13px] leading-[17px] font-bold`}
              >
                {step.number}
              </span>
              <h3 className="font-heading mt-4 text-[25px] leading-[25px] font-medium text-[#cdd6f4]">
                {step.title}
              </h3>
              <p className="font-data mt-4 text-xs leading-[18px] text-[#a6adc8]">
                {step.detail}
              </p>
              <span
                aria-hidden="true"
                className={`${step.line} mt-4 h-[5px] w-full rounded-full`}
              />
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function ContextureRationale() {
  return (
    <section
      aria-labelledby="contexture-rationale-heading"
      className="flex bg-[var(--app-section)] px-6 py-14 text-[var(--app-text-primary)] min-[1024px]:min-h-[370px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-9 min-[1024px]:grid-cols-[500px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:gap-[90px]">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--contexture-detail-accent)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            WHY THIS EXISTS
          </p>
          <h2
            className="font-heading mt-4 text-[36px] leading-[1.08] font-medium min-[1024px]:text-[40px]"
            id="contexture-rationale-heading"
          >
            A schema change should not leave five different truths behind.
          </h2>
        </div>
        <div>
          <p className="text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[17px]">
            In an agent-built app, drift compounds quickly. The database accepts
            one shape, forms accept another, and the agent works from old
            assumptions. Contexture turns the reviewed model into generated
            contracts that can be checked before code ships.
          </p>
          <div className="mt-[18px] flex items-center gap-[14px] rounded-[14px] bg-[var(--contexture-detail-soft)] p-[18px] ring-1 ring-[var(--contexture-detail-border)] ring-inset">
            <RefreshCw
              aria-hidden="true"
              className="shrink-0 text-[var(--contexture-detail-accent)]"
              size={26}
              strokeWidth={1.7}
            />
            <p className="text-base leading-[21px] font-semibold text-[var(--contexture-detail-description)]">
              One model is reviewed. Every generated surface can prove it
              matches.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function ContextureSpecifications() {
  return (
    <section
      aria-labelledby="contexture-specifications-heading"
      className="flex bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:min-h-[430px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1024px]:grid-cols-[500px_minmax(0,700px)] min-[1024px]:items-center min-[1024px]:gap-20">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--contexture-detail-accent)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            HOW IT WAS BUILT
          </p>
          <h2
            className="font-heading mt-4 text-[35px] leading-[1.1] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px] min-[1024px]:leading-[42px]"
            id="contexture-specifications-heading"
          >
            A source file first, then editors and generators around it.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-base min-[1024px]:leading-[25px]">
            The centre is a readable domain model under version control. The
            desktop editor helps people shape it, while the runtime and
            generators turn it into the typed surfaces the app needs.
          </p>
        </div>
        <dl>
          {buildRows.map((row) => (
            <div
              className="grid min-h-[59px] items-start gap-2 border-t border-[var(--app-border)] py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:gap-6"
              key={row.label}
            >
              <dt className="font-caption text-[11px] leading-[14px] font-bold text-[var(--contexture-detail-accent)]">
                {row.label}
              </dt>
              <dd className="text-[15px] leading-[19px] text-[var(--app-text-primary)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

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

function ContextureAvailability() {
  return (
    <section
      aria-labelledby="contexture-availability-heading"
      className="flex bg-[var(--app-section)] px-6 py-14 min-[1024px]:min-h-[270px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[54px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 min-[1280px]:grid-cols-[760px_auto] min-[1280px]:items-center min-[1280px]:justify-between min-[1280px]:gap-[60px]">
        <div className="flex flex-col gap-3">
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--contexture-detail-accent)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            WHERE TO GET IT <span aria-hidden="true">/</span>{" "}
            <span className="text-[var(--app-text-muted)]">OPEN SOURCE</span>
          </p>
          <h2
            className="font-heading text-[35px] leading-[1.1] font-medium text-[var(--contexture-detail-title)] min-[1024px]:text-[38px] min-[1024px]:leading-[42px] min-[1280px]:whitespace-nowrap"
            id="contexture-availability-heading"
          >
            Inspect the model editor or start with the source.
          </h2>
          <p className="text-[15px] leading-[1.5] text-[var(--contexture-detail-description)] min-[1024px]:leading-[23px]">
            Contexture is MIT licensed. The web site explains the model, and
            GitHub has the desktop app, runtime packages and generators.
          </p>
        </div>
        <div className="flex w-full flex-col gap-2.5 min-[1280px]:w-auto min-[1280px]:items-end">
          <a
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[var(--contexture-detail-border)] bg-[var(--contexture-detail-accent)] px-[18px] text-sm font-semibold text-[var(--contexture-action-text)] transition-[background-color,transform] hover:bg-[var(--contexture-action-hover)] active:translate-y-px min-[1280px]:w-[176px] ${focusClasses}`}
            href="https://contexture.applification.net/"
            rel="noreferrer"
            target="_blank"
          >
            Open Contexture
            <ArrowUpRightIcon />
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <a
            className={`inline-flex min-h-[44px] w-full items-center justify-center gap-2 rounded-full border border-[var(--contexture-detail-border)] bg-[var(--app-section)] px-[18px] text-sm font-semibold text-[var(--contexture-detail-accent)] transition-[background-color,transform] hover:bg-[var(--contexture-detail-soft)] active:translate-y-px min-[1280px]:w-[164px] ${focusClasses}`}
            href="https://github.com/applification/contexture"
            rel="noreferrer"
            target="_blank"
          >
            View on GitHub
            <ArrowUpRightIcon />
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContextureProductPage() {
  return (
    <main className="[&>section:first-child_a]:border [&>section:first-child_a]:border-[#45475a] [&>section:first-child_a]:px-[17px] [&>section:first-child_a:nth-child(2)]:bg-[#313244] min-[1024px]:[&>section:first-child>div>div:first-child>div:last-child]:pt-0">
      <ProductDetailHero
        breadcrumb="PRODUCTS  /  CONTEXTURE"
        description="A source-of-truth domain model for Convex apps built with agents. The schema, validators and agent context come from the same reviewed structure."
        primaryAction={{
          external: true,
          href: "https://contexture.applification.net/",
          label: "Open Contexture",
        }}
        secondaryAction={{
          external: true,
          href: "https://github.com/applification/contexture",
          label: "GitHub source",
        }}
        title="Design the domain once. Generate the contracts."
        variant="contexture"
        visual={
          <ContextureSchemaPreview
            description="A reviewed Contexture domain model connects Household, Recipe and Meal plan entities with no schema drift."
            detail
            entities={contextureDomainEntities}
          />
        }
      />

      <ContextureRationale />

      <ContextureContractFlow />

      <ContextureSpecifications />

      <ContextureAvailability />

      <ProductNavigator current="contexture" />
    </main>
  );
}
