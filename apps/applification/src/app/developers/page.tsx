import type { Metadata } from "next";
import { DevelopersPage } from "@/components/agent-info/developers-page";
import { defaultOpenGraph } from "@/lib/social-metadata";

const title = "Applification Developer Documentation: API, MCP server, SDKs and CLI";
const description =
  "Applification developer documentation. Read Dave Hudson's public profile, client work, writing and products through a free MCP server, REST API with OpenAPI 3.1, TypeScript and Python SDKs, or the CLI. No API key.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/developers" },
  openGraph: {
    ...defaultOpenGraph,
    title,
    description,
    url: "/developers",
  },
};

export default DevelopersPage;
