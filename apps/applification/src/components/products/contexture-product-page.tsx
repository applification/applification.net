import {
  contextureContractSteps,
  contextureBuildRows,
  productPageCopy,
  productLinks,
} from "@/lib/content/product-details";
import { ExternalLink, RefreshCw } from "lucide-react";
import { ProductNavigator } from "@/components/products/product-navigator";
import {
  ContextureSchemaPreview,
  contextureDomainEntities,
} from "@/components/products/contexture-schema-preview";
import { ProductDetailHero } from "@/components/products/product-detail";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.92c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.91a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.83c0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

const contractSteps = contextureContractSteps;

const buildRows = contextureBuildRows;

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
              {productPageCopy.contexture.contractFlow.title}
            </h2>
          </div>
          <p className="text-base leading-[1.58] text-[#a6adc8] min-[1024px]:text-[17px]">
            {productPageCopy.contexture.contractFlow.paragraphs[0]}
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
            {productPageCopy.contexture.rationale.title}
          </h2>
        </div>
        <div>
          <p className="text-base leading-[1.55] text-[var(--app-text-secondary)] min-[1024px]:text-[17px]">
            {productPageCopy.contexture.rationale.paragraphs[0]}
          </p>
          <div className="mt-[18px] flex items-center gap-[14px] rounded-[14px] bg-[var(--contexture-detail-soft)] p-[18px] ring-1 ring-[var(--contexture-detail-border)] ring-inset">
            <RefreshCw
              aria-hidden="true"
              className="shrink-0 text-[var(--contexture-detail-accent)]"
              size={26}
              strokeWidth={1.7}
            />
            <p className="text-base leading-[21px] font-semibold text-[var(--contexture-detail-description)]">
              {productPageCopy.contexture.rationale.paragraphs[1]}
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
            {productPageCopy.contexture.specifications.title}
          </h2>
          <p className="mt-4 text-base leading-[1.58] text-[var(--app-text-secondary)] min-[1024px]:text-[17px]">
            {productPageCopy.contexture.specifications.paragraphs[0]}
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
              <dd className="text-base leading-[1.5] text-[var(--app-text-primary)]">
                {row.value}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function ContextureAvailability() {
  return (
    <section
      aria-labelledby="contexture-availability-heading"
      className="flex bg-[var(--app-section)] px-6 py-14 min-[1024px]:min-h-[270px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[54px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 min-[1024px]:grid-cols-[760px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-[120px]">
        <div className="flex flex-col gap-3">
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--contexture-detail-accent)] min-[1024px]:text-xs min-[1024px]:font-semibold">
            WHERE TO GET IT <span aria-hidden="true">/</span>{" "}
            <span className="text-[var(--app-text-muted)]">OPEN SOURCE</span>
          </p>
          <h2
            className="font-heading text-[35px] leading-[1.1] font-medium text-[var(--app-text-primary)] min-[1024px]:text-[38px] min-[1024px]:leading-[42px] min-[1280px]:whitespace-nowrap"
            id="contexture-availability-heading"
          >
            {productPageCopy.contexture.availability.title}
          </h2>
          <p className="text-[17px] leading-[1.6] text-[var(--app-text-secondary)]">
            {productPageCopy.contexture.availability.paragraphs[0]}
          </p>
        </div>
        <div className="flex flex-wrap gap-2.5 min-[1024px]:w-fit min-[1024px]:flex-col min-[1024px]:items-end min-[1024px]:justify-self-end">
          <a
            className={`inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-full border border-[var(--contexture-purple)] bg-[var(--contexture-purple)] px-[18px] text-[15px] font-semibold text-[var(--contexture-shell)] transition-[background-color,transform] hover:bg-[#d8b4fe] active:translate-y-px ${focusClasses}`}
            href={productLinks.contexture[0].url}
            rel="noopener noreferrer"
            target="_blank"
          >
            Open Contexture
            <ExternalLink aria-hidden="true" size={16} strokeWidth={1.8} />
            <span className="sr-only">, opens in a new tab</span>
          </a>
          <a
            className={`inline-flex min-h-[44px] w-fit items-center justify-center gap-2 rounded-full border border-[var(--contexture-border)] bg-[var(--app-section)] px-[18px] text-[15px] font-semibold text-[var(--app-text-primary)] transition-[background-color,transform] hover:bg-[var(--contexture-detail-soft)] active:translate-y-px ${focusClasses}`}
            href={productLinks.contexture[1].url}
            rel="noopener noreferrer"
            target="_blank"
          >
            View on GitHub
            <GithubIcon />
            <ExternalLink aria-hidden="true" size={16} strokeWidth={1.8} />
            <span className="sr-only">, opens in a new tab</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function ContextureProductPage() {
  return (
    <main id="main-content" className="[&>section:first-child_a]:border [&>section:first-child_a]:border-[#45475a] [&>section:first-child_a]:px-[17px] [&>section:first-child_a:nth-child(2)]:bg-[#313244] min-[1024px]:[&>section:first-child>div>div:first-child>div:last-child]:pt-0">
      <ProductDetailHero
        breadcrumb="PRODUCTS  /  CONTEXTURE"
        description={productPageCopy.contexture.hero.description}
        primaryAction={{
          external: true,
          href: productLinks.contexture[0].url,
          label: "Open Contexture",
        }}
        secondaryAction={{
          external: true,
          href: productLinks.contexture[1].url,
          label: "GitHub source",
        }}
        title={productPageCopy.contexture.hero.title}
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
