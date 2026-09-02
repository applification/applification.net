import { ClientLogos } from "@/components/home/client-logos";
import { ClientOutcomes } from "@/components/home/client-outcomes";
import { ContractCta } from "@/components/home/contract-cta";
import { Hero } from "@/components/home/hero";
import { ProductsRow } from "@/components/home/products-row";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <ClientLogos />
      <ClientOutcomes />
      <ProductsRow />
      <ContractCta />
    </main>
  );
}
