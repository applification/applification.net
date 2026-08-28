"use client";

import { Search } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import type { WritingEntry, WritingType } from "@/lib/writing";

export type WritingArchiveEntry = Omit<WritingEntry, "body">;

type WritingArchiveProps = {
  entries: WritingArchiveEntry[];
  topics: string[];
};

function formatTopic(topic: string) {
  if (topic === "ai") return "AI";
  if (topic === "next.js") return "Next.js";
  return topic
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function formatArchiveDate(date: string) {
  return date.replaceAll("-", ".");
}

export function WritingArchive({ entries, topics }: WritingArchiveProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const typeParam = searchParams.get("type");
  const selectedType: WritingType | null =
    typeParam === "post" || typeParam === "weeknote" ? typeParam : null;
  const selectedYear = searchParams.get("year") ?? "";
  const selectedTopic = searchParams.get("topic") ?? "";
  const query = searchParams.get("q") ?? "";
  const showAll = searchParams.get("show") === "all";
  const years = [...new Set(entries.map((entry) => entry.date.slice(0, 4)))];
  const postCount = entries.filter((entry) => entry.type === "post").length;
  const weeknoteCount = entries.length - postCount;

  const filteredEntries = entries.filter((entry) => {
    const searchTarget = `${entry.title} ${entry.summary} ${entry.topics.join(" ")}`.toLowerCase();
    return (
      (!selectedType || entry.type === selectedType) &&
      (!selectedYear || entry.date.startsWith(selectedYear)) &&
      (!selectedTopic || entry.topics.includes(selectedTopic)) &&
      (!query || searchTarget.includes(query.toLowerCase()))
    );
  });
  const visibleEntries = showAll ? filteredEntries : filteredEntries.slice(0, 8);

  function updateParams(updates: Record<string, string | null>) {
    const nextParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(updates)) {
      if (value) nextParams.set(key, value);
      else nextParams.delete(key);
    }
    router.replace(`${pathname}${nextParams.size ? `?${nextParams}` : ""}`, {
      scroll: false,
    });
  }

  const filterClass =
    "font-caption inline-flex min-h-[30px] items-center rounded-full border px-3 text-[9px] font-bold tracking-[0.6px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)]";

  return (
    <section
      aria-labelledby="writing-index-heading"
      className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12 min-[1024px]:py-[70px] min-[1440px]:px-[120px]"
      id="writing-index"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-7">
        <div className="grid gap-7 min-[860px]:grid-cols-[minmax(0,760px)_300px] min-[860px]:items-end min-[860px]:justify-between">
          <div className="flex flex-col gap-2.5">
            <p className="font-caption text-[11px] font-bold tracking-[1.1px] text-[var(--writing-accent-text)]">
              WRITING INDEX
            </p>
            <h2
              className="font-heading text-[38px] leading-[1.08] font-medium text-[var(--app-text-primary)] min-[720px]:text-[42px]"
              id="writing-index-heading"
            >
              Every post, in one place.
            </h2>
            <p className="max-w-[690px] text-[15px] leading-[1.55] text-[var(--app-text-secondary)]">
              The site builds this index from Markdown in Git. Filter by format,
              year or topic.
            </p>
          </div>
          <dl className="grid grid-cols-3 gap-4 min-[860px]:gap-[30px]">
            {[
              [entries.length, "Entries"],
              [postCount, "Posts"],
              [weeknoteCount, "Weeknotes"],
            ].map(([value, label]) => (
              <div className="flex flex-col gap-1" key={label}>
                <dd className="font-heading text-[28px] font-medium text-[var(--app-text-primary)]">
                  {value}
                </dd>
                <dt className="font-caption text-[9px] font-bold tracking-[0.7px] text-[var(--app-text-muted)] uppercase">
                  {label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-4 min-[960px]:flex-row min-[960px]:items-center min-[960px]:justify-between">
          <div className="flex flex-wrap items-center gap-2">
            {[
              [null, `All ${entries.length}`],
              ["post", `Posts ${postCount}`],
              ["weeknote", `Weeknotes ${weeknoteCount}`],
            ].map(([value, label]) => {
              const active = selectedType === value || (!selectedType && value === null);
              return (
                <button
                  aria-pressed={active}
                  className={`${filterClass} ${
                    active
                      ? "border-[var(--writing-accent-fill)] bg-[var(--writing-accent-fill)] text-[var(--writing-on-accent)]"
                      : "border-[var(--app-border)] text-[var(--app-text-secondary)] hover:border-[var(--writing-accent-text)]"
                  }`}
                  key={label}
                  onClick={() => updateParams({ type: value, show: null })}
                  type="button"
                >
                  {label}
                </button>
              );
            })}

            <select
              aria-label="Filter writing by year"
              className={`${filterClass} border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-secondary)]`}
              onChange={(event) => updateParams({ year: event.target.value, show: null })}
              value={selectedYear}
            >
              <option value="">Any year</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>

            <select
              aria-label="Filter writing by topic"
              className={`${filterClass} max-w-[180px] border-[var(--app-border)] bg-[var(--app-card)] text-[var(--app-text-secondary)]`}
              onChange={(event) => updateParams({ topic: event.target.value, show: null })}
              value={selectedTopic}
            >
              <option value="">Any topic</option>
              {topics.map((topic) => (
                <option key={topic} value={topic}>
                  {formatTopic(topic)}
                </option>
              ))}
            </select>
          </div>

          <label className="flex min-h-10 w-full items-center gap-2 rounded-full border border-[var(--app-border)] bg-[var(--app-card)] px-4 text-[var(--app-text-muted)] focus-within:outline-2 focus-within:outline-offset-2 focus-within:outline-[var(--app-focus)] min-[960px]:w-[270px]">
            <Search aria-hidden="true" size={14} />
            <span className="sr-only">Search titles or topics</span>
            <input
              className="min-w-0 flex-1 bg-transparent text-[13px] text-[var(--app-text-primary)] outline-none placeholder:text-[var(--app-text-muted)]"
              onChange={(event) => updateParams({ q: event.target.value, show: null })}
              placeholder="Search titles or topics"
              type="search"
              value={query}
            />
          </label>
        </div>

        <div className="overflow-hidden rounded-[14px] bg-[var(--app-card)]">
          <div className="hidden grid-cols-[90px_94px_minmax(260px,1fr)_296px_88px] bg-[var(--app-muted-section)] px-7 py-3 min-[860px]:grid">
            {["Date", "Type", "Title", "Topics", "Read"].map((heading) => (
              <span
                className="font-caption text-[9px] font-bold tracking-[0.7px] text-[var(--app-text-muted)] uppercase"
                key={heading}
              >
                {heading}
              </span>
            ))}
          </div>

          {visibleEntries.length ? (
            <ol>
              {visibleEntries.map((entry) => (
                <li
                  className="border-t border-[var(--app-border)] first:border-t-0 min-[860px]:first:border-t"
                  key={entry.slug}
                >
                  <Link
                    className="group grid min-h-[60px] gap-2 px-5 py-5 focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-[var(--app-focus)] min-[860px]:grid-cols-[90px_94px_minmax(260px,1fr)_296px_88px] min-[860px]:items-center min-[860px]:gap-0 min-[860px]:px-7 min-[860px]:py-0"
                    href={`/writing/${entry.slug}`}
                  >
                    <time
                      className="font-caption text-[10px] font-semibold text-[var(--app-text-muted)]"
                      dateTime={entry.date}
                    >
                      {formatArchiveDate(entry.date)}
                    </time>
                    <span className="font-caption text-[10px] font-bold text-[var(--writing-accent-text)] uppercase">
                      {entry.type}
                    </span>
                    <span className="font-heading text-[19px] leading-[1.2] font-semibold text-[var(--app-text-primary)] transition-colors group-hover:text-[var(--writing-accent-text)] motion-reduce:transition-none">
                      {entry.title}
                    </span>
                    <span className="font-caption truncate text-[9px] font-medium tracking-[0.4px] text-[var(--app-text-secondary)] uppercase">
                      {entry.topics.slice(0, 4).map(formatTopic).join(" · ")}
                    </span>
                    <span className="font-caption text-[10px] font-semibold text-[var(--app-text-muted)]">
                      {entry.readingTime} MIN
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          ) : (
            <p className="px-6 py-12 text-center text-sm text-[var(--app-text-secondary)]">
              No writing matches those filters.
            </p>
          )}
        </div>

        <div className="flex min-h-9 items-center justify-between gap-5 font-caption text-[10px] font-semibold text-[var(--app-text-muted)]">
          <p>
            Showing {visibleEntries.length} of {filteredEntries.length} matching entries
          </p>
          {filteredEntries.length > 8 ? (
            <button
              className="min-h-11 font-bold tracking-[0.5px] text-[var(--writing-accent-text)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--app-focus)]"
              onClick={() => updateParams({ show: showAll ? null : "all" })}
              type="button"
            >
              {showAll ? "SHOW NEWEST 8 ↑" : `SHOW ALL ${filteredEntries.length} ↓`}
            </button>
          ) : null}
        </div>
      </div>
    </section>
  );
}
