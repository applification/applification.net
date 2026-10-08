import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AgentPage } from "@/components/agent-info/agent-page";
import { getPageMarkdown } from "@/lib/page-markdown.server";
import { markdownPath } from "@/lib/page-view";
import { getSiteIdentity } from "@/lib/site-identity.server";
import { contentOrigin, siteOrigin } from "@/lib/site-identity";

type Props = { params: Promise<{ path?: string[] }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { path = [] } = await params;
  const site = await getSiteIdentity();
  const page = getPageMarkdown(`/${path.join("/")}`, site);
  if (!page) notFound();
  return {
    title: `${page.title} — Agent view`,
    alternates: { canonical: `${["/", "/agents"].includes(page.path) ? siteOrigin(site) : contentOrigin(page.path)}${page.path}`, types: { "text/markdown": markdownPath(page.path) } },
    robots: { index: false, follow: true },
  };
}

export default async function Page({ params }: Props) {
  const { path = [] } = await params;
  const page = getPageMarkdown(`/${path.join("/")}`, await getSiteIdentity());
  if (!page) notFound();
  return <AgentPage {...page} />;
}
