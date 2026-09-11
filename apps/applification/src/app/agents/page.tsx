import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { AgentsPage } from "@/components/agent-info/agents-page";
import { defaultOpenGraph } from "@/lib/social-metadata";

const description =
  "Applification API docs and developer resources for agents: OpenAPI 3.1 reference, WebMCP tools and a free, keyless sandbox for reading Dave Hudson's public profile and product information.";

export const metadata: Metadata = {
  title: "Agents & API docs",
  description,
  alternates: { canonical: "/agents" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Agents & API docs | Applification",
    description,
    url: "/agents",
  },
};

export default function AgentsRoute() {
  return (
    <>
      <StructuredData data={breadcrumbStructuredData([{ name: "Agents", path: "/agents" }])} />
      <AgentsPage />
    </>
  );
}
