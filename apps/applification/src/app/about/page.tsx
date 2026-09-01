import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AboutPage as AboutPageContent } from "@/components/about/about-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";
import { buildContactHref, parseContactProduct, parseContactRoute } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About Dave Hudson",
  description: contractPositioningDescriptions.about,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Dave Hudson | Applification",
    description: contractPositioningDescriptions.about,
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "About Dave Hudson | Applification",
    description: contractPositioningDescriptions.about,
  },
};

export default async function AboutPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const query = await searchParams;
  const route = parseContactRoute(query.route);
  const product = parseContactProduct(query.product);

  if (route || product) {
    redirect(buildContactHref({ product: product ?? undefined, route: route ?? "contract" }));
  }

  return <AboutPageContent />;
}
