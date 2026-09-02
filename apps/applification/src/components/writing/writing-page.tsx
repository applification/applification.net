import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";
import { PageHero } from "@/components/page-hero";
import type { WritingEntry } from "@/lib/writing";
import { WritingArchive, type WritingArchiveEntry } from "./writing-archive";
import {
  displayWritingTopics,
  formatWritingTopic,
  WritingTopicBadge,
} from "./writing-topic";

type WritingPageProps = {
  entries: WritingEntry[];
  topics: string[];
};

const topicShortcuts = [
  ["AI & agents", "ai"],
  ["Product engineering", "typescript"],
  ["React & Next.js", "react"],
  ["Developer tools", "developer-tools"],
] as const;

function formatDate(date: string) {
  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(`${date}T00:00:00Z`));
}

function WritingHero() {
  return (
    <PageHero
      aside={
        <nav
          aria-label="Browse writing by topic"
          className="w-full rounded-[18px] bg-[var(--app-card)] p-6 min-[1024px]:w-[330px] min-[1024px]:self-end"
        >
          <p className="font-caption text-[10px] font-bold tracking-[1.2px] text-[var(--writing-accent-text)]">
            BROWSE BY TOPIC
          </p>
          <ul className="mt-3.5 flex flex-col">
            {topicShortcuts.map(([label, topic]) => (
              <li className="border-b border-[var(--app-border)] last:border-0" key={topic}>
                <Link
                  className="group flex min-h-11 items-center gap-3 text-base font-semibold text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)]"
                  href={`/writing?topic=${encodeURIComponent(topic)}#writing-index`}
                >
                  <span className="font-caption text-[10px] font-bold text-[var(--app-text-muted)]">
                    #
                  </span>
                  <span className="transition-colors group-hover:text-[var(--writing-accent-text)] motion-reduce:transition-none">
                    {label}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      }
      description={
        <p className="max-w-[690px]">
          Practical notes on working with coding agents, shipping my own
          products and revisiting older technical posts that still hold up.
        </p>
      }
      eyebrow="WRITING"
      eyebrowClassName="text-[var(--writing-accent-text)]"
      eyebrowDetail="FIELD NOTES FROM THE WORK"
      headingId="writing-page-heading"
      title="Notes from agent loops, product builds and real constraints."
    />
  );
}

function FeaturedWriting({ entry }: { entry: WritingEntry }) {
  return (
    <section className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[82px] min-[1440px]:px-[120px]">
      <article
        className="mx-auto grid w-full max-w-[1200px] gap-10 rounded-[22px] bg-[var(--app-muted-section)] p-7 min-[720px]:p-[38px] min-[960px]:grid-cols-[minmax(0,760px)_250px] min-[960px]:items-center min-[960px]:justify-between min-[960px]:gap-12"
        data-featured-writing
      >
        <div className="flex min-w-0 flex-col gap-4">
          <p className="font-caption text-[10px] font-bold tracking-[1px] text-[var(--writing-accent-text)]">
            {entry.type === "weeknote" ? "WEEKNOTE" : "FIELD NOTE"}
            &nbsp; · &nbsp;{formatDate(entry.date).toUpperCase()}&nbsp; · &nbsp;
            {entry.readingTime} MIN READ
          </p>
          <h2 className="font-heading max-w-[760px] text-[36px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[720px]:text-[40px]">
            <Link
              className="link-sweep focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
              href={`/writing/${entry.slug}`}
            >
              <span className="link-sweep-label">{entry.title}</span>
            </Link>
          </h2>
          <p className="max-w-[700px] text-base leading-[1.58] text-[var(--app-text-secondary)]">
            {entry.summary}
          </p>
          <ul className="flex flex-wrap gap-2 pt-1" aria-label="Featured entry topics">
            {displayWritingTopics(entry.topics).slice(0, 4).map((topic) => (
              <li key={topic}>
                <WritingTopicBadge topic={topic} />
              </li>
            ))}
          </ul>
        </div>

        <Link
          className="group flex min-h-[190px] flex-col justify-between rounded-[16px] bg-[var(--client-feature-strong)] p-6 text-[var(--client-feature-text)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)] min-[960px]:min-h-[250px]"
          href={`/writing/${entry.slug}`}
        >
          <p className="font-caption text-sm leading-[1.55] font-semibold text-[var(--client-feature-accent)]">
            [ {entry.type === "weeknote" ? "WEEKNOTE" : "FIELD NOTE"} ]
            <br />
            <br />
            {displayWritingTopics(entry.topics)
              .slice(0, 3)
              .map(formatWritingTopic)
              .join(" → ")}
          </p>
          <span className="font-caption inline-flex items-center gap-2 text-[10px] font-bold tracking-[0.8px] text-[var(--client-feature-accent)]">
            READ {entry.type === "weeknote" ? "WEEKNOTE" : "FIELD NOTE"}
            <ArrowUpRight
              aria-hidden="true"
              className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 motion-reduce:transition-none"
              size={14}
            />
          </span>
        </Link>
      </article>
    </section>
  );
}

function RecentWriting({ entries }: { entries: WritingEntry[] }) {
  return (
    <section
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[84px] min-[1440px]:px-[120px]"
      data-writing-section="recent"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-[34px]">
        <div className="flex flex-col gap-4 min-[760px]:flex-row min-[760px]:items-end min-[760px]:justify-between">
          <div className="flex flex-col gap-2">
            <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--writing-accent-text)]">
              LATEST FIELD NOTES
            </p>
            <h2 className="font-heading text-[38px] leading-none font-medium text-[var(--app-text-primary)] min-[720px]:text-[44px]">
              What I&apos;m learning now
            </h2>
          </div>
          <p className="text-[17px] text-[var(--app-text-secondary)]">
            No schedule. Just notes worth keeping.
          </p>
        </div>

        <div className="flex flex-col gap-2.5">
          {entries.map((entry) => (
            <article
              className="grid gap-4 rounded-[14px] bg-[var(--app-card)] p-5 min-[760px]:grid-cols-[88px_minmax(0,1fr)_76px] min-[760px]:items-center min-[760px]:gap-7 min-[760px]:px-7 min-[760px]:py-[26px]"
              key={entry.slug}
            >
              <time
                className="font-caption text-[10px] leading-[1.45] font-bold tracking-[0.6px] text-[var(--app-text-muted)] uppercase"
                dateTime={entry.date}
              >
                {formatDate(entry.date)}
              </time>
              <div className="min-w-0">
                <h3 className="font-heading text-[23px] leading-[1.16] font-medium text-[var(--app-text-primary)] min-[720px]:text-[25px]">
                  <Link
                    className="hover:text-[var(--writing-accent-text)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)]"
                    href={`/writing/${entry.slug}`}
                  >
                    {entry.title}
                  </Link>
                </h3>
                <p className="font-caption mt-2 text-[11px] font-semibold tracking-[0.6px] text-[var(--writing-accent-text)] uppercase">
                  {displayWritingTopics(entry.topics)
                    .slice(0, 4)
                    .map(formatWritingTopic)
                    .join(" · ")}
                </p>
              </div>
              <Link
                aria-label={`Read ${entry.title}, ${entry.readingTime} minute read`}
                className="font-caption inline-flex min-h-11 items-center justify-between gap-3 text-xs font-bold text-[var(--app-text-primary)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[var(--app-focus)] min-[760px]:flex-col min-[760px]:items-end min-[760px]:justify-center"
                href={`/writing/${entry.slug}`}
              >
                <span className="text-[11px] font-semibold text-[var(--app-text-muted)]">
                  {entry.readingTime} MIN
                </span>
                <span>READ ↗</span>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WritingPage({ entries, topics }: WritingPageProps) {
  const featured = entries.find((entry) => entry.featured) ?? entries[0];
  const recent = entries.filter((entry) => entry.slug !== featured?.slug).slice(0, 3);
  const archiveEntries: WritingArchiveEntry[] = entries.map((entry) => ({
    title: entry.title,
    date: entry.date,
    type: entry.type,
    summary: entry.summary,
    topics: entry.topics,
    featured: entry.featured,
    draft: entry.draft,
    slug: entry.slug,
    legacyId: entry.legacyId,
    updated: entry.updated,
    readingTime: entry.readingTime,
  }));

  return (
    <main className="flex-1">
      <WritingHero />
      {featured ? <FeaturedWriting entry={featured} /> : null}
      <RecentWriting entries={recent} />
      <Suspense fallback={<div className="min-h-[720px] bg-[var(--app-section)]" />}>
        <WritingArchive entries={archiveEntries} topics={topics} />
      </Suspense>
    </main>
  );
}
