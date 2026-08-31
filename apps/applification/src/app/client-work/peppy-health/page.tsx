import type { Metadata } from "next";
import { PeppyHealthCaseStudyPage } from "@/components/client-work/contract-case-study-page";

const description =
  "How I led the rebuild of Peppy Admin with Storybook, Cypress and GitHub Actions while Peppy scaled to £12 million ARR.";

export const metadata: Metadata = {
  title: "Peppy Health case study",
  description,
  alternates: { canonical: "/client-work/peppy-health" },
  openGraph: {
    title: "Peppy Health case study | Applification",
    description,
    url: "/client-work/peppy-health",
  },
  twitter: {
    card: "summary",
    title: "Peppy Health case study | Applification",
    description,
  },
};

export default function PeppyHealthCaseStudyRoute() {
  return <PeppyHealthCaseStudyPage />;
}
