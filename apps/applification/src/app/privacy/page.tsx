import type { Metadata } from "next";
import { PrivacyPage as PrivacyPageContent } from "@/components/privacy/privacy-page";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { defaultOpenGraph } from "@/lib/social-metadata";

const description =
  "How applification.net, its public API and the optional contact workflow handle personal data. No accounts, no tracking cookies; enquiries are reviewed before sending.";

export const metadata: Metadata = {
  title: "Privacy",
  description,
  alternates: { canonical: "/privacy" },
  openGraph: {
    ...defaultOpenGraph,
    title: "Privacy | Applification",
    description,
    url: "/privacy",
  },
};

export default function PrivacyRoute() {
  return (
    <>
      <StructuredData
        data={breadcrumbStructuredData([{ name: "Privacy", path: "/privacy" }])}
      />
      <PrivacyPageContent />
    </>
  );
}
