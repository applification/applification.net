import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { profileOpenGraph } from "@/lib/social-metadata";
import { redirect } from "next/navigation";
import { AboutPage as AboutPageContent } from "@/components/about/about-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";
import {
  buildContactHref,
  parseContactProduct,
  parseContactRoute,
} from "@/lib/contact";

export const metadata: Metadata = {
  title: "About Dave Hudson",
  description: contractPositioningDescriptions.about,
  alternates: { canonical: "/about" },
  openGraph: {
    ...profileOpenGraph,
    title: "About Dave Hudson | Dave Hudson",
    description: contractPositioningDescriptions.about,
    url: "/about",
  },
  twitter: {
    card: "summary_large_image",
    title: "About Dave Hudson | Dave Hudson",
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
    redirect(
      buildContactHref({
        product: product ?? undefined,
        route: route ?? "contract",
      }),
    );
  }

  return (
    <>
      <StructuredData
        data={breadcrumbStructuredData([{ name: "About", path: "/about" }])}
      />
      <AboutPageContent />
    </>
  );
}
