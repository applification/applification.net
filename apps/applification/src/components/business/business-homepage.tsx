import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ExternalLink } from "@/components/external-link";
import { personalLinkedInUrl } from "@/lib/contract-positioning";
import {
  businessCopy,
  capabilities,
  engagements,
  integrationEvidence,
} from "@/lib/content/business";
import { profileUrl } from "@/lib/site-identity";
import { IntegrationExample } from "./integration-example";

const frame =
  "mx-auto w-full max-w-[1200px] px-6 min-[720px]:px-12 min-[1280px]:px-0";
const focus =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";
const textLink = `link-sweep inline-flex min-h-11 items-center gap-2 font-semibold text-[var(--app-label-text)] ${focus}`;
const heading =
  "font-heading text-[clamp(2.25rem,4vw,3.25rem)] leading-[1.08] font-medium tracking-[-0.02em]";
const copy = "text-[17px] leading-[1.65] text-[var(--app-text-secondary)]";

function ProjectAction({ contactAvailable }: { contactAvailable: boolean }) {
  return contactAvailable ? (
    <Link
      href="/contact?route=general"
      className={`inline-flex min-h-[50px] items-center justify-center gap-2 rounded-full bg-[var(--app-action)] px-6 font-semibold text-[var(--app-text-on-action)] hover:bg-[var(--app-action-hover)] ${focus}`}
    >
      Discuss a project
      <ArrowRight aria-hidden="true" className="size-4" />
    </Link>
  ) : (
    <ExternalLink href={personalLinkedInUrl} className={textLink}>
      Discuss a project on LinkedIn
    </ExternalLink>
  );
}

