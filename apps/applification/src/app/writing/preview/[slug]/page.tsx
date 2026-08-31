import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { WritingArticle } from "@/components/writing/writing-article";
import { getWritingBySlug } from "@/lib/writing";

type WritingPreviewPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Writing preview",
  robots: { follow: false, index: false },
};

export default async function WritingPreviewPage({
  params,
}: WritingPreviewPageProps) {
  if (process.env.NODE_ENV === "production") {
    notFound();
  }

  const { slug } = await params;
  const entry = getWritingBySlug(slug, { includeDrafts: true });

  if (!entry) {
    notFound();
  }

  return <WritingArticle entry={entry} preview />;
}
