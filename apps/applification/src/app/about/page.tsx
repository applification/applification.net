import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { redirect } from "next/navigation";
import { AboutPage as AboutPageContent } from "@/components/about/about-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";
import { buildContactHref, parseContactProduct, parseContactRoute } from "@/lib/contact";

export const metadata: Metadata = {
  title: "About Dave Hudson",
  description: contractPositioningDescriptions.about,
  alternates: { canonical: "/about" },
  openGraph: {
    ...defaultOpenGraph,
    title: "About Dave Hudson | Applification",
    description: contractPositioningDescriptions.about,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
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
