import { ArrowUpRight } from "lucide-react";
import Link from "next/link";
import { ContextureSchemaPreview } from "@/components/products/contexture-schema-preview";

export type ProductSlug = "contexture" | "plantry" | "storyloops" | "voiced";

type Product = {
  accent: string;
  description: string;
  href: string;
  name: string;
  slug: ProductSlug;
  status: string;
};

const products: Product[] = [
  {
    accent: "#cba6f7",
    description: "Turn one domain model into contracts your code can share.",
    href: "/products/contexture",
    name: "Contexture",
    slug: "contexture",
    status: "LIVE",
  },
  {
    accent: "#7dd3fc",
    description: "Keep product scope visible to coding agents and people.",
    href: "/products/storyloops",
    name: "StoryLoops",
    slug: "storyloops",
    status: "IN DEVELOPMENT",
  },
  {
    accent: "#8fe3a8",
    description: "Speak into the text field you are already using.",
    href: "/products/voiced",
    name: "Voiced",
    slug: "voiced",
    status: "LIVE",
  },
  {
    accent: "#e8c66a",
    description: "Plan a few meals around the household and what needs using.",
    href: "/products/plantry",
    name: "Plantry",
    slug: "plantry",
    status: "R&D",
  },
];

function ProductSignal({ product }: { product: Product }) {
  if (product.slug === "contexture") {
    return (
      <div className="h-full">
        <ContextureSchemaPreview compact description="Contexture schema preview." />
      </div>
    );
  }

  if (product.slug === "storyloops") {
    return (
      <div aria-hidden="true" className="flex h-full flex-col bg-[#172033] p-4">
        <div className="font-caption flex items-center justify-between text-[8px] font-bold tracking-[0.6px] text-[#94a3b8]">
          <span>PRODUCT MAP · 9 STORIES</span>
          <span className="text-[#7dd3fc]">AGENT ACTIVE</span>
        </div>
        <div className="mt-3 grid min-h-0 flex-1 grid-cols-[1fr_0.72fr] gap-2">
          <div className="grid grid-cols-2 gap-1.5 rounded-md bg-[#f8fafc] p-2">
            {["Navigation", "Homepage", "Products", "Writing"].map((label, index) => (
              <span
                className={`${index < 2 ? "border-[#93c5fd] bg-[#dbeafe] text-[#1e3a8a]" : "border-[#fde68a] bg-[#fef3c7] text-[#713f12]"} flex items-center rounded-sm border px-1.5 text-[7px] font-semibold`}
                key={label}
              >
                {label}
              </span>
            ))}
          </div>
          <div className="rounded-md border border-[#334155] bg-[#0b1220] p-2">
            <div className="font-caption text-[7px] font-bold text-[#f9a8d4]">
              SCOPE CHANGE
            </div>
            <div className="mt-1.5 text-[8px] leading-[1.25] text-[#cbd5e1]">
              Waiting for human approval
            </div>
            <div className="mt-2 h-4 rounded-full bg-[#2563eb]" />
          </div>
        </div>
      </div>
    );
  }

  if (product.slug === "voiced") {
    const bars = [14, 26, 38, 30, 50, 36, 22, 42, 28, 16];

    return (
      <div
        aria-label="A Right Command key beside a voice waveform."
        className="flex h-full items-center justify-center gap-5 bg-[var(--voiced-preview)] px-4"
        role="img"
      >
        <div aria-hidden="true" className="flex size-[72px] shrink-0 flex-col justify-between rounded-xl bg-[var(--voiced-ink)] p-2.5 text-[var(--voiced-action-text)] shadow-[0_10px_22px_var(--voiced-shadow)]">
          <span className="text-2xl">⌘</span>
          <span className="font-caption text-[6px] font-bold tracking-[0.45px] text-[var(--voiced-mint-soft)]">
            RIGHT COMMAND
          </span>
        </div>
        <div aria-hidden="true" className="flex h-14 items-center gap-1">
          {bars.map((height, index) => (
            <span
              className={`${index % 3 === 0 ? "bg-[var(--voiced-ink)]" : index % 2 === 0 ? "bg-[var(--voiced-mint)]" : "bg-[var(--voiced-mint-soft)]"} w-1 rounded-full`}
              key={`${height}-${index}`}
              style={{ height }}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="relative h-full overflow-hidden bg-[#f3eee0]">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Plantry on iPhone showing a household meal plan."
        className="absolute top-2 left-1/2 h-auto w-[104px] -translate-x-1/2 drop-shadow-[0_10px_16px_#15344726]"
        decoding="async"
        height={940}
        loading="lazy"
        src="/images/plantry-phone.png"
        width={536}
      />
    </div>
  );
}

export function ProductNavigator({ current }: { current?: ProductSlug }) {
  const visibleProducts = products.filter((product) => product.slug !== current);

  return (
    <section
      aria-labelledby="product-navigator-heading"
      className="bg-[#0b1220] px-6 py-14 text-white min-[1024px]:px-20 min-[1024px]:py-16"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <header className="mb-8 flex flex-col gap-4 min-[720px]:flex-row min-[720px]:items-end min-[720px]:justify-between">
          <div>
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[#7dd3fc] min-[1024px]:text-xs min-[1024px]:font-semibold">
              {current ? "KEEP EXPLORING" : "PRODUCT PORTFOLIO"}
            </p>
            <h2
              className="font-heading mt-3 text-[36px] leading-none font-medium min-[1024px]:text-[42px]"
              id="product-navigator-heading"
            >
              {current ? "Choose another product." : "Choose a product."}
            </h2>
          </div>
          {current ? (
            <Link
              className="inline-flex min-h-11 w-fit items-center gap-2 text-[15px] font-semibold text-[#cbd5e1] underline decoration-[#475569] underline-offset-4 transition-colors hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
              href="/products"
            >
              View all products
              <ArrowUpRight aria-hidden="true" size={16} strokeWidth={1.8} />
            </Link>
          ) : null}
        </header>

        <nav aria-label="Product portfolio">
          <ul
            className={`grid gap-3 min-[640px]:grid-cols-2 ${visibleProducts.length === 4 ? "min-[1024px]:grid-cols-4" : "min-[1024px]:grid-cols-3"}`}
          >
            {visibleProducts.map((product) => (
              <li key={product.slug}>
                <Link
                  className="group flex min-h-[285px] flex-col overflow-hidden rounded-[14px] border border-[#29364a] bg-[#111c2f] transition-[border-color,background-color,transform] hover:-translate-y-1 hover:border-[#64748b] hover:bg-[#162238] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]"
                  href={product.href}
                >
                  <div className="h-[148px] border-b border-[#29364a] bg-[#0e1728]">
                    <ProductSignal product={product} />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-caption text-[11px] font-bold tracking-[0.6px] text-[#94a3b8]">
                        {product.status}
                      </span>
                      <ArrowUpRight
                        aria-hidden="true"
                        className="text-[var(--product-accent)] transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                        size={18}
                        strokeWidth={1.8}
                        style={{ "--product-accent": product.accent } as React.CSSProperties}
                      />
                    </div>
                    <h3 className="font-heading mt-3 text-[28px] leading-none font-medium">
                      {product.name}
                    </h3>
                    <p className="mt-3 text-base leading-[1.55] text-[#b8c4d4]">
                      {product.description}
                    </p>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </section>
  );
}
