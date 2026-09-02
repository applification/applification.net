import type { Metadata } from "next";
import { defaultOpenGraph } from "@/lib/social-metadata";
import { ClientWorkPage } from "@/components/client-work/client-work-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";

export const metadata: Metadata = {
  title: "Client work",
  description: contractPositioningDescriptions.clientWork,
  openGraph: {
    ...defaultOpenGraph,
    title: "Client work | Applification",
    description: contractPositioningDescriptions.clientWork,
    url: "/client-work",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client work | Applification",
    description: contractPositioningDescriptions.clientWork,
  },
};

export default function ClientWorkRoute() {
  return <ClientWorkPage />;
}
