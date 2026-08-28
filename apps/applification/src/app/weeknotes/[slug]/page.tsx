import { permanentRedirect } from "next/navigation";
import { getWriting } from "@/lib/writing";

type LegacyWeeknotePageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriting({ includeDrafts: false })
    .filter((entry) => entry.type === "weeknote")
    .map((entry) => ({ slug: entry.slug }));
}

export default async function LegacyWeeknotePage({ params }: LegacyWeeknotePageProps) {
  const { slug } = await params;
  permanentRedirect(`/writing/${slug}`);
}
