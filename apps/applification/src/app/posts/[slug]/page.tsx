import { permanentRedirect } from "next/navigation";
import { getWriting } from "@/lib/writing";

type LegacyPostPageProps = {
  params: Promise<{ slug: string }>;
};

export const dynamicParams = false;

export function generateStaticParams() {
  return getWriting({ includeDrafts: false })
    .filter((entry) => entry.type === "post")
    .map((entry) => ({ slug: entry.slug }));
}

export default async function LegacyPostPage({ params }: LegacyPostPageProps) {
  const { slug } = await params;
  permanentRedirect(`/writing/${slug}`);
}
