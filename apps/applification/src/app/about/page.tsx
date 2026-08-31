import type { Metadata } from "next";
import { AboutPage as AboutPageContent } from "@/components/about/about-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";

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

export default function AboutPage() {
  return <AboutPageContent />;
}
