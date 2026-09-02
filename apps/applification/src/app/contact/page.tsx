import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { notFound } from "next/navigation";
import { ContactWorkspace } from "@/components/contact/contact-workspace";
import {
  isContactWorkflowAvailable,
  parseContactProduct,
  parseContactRoute,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "Contact Dave Hudson",
  description:
    "Prepare a contract, product or general enquiry with an AI-assisted brief that you review before sending.",
  alternates: { canonical: "/contact" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Contact Dave Hudson | Applification",
    description:
      "Prepare a checked enquiry and review every detail before it reaches Dave.",
    url: "/contact",
  },
};

export default async function ContactPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  if (!isContactWorkflowAvailable()) {
    notFound();
  }

  const query = await searchParams;
  const route = parseContactRoute(query.route);
  const product = parseContactProduct(query.product);

  return (
    <main className="flex flex-1 flex-col overflow-x-clip">
      <ContactWorkspace initialProduct={product ?? undefined} initialRoute={route} />
    </main>
  );
}
