import type { Metadata } from "next";
import { LogicallyCaseStudyPage } from "@/components/client-work/logically-case-study-page";

const description =
  "How I rebuilt Logically Intelligence in Next.js, moved reporting behind typed APIs and co-built its production Agentic Chat.";

export const metadata: Metadata = {
  title: "Logically case study",
  description,
  alternates: { canonical: "/client-work/logically" },
  openGraph: {
    title: "Logically case study | Applification",
    description,
    url: "/client-work/logically",
  },
  twitter: {
    card: "summary",
    title: "Logically case study | Applification",
    description,
  },
};

export default function LogicallyCaseStudyRoute() {
  return <LogicallyCaseStudyPage />;
}
