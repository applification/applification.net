import type { Metadata } from "next";
import { profileOpenGraph } from "@/lib/social-metadata";
import { ClientWorkPage } from "@/components/client-work/client-work-page";
import { contractPositioningDescriptions } from "@/lib/contract-positioning";

export const metadata: Metadata = {
  title: "Client work",
  description: contractPositioningDescriptions.clientWork,
  alternates: { canonical: "/client-work" },
  openGraph: {
    ...profileOpenGraph,
    title: "Client work | Dave Hudson",
    description: contractPositioningDescriptions.clientWork,
    url: "/client-work",
  },
  twitter: {
    card: "summary_large_image",
    title: "Client work | Dave Hudson",
    description: contractPositioningDescriptions.clientWork,
  },
};

export default function ClientWorkRoute() {
  return <ClientWorkPage />;
}
