import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/page-hero";
import { InfoSection, infoLinkClass } from "@/components/agent-info/info-layout";
import { notFoundLinks } from "@/lib/not-found";

export const metadata: Metadata = {
  title: "Page not found",
  robots: { index: false, follow: true },
};

export default function NotFound() {
  return (
    <main className="flex-1">
      <PageHero
        density="compact"
        eyebrow="404"
        eyebrowDetail="Page not found"
        headingId="not-found-heading"
        title="Nothing is published here."
        description="The address may have changed or never existed. The links below cover everything on the site."
        aside={
          <aside
            className="space-y-2 border-l-2 border-[var(--app-action)] pl-6"
            aria-label="Agent resources"
          >
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              Using an agent?
            </p>
            <p className="text-[var(--app-text-secondary)]">
              Request this address without a text/html Accept header for a
              Markdown 404 with the same links.
            </p>
          </aside>
        }
      />
      <InfoSection id="not-found-links" title="Where to look next">
        <ul className="flex flex-col items-start">
          {notFoundLinks.map(({ href, label, detail }) => (
            <li key={href} className="flex flex-wrap items-baseline gap-x-3">
              <Link className={infoLinkClass} href={href}>
                <span className="link-sweep-label">{label}</span>
              </Link>
              <span className="text-[15px]">{detail}</span>
            </li>
          ))}
        </ul>
      </InfoSection>
    </main>
  );
}
