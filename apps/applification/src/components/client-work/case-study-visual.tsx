import { ExternalLink } from "@/components/external-link";
import Image from "next/image";

export const caseStudyVisuals = {
  logically: {
    name: "Logically Intelligence",
    src: "/images/client-work/logically-intelligence.webp",
    width: 2880,
    height: 1498,
    alt: "Logically Intelligence showing narrative clusters and a network of connected accounts, content and organisations.",
    caption: "The Intelligence interface used to explore narratives and their connections.",
    sourceHref: "https://logically.ai/products/logically-intelligence",
    sourceLabel: "Product image from Logically",
  },
  eruptiv: {
    name: "Client Server",
    src: "/images/client-work/client-server-filtered-results.jpg",
    width: 1713,
    height: 936,
    alt: "Client Server’s recruitment interface with permanent and fully remote filters selected alongside three vacancy cards.",
    caption: "The candidate job-search experience on Client Server’s live site, captured September 2026.",
    sourceHref: "https://www.client-server.com/job-search",
    sourceLabel: "View Client Server",
  },
  pando: {
    name: "Pando Control",
    src: "/images/client-work/pando-control-overview.jpg",
    width: 1440,
    height: 900,
    alt: "Pando Control overview design with organisation navigation, active-user and messaging charts, and hourly activity.",
    caption: "Pando Control overview. Design reference showing usage and activity, captured from the original Figma file.",
    sourceHref: null,
    sourceLabel: "Pando Control · design reference",
  },
} as const;

export function CaseStudyVisual({ project }: { project: keyof typeof caseStudyVisuals }) {
  const visual = caseStudyVisuals[project];
  return (
    <figure className="mt-10 min-w-0">
      <a href={visual.src} aria-label={`Open full-size ${visual.name} screenshot`} className="block overflow-hidden rounded-2xl border border-[var(--app-border)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]">
        <Image src={visual.src} alt={visual.alt} width={visual.width} height={visual.height} sizes="(min-width: 1296px) 1200px, (min-width: 720px) calc(100vw - 96px), calc(100vw - 48px)" className="h-auto w-full" />
      </a>
      <figcaption className="mt-3 flex flex-col gap-1 text-sm leading-relaxed text-[var(--app-text-secondary)] min-[720px]:flex-row min-[720px]:items-center min-[720px]:justify-between min-[720px]:gap-6">
        <span>{visual.caption}</span>
        {visual.sourceHref ? <ExternalLink href={visual.sourceHref} className="link-sweep inline-flex min-h-11 shrink-0 items-center text-[var(--app-label-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"><span className="link-sweep-label">{visual.sourceLabel}</span></ExternalLink> : null}
      </figcaption>
    </figure>
  );
}
