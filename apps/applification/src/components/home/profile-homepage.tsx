import Link from "next/link";
import { ArrowRight, Download } from "lucide-react";
import { ExternalLink } from "@/components/external-link";
import { ClientLogos } from "./client-logos";
import { ClientOutcomes } from "./client-outcomes";
import { ContractCta } from "./contract-cta";
import {
  contractPositioning,
  personalLinkedInUrl,
} from "@/lib/contract-positioning";
import { businessUrl } from "@/lib/site-identity";

const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";
const link = `link-sweep inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--app-label-text)] ${focus}`;

export function ProfileHomepage({
  contactAvailable = true,
}: {
  contactAvailable?: boolean;
}) {
  return (
    <main id="main-content" className="flex-1">
      <section
        className="bg-linear-to-b from-[var(--hero-bg)] to-[var(--hero-bg-end)] text-[var(--hero-text)]"
        aria-labelledby="profile-heading"
      >
        <div className="mx-auto grid w-full max-w-[1200px] gap-10 px-6 pt-12 pb-16 min-[720px]:px-12 min-[1024px]:grid-cols-[1fr_310px] min-[1024px]:gap-14 min-[1024px]:pt-16 min-[1024px]:pb-20 min-[1280px]:px-0">
          <div>
            <p className="font-caption text-xs font-semibold text-[var(--hero-label)]">
              Contract frontend & product engineer
            </p>
            <h1
              id="profile-heading"
              className="font-heading mt-5 text-[clamp(3.5rem,7vw,6.25rem)] font-medium leading-none tracking-[-0.03em]"
            >
              Dave Hudson
            </h1>
            <p className="font-heading mt-5 max-w-[780px] text-[clamp(2rem,3.5vw,3rem)] leading-[1.12]">
              React, TypeScript, Next.js
              <br />
              and AI integrations.
            </p>
            <p className="mt-6 max-w-[700px] text-lg leading-[1.65] text-[var(--hero-text-secondary)]">
              I join product teams to build web applications, modernise
              frontends and take products to release. More than twenty years of
              hands-on engineering, with full-stack depth and production AI
              experience.
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-5 gap-y-3">
              {contactAvailable ? (
                <Link
                  href="/contact?route=contract"
                  className="inline-flex min-h-[50px] items-center gap-2 rounded-full bg-[var(--hero-action)] px-6 font-semibold text-[var(--hero-action-text)] hover:bg-[var(--hero-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]"
                >
                  Discuss a contract
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : null}
              <a
                href="/cv/Dave-Hudson-CV.pdf"
                download
                className="link-sweep inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--hero-label)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]"
              >
                <Download aria-hidden="true" className="size-4" />
                <span className="link-sweep-label">Download CV (PDF)</span>
              </a>
              <ExternalLink
                href={personalLinkedInUrl}
                className="link-sweep inline-flex min-h-11 items-center text-[var(--hero-label)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]"
              >
                <span className="link-sweep-label">LinkedIn</span>
              </ExternalLink>
            </div>
          </div>
          <aside
            className="self-start rounded-2xl border border-[var(--hero-border)] bg-[var(--app-card)] p-6"
            aria-label="Contract availability"
          >
            <p className="font-caption text-xs text-[var(--hero-label)]">
              {contractPositioning.availability}
            </p>
            <dl className="mt-5 grid gap-5 text-base">
              <div>
                <dt className="font-caption text-[11px] text-[var(--hero-text-muted)]">
                  Working location
                </dt>
                <dd className="mt-1">
                  Remote UK
                  <br />
                  <span className="text-sm text-[var(--hero-text-secondary)]">
                    North East hybrid considered
                  </span>
                </dd>
              </div>
              <div>
                <dt className="font-caption text-[11px] text-[var(--hero-text-muted)]">
                  Contract basis
                </dt>
                <dd className="mt-1">Through Applification Ltd</dd>
              </div>
              <div>
                <dt className="font-caption text-[11px] text-[var(--hero-text-muted)]">
                  Useful for
                </dt>
                <dd className="mt-1">
                  Frontend delivery, product builds and architectural resets
                </dd>
              </div>
            </dl>
            <Link
              href="/about"
              className="link-sweep mt-5 inline-flex min-h-11 items-center gap-2 text-sm font-semibold text-[var(--hero-label)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]"
            >
              <span className="link-sweep-label">More about me</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </aside>
        </div>
      </section>
      <ClientLogos />
      <ClientOutcomes />
      <section
        className="bg-[var(--app-section)] py-14 min-[1024px]:py-20"
        aria-labelledby="profile-fit-heading"
      >
        <div className="mx-auto w-full max-w-[1200px] px-6 min-[720px]:px-12 min-[1280px]:px-0">
          <h2
            id="profile-fit-heading"
            className="font-heading max-w-[760px] text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.08] font-medium"
          >
            Frontend delivery, with the rest of the product in view.
          </h2>
          <div className="mt-10 grid gap-8 min-[900px]:grid-cols-3 min-[900px]:gap-10">
            {[
              [
                "React & Next.js",
                "Greenfield frontends, inherited applications, component architecture and design systems. TypeScript, Storybook and automated checks keep the work easy to review and change.",
              ],
              [
                "Full-stack product work",
                "Typed API integration, Node.js and Convex when the product needs a complete vertical slice. I work closely with designers, backend engineers and product owners to reach a useful release.",
              ],
              [
                "AI & MCP integrations",
                "Production AI interfaces, MCP tools and agent workflows. My AI work adds another way to solve product problems alongside straightforward frontend engineering.",
              ],
            ].map(([title, description]) => (
              <article
                key={title}
                className="border-t border-[var(--app-border)] pt-5"
              >
                <h3 className="font-heading text-[28px] leading-tight font-medium">
                  {title}
                </h3>
                <p className="mt-4 text-[17px] leading-[1.65] text-[var(--app-text-secondary)]">
                  {description}
                </p>
              </article>
            ))}
          </div>
          <div className="mt-10 flex flex-wrap gap-x-6 gap-y-2">
            <Link href="/client-work" className={link}>
              <span className="link-sweep-label">Explore client work</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
            <Link href="/writing" className={link}>
              <span className="link-sweep-label">Read my writing</span>
              <ArrowRight aria-hidden="true" className="size-4" />
            </Link>
          </div>
        </div>
      </section>
      <section className="bg-[var(--app-muted-section)] py-12">
        <div className="mx-auto grid w-full max-w-[1200px] gap-5 px-6 min-[720px]:px-12 min-[900px]:grid-cols-2 min-[900px]:gap-16 min-[1280px]:px-0">
          <h2 className="font-heading text-[32px] leading-tight font-medium">
            Founder of Applification.
          </h2>
          <div>
            <p className="text-[17px] leading-[1.65] text-[var(--app-text-secondary)]">
              Alongside contract work, I build Applification’s specialist MCP
              integrations and Apps offer. For an integration you want to
              commission as a scoped project, start with the business site.
            </p>
            <ExternalLink href={businessUrl} className={`mt-4 ${link}`}>
              <span className="link-sweep-label">Explore Applification</span>
            </ExternalLink>
          </div>
        </div>
      </section>
      <ContractCta />
    </main>
  );
}
