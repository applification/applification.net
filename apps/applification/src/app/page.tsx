import { AiWorkingMethod } from "@/components/home/ai-working-method";
import { ClientOutcomes } from "@/components/home/client-outcomes";
import { CommercialProof } from "@/components/home/commercial-proof";
import { ContractCta } from "@/components/home/contract-cta";
import { Hero } from "@/components/home/hero";
import { OpenSourceProducts } from "@/components/home/open-source-products";
import { PlantryShowcase } from "@/components/home/plantry-showcase";
import { StoryLoopsShowcase } from "@/components/home/storyloops-showcase";

export default function HomePage() {
  return (
    <main className="flex-1">
      <Hero />
      <CommercialProof />
      <StoryLoopsShowcase />
      <PlantryShowcase />
      <ClientOutcomes />
      <OpenSourceProducts />
      <AiWorkingMethod />
      <ContractCta />
    </main>
  );
}
