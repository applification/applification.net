import { PageHero } from "@/components/page-hero";
import { InfoLink, InfoSection } from "@/components/agent-info/info-layout";
import { ExternalLink } from "@/components/external-link";
import { infoLinkClass } from "@/components/agent-info/info-layout";
import { personalLinkedInUrl } from "@/lib/contract-positioning";

import { privacyCopy, privacyUpdated } from "@/lib/content/privacy";
export { privacyUpdated } from "@/lib/content/privacy";

export function PrivacyPage() {
  return (
    <main className="flex-1">
      <PageHero
        density="compact"
        eyebrow="Privacy"
        eyebrowDetail={`Updated ${privacyUpdated}`}
        headingId="privacy-heading"
        title={privacyCopy.title}
        description={privacyCopy.description}
        aside={
          <aside
            className="space-y-2 border-l-2 border-[var(--app-action)] pl-6"
            aria-label="Privacy summary"
          >
            <p className="font-caption text-xs text-[var(--app-label-text)]">
              In short
            </p>
            <p className="text-[var(--app-text-secondary)]">
              Reading the site is anonymous. Enquiries go to Dave by email after
              you review and send them.
            </p>
            <div className="flex flex-col items-start">
              <InfoLink href="/about">Contact routes</InfoLink>
              <InfoLink href="/agents">Public API and agents</InfoLink>
            </div>
          </aside>
        }
      />

      {privacyCopy.sections.map(section => (
        <InfoSection id={section.id} title={section.title} key={section.id}>
          {section.blocks.map((block, index) => block.kind === "paragraph" ? (
            <p className="max-w-[65ch]" key={index}>{block.text}</p>
          ) : (
            <ul className="max-w-[65ch] list-disc space-y-2 pl-5" key={index}>
              {block.items.map(item => <li key={item}>{item}</li>)}
            </ul>
          ))}
          {section.id === "rights" ? (
            <div className="flex flex-wrap gap-x-6">
              <InfoLink href="/about">Contact routes</InfoLink>
              <ExternalLink className={infoLinkClass} href={personalLinkedInUrl}>
                <span className="link-sweep-label">LinkedIn</span>
              </ExternalLink>
            </div>
          ) : null}
        </InfoSection>
      ))}
    </main>
  );
}
