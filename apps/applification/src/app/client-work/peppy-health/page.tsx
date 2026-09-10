import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { PeppyHealthCaseStudyPage } from "@/components/client-work/contract-case-study-page";

const description =
  "How I led the rebuild of Peppy Admin with Storybook, Cypress and GitHub Actions while Peppy scaled to £12 million ARR.";

export const metadata: Metadata = {
  title: "Peppy Health case study",
  description,
  alternates: { canonical: "/client-work/peppy-health" },
  openGraph: {
    type: "article",
    siteName: "Applification",
    locale: "en_GB",
    title: "Peppy Health case study | Applification",
    description,
    url: "/client-work/peppy-health",
  },
  twitter: {
    card: "summary_large_image",
    title: "Peppy Health case study | Applification",
    description,
  },
};

export default function PeppyHealthCaseStudyRoute() {
  return (
    <>
      <StructuredData data={breadcrumbStructuredData([{ name: "Client work", path: "/client-work" }, { name: "Peppy Health", path: "/client-work/peppy-health" }])} />
      <PeppyHealthCaseStudyPage />
    </>
  );
}
