import { productPageCopy, astackRoutes } from "@/lib/content/product-details";
import { ExternalLink } from "@/components/external-link";
import { ProductDetailHero, ProductDetailAvailability } from "./product-detail";
import { ProductNavigator } from "./product-navigator";
import { AstackRouteMap as AstackBranchingRouteMap } from "./astack-route-map";

export function AstackRouteMap() {
  return (
    <figure className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-5 text-[var(--app-text-primary)] min-[720px]:p-7">
      <figcaption className="font-caption text-xs font-semibold text-[var(--app-label-text)]">
        astack / Engineering routes
      </figcaption>
      <div className="mt-5 border-l-2 border-[var(--app-action)] pl-4">
        <p className="font-data break-words text-sm">
          $applification:astack &lt;task&gt;
        </p>
        <p className="mt-2 text-sm text-[var(--app-text-secondary)]">
          Choose a route by the intended outcome.
        </p>
      </div>
      <ul className="my-5 grid gap-2 min-[480px]:grid-cols-2">
        {astackRoutes.map((route) => (
          <li
            key={route.title}
            className="border-l border-[var(--app-border)] py-1 pl-4"
          >
            <span className="text-sm font-semibold">{route.title}</span>
            <p className="mt-1 text-sm text-[var(--app-text-secondary)]">
              {route.description}
            </p>
          </li>
        ))}
      </ul>
      <p className="border-t border-[var(--app-border)] pt-4 text-sm font-semibold text-[var(--app-label-text)]">
        Proof → Review → Pull request
      </p>
      <p className="mt-2 text-sm text-[var(--app-text-secondary)]">
        A read-only investigation ends with an answer.
      </p>
    </figure>
  );
}

export function AstackProductPage() {
  const copy = productPageCopy.astack;
  return (
    <main id="main-content">
      <ProductDetailHero
        breadcrumb="PRODUCTS / astack"
        title={copy.hero.title}
        description={copy.hero.paragraphs[0]}
        attribution={
          <p className="text-sm text-[var(--app-text-secondary)]">
            Inspired by{" "}
            <ExternalLink
              className="link-sweep inline-flex min-h-11 items-center font-semibold text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
              href="https://github.com/cursor/plugins/tree/main/pstack"
            >
              <span className="link-sweep-label">Poteto’s pstack</span>
            </ExternalLink>
          </p>
        }
        status="OPEN SOURCE · IN DEVELOPMENT"
        primaryAction={{
          href: "https://astack.applification.net/",
          label: "Explore astack",
          external: true,
        }}
        secondaryAction={{
          href: "https://github.com/applification/astack",
          label: "View source on GitHub",
          external: true,
        }}
        visual={<AstackRouteMap />}
      />
      <section
        className="bg-[var(--app-section)] px-6 py-10 min-[720px]:px-12 min-[1440px]:px-[120px]"
        aria-label="Follow an astack task"
      >
        <div className="mx-auto max-w-[1200px]">
          <AstackBranchingRouteMap />
        </div>
      </section>
      <section
        className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1440px]:px-[120px]"
        aria-labelledby="astack-method-heading"
      >
        <div className="mx-auto grid max-w-[1200px] gap-10 min-[1024px]:grid-cols-2 min-[1024px]:gap-20">
          <div>
            <h2
              id="astack-method-heading"
              className="font-heading text-4xl text-[var(--app-text-primary)]"
            >
              {copy.method.title}
            </h2>
            {copy.method.paragraphs.map((p) => (
              <p
                key={p}
                className="mt-5 text-base leading-relaxed text-[var(--app-text-secondary)]"
              >
                {p}
              </p>
            ))}
          </div>
          <div>
            <h2 className="font-heading text-4xl text-[var(--app-text-primary)]">
              {copy.project.title}
            </h2>
            {copy.project.paragraphs.map((p) => (
              <p
                key={p}
                className="mt-5 text-base leading-relaxed text-[var(--app-text-secondary)]"
              >
                {p}
              </p>
            ))}
            <p className="mt-6 border-l-2 border-[var(--app-action)] pl-5 text-base leading-relaxed text-[var(--app-text-primary)]">
              Proof names the revision, environment, action and observed result.
              A passing test or screenshot supports the behaviour it actually
              exercised. Gaps stay visible in review.
            </p>
          </div>
        </div>
      </section>
      <ProductDetailAvailability
        eyebrow="TRY IT IN CODEX"
        status="IN DEVELOPMENT"
        title={copy.availability.title}
        description={copy.availability.paragraphs[0]}
        action={{
          href: "https://astack.applification.net/#adopt",
          label: "Get started",
          external: true,
        }}
        secondaryAction={{
          href: "https://github.com/applification/astack",
          label: "Read the repository",
          external: true,
        }}
      />
      <ProductNavigator current="astack" />
    </main>
  );
}
