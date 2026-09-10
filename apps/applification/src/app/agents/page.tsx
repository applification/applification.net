import type { Metadata } from "next";
import { AgentsPage } from "@/components/agent-info/agents-page";
import { defaultOpenGraph } from "@/lib/social-metadata";

const description =
  "Give your agent context about Dave Hudson and Applification. Read public profile and product information through WebMCP tools or the catalog API.";

export const metadata: Metadata = {
  title: "Agents and developer API",
  description,
  alternates: { canonical: "/agents" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Agents and developer API | Applification",
    description,
    url: "/agents",
  },
};

export default AgentsPage;
