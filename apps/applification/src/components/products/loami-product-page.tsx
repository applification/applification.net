import Link from "next/link";
import { ArrowRight, BookmarkCheck, Film, Users } from "lucide-react";
import { ProductStatus } from "@/components/home/product-status";
import { ExternalLink } from "@/components/external-link";
import { productPageCopy } from "@/lib/content/product-details";
import { buildContactHref, isContactWorkflowAvailable } from "@/lib/contact";
import { LoamiArtwork } from "./loami-artwork";
import { LoamiPresenceDemo } from "./loami-presence-demo";
import { ProductNavigator } from "./product-navigator";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";
const copy = productPageCopy.loami;
const action = `inline-flex min-h-11 items-center gap-2 rounded-full bg-[var(--app-action)] px-5 py-3 font-semibold text-[var(--app-text-on-action)] hover:bg-[var(--app-action-hover)] ${focus}`;

export function LoamiCard() {
  return (
    <article data-product-theme="loami" className="scheme-light flex flex-col overflow-hidden rounded-md border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-primary)]">
      <div className="flex min-h-[238px] items-center justify-center bg-[var(--app-muted-section)] p-6">
        <LoamiArtwork />
      </div>
      <div className="flex flex-1 flex-col p-6">
        <div className="font-caption flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold tracking-[0.55px] text-[var(--app-text-secondary)]">
          <span>MCP&nbsp; · &nbsp;CONVEX</span>
          <ProductStatus status="In Development" />
        </div>
        <h3 className="font-heading mt-3 text-[30px] leading-none font-medium">
          Loami
        </h3>
        <p className="mt-3 text-lg font-semibold leading-[1.2]">
          A little help for life at home.
        </p>
        <p className="mt-3 text-base leading-[1.55] text-[var(--app-text-secondary)]">
          A household assistant that knows your tastes and works with your
          agents.
        </p>
        <div className="mt-auto pt-5">
          <Link className={action} href="/products/loami">
            View Loami <ArrowRight aria-hidden="true" size={16} />
          </Link>
        </div>
      </div>
    </article>
  );
}

function RecipePreview() {
  return (
    <figure className="overflow-hidden rounded-3xl border border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-primary)]">
      <div className="flex items-center gap-3 border-b border-[var(--app-border)] px-5 py-4">
        <Users aria-hidden="true" size={18} />
        <span className="text-sm font-semibold">Household recipes</span>
      </div>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/images/loami/felucian-garden-spread.webp"
        alt="Plant-based kefta on herby hummus with cucumber, tomato, spinach and pita."
        width={1254}
        height={1254}
        className="h-52 w-full object-cover sm:h-64"
      />
      <div className="p-5 sm:p-7">
        <p className="font-caption text-xs text-[var(--app-text-secondary)]">
          SAVED HOUSEHOLD RECIPE
        </p>
        <h2 className="mt-3 text-2xl font-semibold leading-tight">
          Felucian Garden Spread
        </h2>
        <p className="mt-3 flex items-center gap-2 text-sm">
          <BookmarkCheck aria-hidden="true" size={18} /> Your household&apos;s
          version
        </p>
        <div className="mt-6 rounded-xl border border-[var(--app-border)] bg-[var(--app-muted-section)] p-4 text-[15px] leading-relaxed">
          &quot;Find our Star Wars-inspired recipes.&quot;
        </div>
      </div>
      <figcaption className="border-t border-[var(--app-border)] px-5 py-4 text-xs leading-relaxed text-[var(--app-text-secondary)]">
        A saved Loami recipe. Example request, not a live conversation.
      </figcaption>
    </figure>
  );
}

