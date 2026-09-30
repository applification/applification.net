import { productPageCopy } from "@/lib/content/product-details";
import { ProductDetailHero } from "./product-detail";
import { StoryLoopsProductMap } from "@/components/home/storyloops-showcase";
import { ProductNavigator } from "./product-navigator";

export function StoryLoopsProductPage() {
  const copy = productPageCopy.storyloops;
  return <main id="main-content">
    <ProductDetailHero breadcrumb="PRODUCTS / StoryLoops" title={copy.hero.title} description={copy.hero.paragraphs[0]} status="ARCHIVED" primaryAction={{ href: "/products/astack", label: "Explore astack" }} visual={<StoryLoopsProductMap compact />} />
    <section aria-labelledby="storyloops-rationale-heading" className="bg-[var(--app-section)] px-6 py-14 min-[720px]:px-12">
      <div className="mx-auto max-w-[760px]">
        <h2 id="storyloops-rationale-heading" className="font-heading text-4xl text-[var(--app-text-primary)]">{copy.rationale.title}</h2>
        {copy.rationale.paragraphs.map(p => <p key={p} className="mt-5 text-lg leading-relaxed text-[var(--app-text-secondary)]">{p}</p>)}
        <p className="font-caption mt-8 text-sm text-[var(--app-text-muted)]">{copy.availability.paragraphs[0]}</p>
      </div>
    </section>
    <ProductNavigator current="storyloops" />
  </main>;
}
