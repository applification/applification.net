import type { Metadata } from "next";
import { ClientWorkPage } from "@/components/client-work/client-work-page";

const description =
  "Production case studies from greenfield product builds, frontend rebuilds and AI systems, with the decisions and outcomes attached.";

export const metadata: Metadata = {
  title: "Client work",
  description,
  openGraph: {
    title: "Client work | Applification",
    description,
    url: "/client-work",
  },
  twitter: {
    card: "summary",
    title: "Client work | Applification",
    description,
  },
};

export default function ClientWorkRoute() {
  return <ClientWorkPage />;
}
