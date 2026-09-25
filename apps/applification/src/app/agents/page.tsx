import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { AgentsPage } from "@/components/agent-info/agents-page";
import { Toaster } from "@/components/ui/sonner";
import { defaultOpenGraph } from "@/lib/social-metadata";

const description =
  "Explore Dave Hudson’s work with ChatGPT or Claude. Copy a starter prompt, read page Markdown, or use the API docs, WebMCP tools and free developer sandbox.";

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
      <Toaster />
    </>
  );
}
