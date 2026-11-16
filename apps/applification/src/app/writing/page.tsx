import type { Metadata } from "next";
import { profileOpenGraph } from "@/lib/social-metadata";
import { WritingPage } from "@/components/writing/writing-page";
import { getWriting, getWritingTopics } from "@/lib/writing";

const description =
  "Field notes on coding agents, product engineering, React and the work of shipping software.";

export const metadata: Metadata = {
  title: "Writing",
  description,
  alternates: { canonical: "/writing" },
  openGraph: {
    ...profileOpenGraph,
    title: "Writing | Dave Hudson",
    description,
    url: "/writing",
  },
};

export default function WritingRoute() {
  const entries = getWriting({ includeDrafts: false });
  const topics = getWritingTopics({ includeDrafts: false });

  return <WritingPage entries={entries} topics={topics} />;
}
