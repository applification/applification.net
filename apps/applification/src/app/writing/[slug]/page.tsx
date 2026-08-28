import type { Metadata } from "next";
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

  return (
    <WritingArticle
      entry={entries[index]}
      newer={entries[index - 1]}
      older={entries[index + 1]}
    />
  );
}
