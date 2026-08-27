import { Bot, Box, Rocket, ShieldCheck, SlidersHorizontal } from "lucide-react";
import { ContractCta } from "@/components/home/contract-cta";
import { StoryLoopsProductMap } from "@/components/home/storyloops-showcase";
import {
  ProductDetailAvailability,
  ProductDetailHero,
  ProductDetailPrinciples,
  ProductDetailRationale,
  ProductDetailSteps,
  type ProductDetailPrinciple,
  type ProductDetailStep,
} from "@/components/products/product-detail";

const ownershipLabels = [
  "SOURCE INCLUDED",
  "DEPLOY YOUR INSTANCE",
  "CHANGE WITH YOUR AGENT",
];

const ownershipSteps: ProductDetailStep[] = [
  {
    number: "01",
    title: "Purchase V1",
    description:
      "Receive the complete working application and the source code for the version you bought.",
    icon: <Box aria-hidden="true" size={23} strokeWidth={1.7} />,
  },
  {
    number: "02",
    title: "Open with your agent",
    description:
      "Ask your preferred coding agent to install StoryLoops for your organisation.",
    icon: <Bot aria-hidden="true" size={23} strokeWidth={1.7} />,
  },
  {
    number: "03",
    title: "Deploy your instance",
    description:
      "The agent provisions services, configures the app, deploys it and runs smoke tests.",
    icon: <Rocket aria-hidden="true" size={23} strokeWidth={1.7} />,
  },
  {
    number: "04",
    title: "Make it yours",
    description:
      "Change the brand, roles, estimates, workflow or integrations in your owned version.",
    icon: <SlidersHorizontal aria-hidden="true" size={23} strokeWidth={1.7} />,
  },
];

const buildPrinciples: ProductDetailPrinciple[] = [
  {
    title: "Production core",
    description:
      "Next.js, React, TypeScript, Convex and WorkOS form an opinionated collaborative stack.",
  },
  {
    title: "Agent-native installation",
    description:
      "The playbook covers provisioning, environment setup, deployment and verification.",
  },
  {
    title: "Safe to customise",
    description:
      "Predictable modules, documented invariants and tests help an unfamiliar agent change it correctly.",
  },
];

export function StoryLoopsProductPage() {
  return (
    <main className="overflow-x-clip">
      <ProductDetailHero
        breadcrumb="PRODUCTS  /  STORYLOOPS"
        description="Buy a complete collaborative story-mapping application, deploy it with your coding agent, and own the source for the version you purchase."
        primaryAction={{ href: "#ownership-path", label: "See what you own" }}
        status="PRODUCT IN A BOX V1"
        title="Stop renting story-mapping software. Own it."
        visual={
          <StoryLoopsProductMap
            compact
            ownershipLabels={ownershipLabels}
          />
        }
      />

      <ProductDetailRationale
        body="An agent can generate code, but starting from zero still means hundreds of architecture, security, data and product decisions. StoryLoops gives the agent a coherent application that already works."
        callout="You are buying the decisions, implementation and debugging already done, plus the source to take it further."
        calloutIcon={<ShieldCheck aria-hidden="true" size={24} strokeWidth={1.7} />}
        eyebrow="WHY THIS EXISTS"
        title="Start with a production product, not an empty directory."
      />

      <ProductDetailSteps
        eyebrow="THE OWNERSHIP PATH"
        id="ownership-path"
        note="The installation playbook tells the agent what to provision, how to deploy and what to verify before handover."
        steps={ownershipSteps}
        title="Purchase. Give it to your agent. Receive a production URL."
      />

      <ProductDetailPrinciples
        description="The application favours obvious architecture, explicit domain concepts and typed boundaries. Agent documentation is part of the product, not an appendix added before release."
        eyebrow="BUILT FOR OWNERSHIP"
        principles={buildPrinciples}
        title="Production software shaped for the agent that will change it."
      />

      <ProductDetailAvailability
        action={{
          href: "mailto:dave@applification.net?subject=StoryLoops%20V1%20launch%20details",
          label: "Get V1 launch details",
        }}
        description="V1 is in preparation. Buyers receive the working app, source code, deployment configuration and agent playbooks. There is no hosted SaaS subscription."
        eyebrow="WHERE TO GET IT"
        status="PRODUCT IN A BOX V1"
        title="One purchase. The product and source are yours."
      />

      <ContractCta
        description="I can join an existing team or assemble the product, design and engineering team needed to deliver the project. Remote work across the UK."
        title="Need a senior product engineer or a team to build your AI product?"
        variant="dark"
      />
    </main>
  );
}
