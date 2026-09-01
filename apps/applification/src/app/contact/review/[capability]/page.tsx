import type { Metadata } from "next";
import { OwnerCvReview, OwnerReviewUnavailable } from "@/components/contact/owner-cv-review";
import { loadOwnerCvReview } from "@/lib/contact-owner-review";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Private CV review",
  robots: { index: false, follow: false, noarchive: true },
  referrer: "no-referrer",
};

export default async function ContactOwnerReviewPage({
  params,
}: {
  params: Promise<{ capability: string }>;
}) {
  const { capability } = await params;
  const loaded = await loadOwnerCvReview(capability);

  if (!loaded) return <OwnerReviewUnavailable />;
  return (
    <OwnerCvReview
      attachmentUrl={loaded.attachmentUrl}
      capability={capability}
      review={loaded.review}
    />
  );
}
