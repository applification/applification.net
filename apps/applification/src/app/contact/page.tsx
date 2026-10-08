import type { Metadata } from "next";
import { defaultOpenGraph, profileOpenGraph } from "@/lib/social-metadata";
import { notFound } from "next/navigation";
import { ContactWorkspace } from "@/components/contact/contact-workspace";
import { TooltipProvider } from "@/components/ui/tooltip";
import { getSiteIdentity } from "@/lib/site-identity.server";
import {
  isContactWorkflowAvailable,
  parseContactProduct,
  parseContactRoute,
} from "@/lib/contact";

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSiteIdentity();
  return {
    title: site === "business" ? "Discuss a project" : "Discuss a contract",
    description: site === "profile"
      ? "Prepare a contract enquiry for Dave Hudson and review the brief before sending."
      : "Discuss an MCP integration or product enquiry with Applification and review the brief before sending.",
    alternates: { canonical: "/contact" },
    openGraph: {
      ...(site === "profile" ? profileOpenGraph : defaultOpenGraph),
      title:
        site === "business"
          ? "Discuss a project | Applification"
          : "Discuss a contract | Dave Hudson",
      description:
        "Prepare a checked enquiry and review every detail before it reaches Dave.",
      url: "/contact",
    },
  };
}

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isContactWorkflowAvailable()) {
    notFound();
  }

  const query = await searchParams;
  const site = await getSiteIdentity();
  const route =
    parseContactRoute(query.route) ??
    (site === "business" ? "general" : "contract");
  const product = parseContactProduct(query.product);

  return (
    <main id="main-content" className="flex flex-1 flex-col overflow-x-clip">
      <TooltipProvider>
        <ContactWorkspace
          site={site}
          initialProduct={product ?? undefined}
          initialRoute={route}
        />
      </TooltipProvider>
    </main>
  );
}
