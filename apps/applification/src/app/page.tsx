import { ClientLogos } from "@/components/home/client-logos";
import { ClientOutcomes } from "@/components/home/client-outcomes";
import { ContractCta } from "@/components/home/contract-cta";
import { Hero } from "@/components/home/hero";
import { ProductsRow } from "@/components/home/products-row";
import { StructuredData } from "@/components/structured-data";
import { homepageStructuredData } from "@/lib/public-catalog";

export const metadata = { alternates: { canonical: "/" } };

export default function HomePage() {
  return (
    <main className="flex-1">
      <StructuredData data={homepageStructuredData} />
      <Hero />
      <ClientLogos />
      <ClientOutcomes />
      <ProductsRow />
      <ContractCta />
    </main>
  );
}