export function BusinessHomepage({
  contactAvailable = true,
}: {
  contactAvailable?: boolean;
}) {
  return (
    <main id="main-content" className="flex-1">
      <section
        className="bg-linear-to-b from-[var(--hero-bg)] to-[var(--hero-bg-end)] text-[var(--hero-text)]"
        aria-labelledby="business-heading"
      >
        <div
          className={`${frame} grid gap-10 pt-12 pb-16 min-[1024px]:grid-cols-[1.1fr_1fr] min-[1024px]:gap-14 min-[1024px]:pt-16 min-[1024px]:pb-20`}
        >
          <div>
            <p className="font-caption text-xs font-semibold text-[var(--hero-label)]">
              Applification · MCP integrations & MCP Apps
            </p>
            <h1
              id="business-heading"
              className="font-heading mt-6 max-w-[650px] text-[clamp(3rem,5.5vw,4.75rem)] leading-[1.02] font-medium tracking-[-0.03em]"
            >
              Your systems and data,
              <br />
              usable through AI assistants.
            </h1>
            <p className="mt-6 max-w-[580px] text-lg leading-[1.6] text-[var(--hero-text-secondary)]">
              {businessCopy.description}
            </p>
            <div className="mt-7 flex flex-wrap items-center gap-x-6 gap-y-2">
              {contactAvailable ? (
                <Link
                  href="/contact?route=general"
                  className="inline-flex min-h-[50px] items-center gap-2 rounded-full bg-[var(--hero-action)] px-6 font-semibold text-[var(--hero-action-text)] hover:bg-[var(--hero-action-hover)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]"
                >
                  Discuss a project
                  <ArrowRight aria-hidden="true" className="size-4" />
                </Link>
              ) : (
                <ExternalLink
                  href={personalLinkedInUrl}
                  className="inline-flex min-h-11 items-center text-[var(--hero-label)]"
                >
                  Discuss a project on LinkedIn
                </ExternalLink>
              )}
              <Link
                href="#evidence"
                className="link-sweep inline-flex min-h-11 items-center gap-2 font-medium text-[var(--hero-label)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--hero-focus)]"
              >
                <span className="link-sweep-label">See the work</span>
                <ArrowRight aria-hidden="true" className="size-4" />
              </Link>
            </div>
            <p className="mt-6 text-sm leading-relaxed text-[var(--hero-text-muted)]">
              For businesses and agency teams.
              <br />
              Founded by Dave Hudson. Direct involvement from scope to handover.
            </p>
          </div>
          <div className="self-center">
            <IntegrationExample />
          </div>
        </div>
      </section>

      <section
        id="services"
        className="bg-[var(--app-section)] py-14 min-[1024px]:py-20"
        aria-labelledby="services-heading"
      >
        <div className={frame}>
          <div className="grid gap-5 min-[900px]:grid-cols-[1fr_1fr] min-[900px]:gap-16">
            <h2 id="services-heading" className={heading}>
              An integration people
              <br className="hidden min-[900px]:block" /> can actually use.
            </h2>
            <p className={copy}>{businessCopy.commissioning}</p>
          </div>
          <div className="mt-10 grid gap-8 border-t border-[var(--app-border)] pt-8 min-[900px]:grid-cols-3 min-[900px]:gap-10">
            {capabilities.map((item) => (
              <article key={item.title}>
                <h3 className="font-heading text-[28px] leading-tight font-medium">
                  {item.title}
                </h3>
                <p className={`mt-4 ${copy}`}>{item.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section
        className="bg-[var(--app-muted-section)] py-14 min-[1024px]:py-20"
        aria-labelledby="delivery-heading"
      >
        <div className={frame}>
          <p className="font-caption text-xs text-[var(--app-label-text)]">
            Scoped engagements · delivery ownership
          </p>
          <h2 id="delivery-heading" className={`mt-4 ${heading}`}>
            From a useful workflow to a working integration.
          </h2>
          <ol className="mt-10 grid gap-8 min-[900px]:grid-cols-3 min-[900px]:gap-10">
            {engagements.map((item, index) => (
              <li
                key={item.title}
                className="border-t border-[var(--app-border)] pt-5"
              >
                <p className="font-caption text-xs text-[var(--app-label-text)]">
                  {index + 1} / Delivery
                </p>
                <h3 className="font-heading mt-3 text-[28px] font-medium leading-tight">
                  {item.title}
                </h3>
                <p className={`mt-4 ${copy}`}>{item.description}</p>
                <p className="mt-5 text-sm font-semibold leading-relaxed">
                  {item.output}
                </p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section
        id="evidence"
        className="bg-[var(--app-section)] py-14 min-[1024px]:py-20"
        aria-labelledby="evidence-heading"
      >
        <div className={frame}>
          <p className="font-caption text-xs text-[var(--app-label-text)]">
            Production work and product experiments
          </p>
          <h2 id="evidence-heading" className={`mt-4 ${heading}`}>
            The offer grows out of the work.
          </h2>
          <div className="mt-10 grid items-start gap-10 min-[900px]:grid-cols-2 min-[900px]:gap-16">
            <article className="rounded-2xl border border-[var(--app-border)] bg-[var(--app-card)] p-6 min-[900px]:p-8">
              <p className="font-caption text-xs text-[var(--app-label-text)]">
                Logically · commercial production work
              </p>
              <h3 className="font-heading mt-5 text-[34px] leading-[1.1] font-medium">
                AI connected to an analyst’s working tools.
              </h3>
              <p className={`mt-5 ${copy}`}>
                As Principal Engineer at Logically, Dave co-built the production
                Agentic Chat experience. It connected threat analysts to
                Databricks threat-analysis and person-lookup capabilities
                through MCP tools and a typed application API.
              </p>
              <p className="mt-5 text-sm leading-relaxed text-[var(--app-text-muted)]">
                Delivered during full-time employment, October 2024–May 2026.
                The case study covers the frontend rebuild, API boundaries and
                production AI interface.
              </p>
              <ExternalLink
                href={`${profileUrl}/client-work/logically`}
                className={`mt-5 ${textLink}`}
              >
                <span className="link-sweep-label">
                  Read the Logically case
                </span>
              </ExternalLink>
            </article>
            <div>
              {integrationEvidence.map((item) => (
                <article
                  key={item.name}
                  className="border-t border-[var(--app-border)] py-6 first:pt-0 first:border-0"
                >
                  <p className="font-caption text-[11px] leading-relaxed text-[var(--app-label-text)]">
                    {item.name} · {item.status}
                  </p>
                  <h3 className="font-heading mt-3 text-[27px] leading-tight font-medium">
                    {item.title}
                  </h3>
                  <p className={`mt-3 ${copy}`}>{item.description}</p>
                  <Link href={item.href} className={`mt-2 ${textLink}`}>
                    <span className="link-sweep-label">{item.action}</span>
                    <ArrowRight aria-hidden="true" className="size-4" />
                  </Link>
                </article>
              ))}
            </div>
          </div>
          <Link href="/products" className={`mt-7 ${textLink}`}>
            <span className="link-sweep-label">
              Explore all Applification products
            </span>
            <ArrowRight aria-hidden="true" className="size-4" />
          </Link>
        </div>
      </section>

      <section
        id="agencies"
        className="bg-[var(--app-muted-section)] py-14 min-[1024px]:py-20"
        aria-labelledby="agencies-heading"
      >
        <div
          className={`${frame} grid gap-8 min-[900px]:grid-cols-2 min-[900px]:gap-16`}
        >
          <div>
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              For agencies
            </p>
            <h2 id="agencies-heading" className={`mt-4 ${heading}`}>
              {businessCopy.agency}
            </h2>
            <p className={`mt-5 ${copy}`}>{businessCopy.agencyDescription}</p>
            <p className={`mt-4 ${copy}`}>
              Bring us in while defining the opportunity, or when you have a
              brief ready to build. Agree responsibilities, client communication
              and the handover with your delivery team.
            </p>
          </div>
          <aside className="self-center border-l-2 border-[var(--app-action)] pl-6">
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              A capability for your proposal
            </p>
            <blockquote className="font-heading mt-4 text-[28px] leading-[1.35]">
              {businessCopy.proposal}
            </blockquote>
            <p className="mt-5 text-sm leading-relaxed text-[var(--app-text-secondary)]">
              We tailor the scope to your client’s system, access rules and
              target assistant.
            </p>
          </aside>
        </div>
      </section>

      <section
        className="bg-[var(--app-section)] py-14 min-[1024px]:py-20"
        aria-labelledby="founder-heading"
      >
        <div
          className={`${frame} grid gap-10 min-[900px]:grid-cols-2 min-[900px]:gap-16`}
        >
          <div>
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              Founded by Dave Hudson
            </p>
            <h2 id="founder-heading" className={`mt-4 ${heading}`}>
              One accountable engineer,
              <br />
              from scope to delivery.
            </h2>
            <p className={`mt-5 ${copy}`}>
              Dave brings more than twenty years of product engineering across
              startups, health technology and public services. He shapes the
              integration, writes the code and stays responsible for the
              outcome.
            </p>
            <ExternalLink href={profileUrl} className={`mt-4 ${textLink}`}>
              <span className="link-sweep-label">
                Dave’s engineering profile & CV
              </span>
            </ExternalLink>
          </div>
          <div className="self-center rounded-2xl bg-[var(--app-muted-section)] p-6 min-[900px]:p-8">
            <h3 className="font-heading text-[32px] leading-tight font-medium">
              Where could an assistant help?
            </h3>
            <p className={`mt-4 mb-6 ${copy}`}>
              Tell us about the system, the people using it and the workflow you
              want to make easier. We’ll discuss what is worth connecting and a
              sensible first scope.
            </p>
            <ProjectAction contactAvailable={contactAvailable} />
          </div>
        </div>
      </section>
    </main>
  );
}
