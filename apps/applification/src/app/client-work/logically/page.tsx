import type { Metadata } from "next";
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
  return <LogicallyCaseStudyPage />;
}
