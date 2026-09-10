import { PageHero } from "@/components/page-hero";
import { InfoLink, InfoSection } from "@/components/agent-info/info-layout";
import { ExternalLink } from "@/components/external-link";
import { infoLinkClass } from "@/components/agent-info/info-layout";
import { personalLinkedInUrl } from "@/lib/contract-positioning";

export const privacyUpdated = "10 September 2026";

export function PrivacyPage() {
  return (
    <main className="flex-1">
      <PageHero
        density="compact"
        eyebrow="Privacy"
        eyebrowDetail={`Updated ${privacyUpdated}`}
        headingId="privacy-heading"
        title="What this site does with your data."
        description="Applification Ltd is a UK company run by Dave Hudson. This site publishes information about his work. It has no accounts, no tracking cookies and no advertising. The only personal data it handles is what you choose to send through the contact page."
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

      <InfoSection id="reading" title="Reading the site">
        <p className="max-w-[65ch]">
          Pages, the public API and the agent guides are served without
          accounts, API keys or cookies. Vercel hosts the site and keeps short
          lived request logs, including IP addresses, to run and protect the
          service.
        </p>
        <p className="max-w-[65ch]">
          Vercel Web Analytics records page views and the referring page. It
          does not set cookies and does not build a profile that follows you to
          other sites.
        </p>
        <p className="max-w-[65ch]">
          Your light or dark theme choice is stored in your browser only.
          Embedded videos use YouTube&rsquo;s privacy-enhanced player and load
          nothing until you press play.
        </p>
      </InfoSection>

      <InfoSection id="contact" title="Sending an enquiry">
        <p className="max-w-[65ch]">
          The contact page is optional. When it is enabled, you write a brief
          and can add your name, reply email, company, timing and working
          arrangement. An AI assistant may help tidy the brief; the model
          provider receives only the text you enter in that step.
        </p>
        <p className="max-w-[65ch]">
          You can attach one contract brief of up to 4 MB. It is stored in a
          private file store and linked only from the delivered email.
        </p>
        <p className="max-w-[65ch]">
          Nothing is sent until you review the finished enquiry and give
          consent. Delivery is by email through Resend to Dave&rsquo;s inbox.
          Bot detection and a rate limit protect the form; the rate limit
          keeps a hashed, not readable, form of your network address for a
          short time.
        </p>
        <p className="max-w-[65ch]">
          Enquiries are used only to reply to you and to discuss the work you
          describe. They are not sold, shared for marketing, or exposed through
          the public API.
        </p>
      </InfoSection>

      <InfoSection id="services" title="Services used">
        <ul className="max-w-[65ch] list-disc space-y-2 pl-5">
          <li>Vercel: hosting, request logs, bot detection, analytics and the private file store.</li>
          <li>Resend: email delivery for enquiries.</li>
          <li>An AI model accessed through Vercel AI Gateway: optional help preparing an enquiry.</li>
          <li>YouTube (privacy-enhanced mode): video embeds in some articles.</li>
        </ul>
        <p className="max-w-[65ch]">
          Each provider processes data on Applification&rsquo;s instructions
          under its own terms. Some run outside the UK under standard data
          transfer safeguards.
        </p>
      </InfoSection>

      <InfoSection id="rights" title="Your rights and questions">
        <p className="max-w-[65ch]">
          Applification Ltd is the data controller under UK GDPR. Enquiry data
          is processed because you asked for a reply, and kept for as long as
          the conversation and any resulting work need it. You can ask what is
          held about you, ask for it to be corrected or deleted, or withdraw
          consent, and you can complain to the Information Commissioner&rsquo;s
          Office.
        </p>
        <p className="max-w-[65ch]">
          Send privacy questions through the routes on the about page or by
          message on LinkedIn. No email address is published on this site.
        </p>
        <div className="flex flex-wrap gap-x-6">
          <InfoLink href="/about">Contact routes</InfoLink>
          <ExternalLink className={infoLinkClass} href={personalLinkedInUrl}>
            <span className="link-sweep-label">LinkedIn</span>
          </ExternalLink>
        </div>
      </InfoSection>
    </main>
  );
}