export function LoamiProductPage() {
  return (
    <main id="main-content" data-product-theme="loami" className="overflow-x-clip bg-[var(--app-bg)]">
      <section className="px-6 pt-12 pb-14 min-[1024px]:px-20 min-[1024px]:pt-16 min-[1024px]:pb-20">
        <div className="mx-auto max-w-[1200px]">
          <Link
            href="/products"
            className={`link-sweep inline-flex min-h-11 items-center text-sm text-[var(--app-label-text)] ${focus}`}
          >
            <span className="link-sweep-label">Products / Loami</span>
          </Link>
          <div className="mt-6 grid items-center gap-10 min-[1024px]:grid-cols-2 min-[1024px]:gap-16">
            <div>
              <ProductStatus status="In Development" />
              <h1 className="font-heading mt-6 max-w-[650px] text-[44px] leading-[1.04] font-medium text-[var(--app-text-primary)] sm:text-[56px]">
                {copy.hero.title}
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-[var(--app-text-secondary)]">
                {copy.hero.paragraphs[0]}
              </p>
              <div data-product-theme="loami" className="scheme-light mt-7 rounded-3xl bg-[var(--app-muted-section)] px-5 py-6">
                <LoamiPresenceDemo />
              </div>
              <div className="mt-7 flex flex-wrap items-center gap-5">
                {isContactWorkflowAvailable() ? (
                  <Link
                    className={action}
                    href={buildContactHref({
                      route: "product",
                      product: "loami",
                    })}
                  >
                    Discuss Loami <ArrowRight aria-hidden="true" size={18} />
                  </Link>
                ) : (
                  <Link
                    className={`link-sweep inline-flex min-h-11 items-center text-[var(--app-label-text)] ${focus}`}
                    href="/about"
                  >
                    <span className="link-sweep-label">Discuss Loami</span>
                  </Link>
                )}
                <Link
                  className={`link-sweep inline-flex min-h-11 items-center text-sm text-[var(--app-text-secondary)] ${focus}`}
                  href="/products/plantry"
                >
                  <span className="link-sweep-label">
                    Where it began with Plantry
                  </span>
                </Link>
              </div>
            </div>
            <RecipePreview />
          </div>
        </div>
      </section>
      <section className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:px-20 min-[1024px]:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 min-[1024px]:grid-cols-[1fr_1fr] min-[1024px]:gap-16">
          <div>
            <h2 className="font-heading text-4xl text-[var(--app-text-primary)]">
              {copy.recipes.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--app-text-secondary)]">
              {copy.recipes.paragraphs[0]}
            </p>
          </div>
          <ol className="space-y-4 text-[var(--app-text-primary)]">
            {[
              {
                title: "Capture",
                text: "Start with a public recipe URL or a Markdown note.",
              },
              {
                title: "Review",
                text: "Check the retained wording, source and quantities.",
              },
              {
                title: "Save",
                text: "Explicitly save the version your household will use.",
              },
            ].map((step, i) => (
              <li
                className="flex gap-4 border-b border-[var(--app-border)] pb-4"
                key={step.title}
              >
                <span className="font-caption pt-1 text-sm text-[var(--app-label-text)]">
                  {i + 1}
                </span>
                <div>
                  <h3 className="text-lg font-semibold">{step.title}</h3>
                  <p className="mt-1 leading-relaxed text-[var(--app-text-secondary)]">
                    {step.text}
                  </p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>
      <section className="px-6 py-14 min-[1024px]:px-20 min-[1024px]:py-20">
        <div className="mx-auto grid max-w-[1200px] gap-10 min-[1024px]:grid-cols-2 min-[1024px]:gap-16">
          <div>
            <Film
              className="mb-5 text-[var(--app-label-text)]"
              aria-hidden="true"
              size={32}
            />
            <h2 className="font-heading text-4xl text-[var(--app-text-primary)]">
              {copy.movies.title}
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-[var(--app-text-secondary)]">
              {copy.movies.paragraphs[0]}
            </p>
          </div>
          <div className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6">
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              MOVIE NIGHT
            </p>
            <h3 className="font-heading mt-4 text-3xl text-[var(--app-text-primary)]">
              Remember the household&apos;s taste.
            </h3>
            <ul className="mt-5 space-y-4 text-[var(--app-text-secondary)]">
              {[
                "Discover films and keep a shared watchlist.",
                "See who wants to watch before choosing.",
                "Record ratings and comments after the credits.",
                "Keep the favourites in a household Hall of Fame.",
              ].map((text) => (
                <li
                  className="border-t border-[var(--app-border)] pt-3"
                  key={text}
                >
                  {text}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
      <section className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:px-20">
        <div className="mx-auto max-w-[1200px]">
          <h2 className="font-heading text-4xl text-[var(--app-text-primary)]">
            {copy.engineering.title}
          </h2>
          <p className="mt-5 max-w-[760px] text-lg leading-relaxed text-[var(--app-text-secondary)]">
            {copy.engineering.paragraphs[0]}
          </p>
          <ExternalLink
            className={`link-sweep mt-5 inline-flex min-h-11 items-center text-[var(--app-label-text)] ${focus}`}
            href="https://loami-storybook.vercel.app/?path=/docs/foundations-brand--docs"
          >
            <span className="link-sweep-label">
              Explore the brand and components in Storybook
            </span>
          </ExternalLink>
        </div>
      </section>
      <section className="px-6 py-14 min-[1024px]:px-20">
        <div className="mx-auto max-w-[1200px]">
          <p className="font-caption mb-4 text-xs text-[var(--app-label-text)]">
            PLANNED
          </p>
          <h2 className="font-heading text-4xl text-[var(--app-text-primary)]">
            {copy.availability.title}
          </h2>
          {copy.availability.paragraphs.map((text) => (
            <p
              key={text}
              className="mt-5 max-w-[760px] text-lg leading-relaxed text-[var(--app-text-secondary)]"
            >
              {text}
            </p>
          ))}
          <Link
            href="/products/plantry"
            className={`link-sweep mt-4 inline-flex min-h-11 items-center text-[var(--app-label-text)] ${focus}`}
          >
            <span className="link-sweep-label">Read the Plantry archive</span>
          </Link>
        </div>
      </section>
      <ProductNavigator current="loami" />
    </main>
  );
}
