import type { Metadata } from "next";
import { EruptivCaseStudyPage } from "@/components/client-work/contract-case-study-page";

const description =
  "How I built the complete Next.js frontend for Client Server's Eruptiv recruitment platform in three months and took it to production after four.";

export const metadata: Metadata = {
  title: "Eruptiv case study",
  description,
  alternates: { canonical: "/client-work/eruptiv" },
  openGraph: {
    title: "Eruptiv case study | Applification",
    description,
    url: "/client-work/eruptiv",
  },
  twitter: {
    card: "summary",
    title: "Eruptiv case study | Applification",
    description,
  },
};

export default function EruptivCaseStudyRoute() {
  return <EruptivCaseStudyPage />;
}
