import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentPage } from "@/components/agent-info/agent-page";
import { getPageMarkdown } from "@/lib/page-markdown.server";
import { markdownPath } from "@/lib/page-view";

type Props = { params: Promise<{ path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path = [] } = await params;
  const page = getPageMarkdown(`/${path.join("/")}`);
  if (!page) notFound();
  return {
    title: `${page.title} — Agent view`,
    alternates: { canonical: page.path, types: { "text/markdown": markdownPath(page.path) } },
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { path = [] } = await params;
  const page = getPageMarkdown(`/${path.join("/")}`);
  if (!page) notFound();
  return <AgentPage {...page} />;
}
