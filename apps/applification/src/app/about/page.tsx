import type { Metadata } from "next";
import { AboutPage as AboutPageContent } from "@/components/about/about-page";

const description =
  "Dave Hudson is an independent AI Product Engineer building React and TypeScript products for small teams through Applification Ltd.";

export const metadata: Metadata = {
  title: "About Dave Hudson",
  description,
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About Dave Hudson | Applification",
    description,
    url: "/about",
  },
  twitter: {
    card: "summary",
    title: "About Dave Hudson | Applification",
    description,
  },
};

export default function AboutPage() {
  return <AboutPageContent />;
}
