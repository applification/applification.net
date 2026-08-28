import type { Metadata } from "next";
import { WritingPage } from "@/components/writing/writing-page";
import { getWriting, getWritingTopics } from "@/lib/writing";

export const metadata: Metadata = {
  title: "Writing",
  description:
    "Field notes on coding agents, product engineering, React and the work of shipping software.",
};

export default function WritingRoute() {
  const entries = getWriting({ includeDrafts: false });
  const topics = getWritingTopics({ includeDrafts: false });

  return <WritingPage entries={entries} topics={topics} />;
}
