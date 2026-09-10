import type { Metadata } from "next";
import { StructuredData } from "@/components/structured-data";
import { breadcrumbStructuredData } from "@/lib/public-catalog";
import { LogicallyCaseStudyPage } from "@/components/client-work/logically-case-study-page";

const description =
  "How I rebuilt Logically Intelligence in Next.js, moved reporting behind typed APIs and co-built its production Agentic Chat.";

export const metadata: Metadata = {
  title: "Logically case study",
  description,
  alternates: { canonical: "/client-work/logically" },
  openGraph: {
    type: "article",
    siteName: "Applification",
    locale: "en_GB",
    title: "Logically case study | Applification",
    description,
    url: "/client-work/logically",
  },
  twitter: {
    card: "summary_large_image",
    title: "Logically case study | Applification",
    description,
  },
};

export default function LogicallyCaseStudyRoute() {
  return (
    <>
      <StructuredData data={breadcrumbStructuredData([{ name: "Client work", path: "/client-work" }, { name: "Logically", path: "/client-work/logically" }])} />
      <LogicallyCaseStudyPage />
    </>
  );
}
