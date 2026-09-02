import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { notFound } from "next/navigation";
import { WritingArticle } from "@/components/writing/writing-article";
import { getWriting, getWritingBySlug } from "@/lib/writing";

type WritingArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriting({ includeDrafts: false }).map((entry) => ({
    slug: entry.slug,
  }));
}

export async function generateMetadata({
  params,
}: WritingArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const entry = getWritingBySlug(slug, { includeDrafts: false });

  if (!entry) {
    return {};
  }

  return {
    title: entry.title,
    description: entry.summary,
    alternates: { canonical: `/writing/${entry.slug}` },
    openGraph: {
      ...defaultOpenGraph,
      type: "article",
      title: entry.title,
      description: entry.summary,
      publishedTime: entry.date,
      modifiedTime: entry.updated,
      tags: entry.topics,
      url: `/writing/${entry.slug}`,
    },
  };
}

export default async function WritingArticlePage({ params }: WritingArticlePageProps) {
  const { slug } = await params;
  const entries = getWriting({ includeDrafts: false });
  const index = entries.findIndex((entry) => entry.slug === slug);

  if (index === -1) {
    notFound();
  }

  const entry = entries[index];
  const entryTopics = new Set(
    entry.topics.filter((topic) => topic !== "weeknote"),
  );
  const topicalRelated = entries
    .filter((candidate) => candidate.slug !== entry.slug)
    .map((candidate) => ({
      candidate,
      score: candidate.topics.filter((topic) => entryTopics.has(topic)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort(
      (left, right) =>
        right.score - left.score ||
        right.candidate.date.localeCompare(left.candidate.date),
    )
    .map(({ candidate }) => candidate);
  const related = [
    ...topicalRelated,
    entries[index - 1],
    entries[index + 1],
  ]
    .filter(
      (candidate, candidateIndex, candidates) =>
        candidate &&
        candidate.slug !== entry.slug &&
        candidates.findIndex((item) => item?.slug === candidate.slug) ===
          candidateIndex,
    )
    .slice(0, 2);

  return (
    <WritingArticle
      entry={entry}
      newer={entries[index - 1]}
      older={entries[index + 1]}
      related={related}
    />
  );
}
