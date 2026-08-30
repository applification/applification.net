const proofPoints = [
  {
    value: "20+ years",
    detail: "Shipping production software",
  },
  {
    value: "Small teams",
    detail: "Product shaping and engineering",
  },
  {
    value: "UK remote",
    detail: "Contracts through Applification Ltd",
  },
];

export function CommercialProof() {
  return (
    <section
      aria-labelledby="commercial-proof-label"
      className="border-y border-[var(--app-border)] bg-[var(--app-muted-section)] min-[720px]:min-h-[126px] min-[720px]:bg-[var(--app-section)]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-3 px-6 py-6 min-[720px]:w-[calc(100%-48px)] min-[720px]:gap-4 min-[720px]:px-0 min-[720px]:pt-5 min-[720px]:pb-6">
        <p
          className="font-caption text-[11px] leading-[14px] font-bold tracking-[0.9px] text-[var(--app-label-text)] uppercase min-[720px]:tracking-[1px]"
          id="commercial-proof-label"
        >
          <span className="min-[720px]:hidden">
            Senior delivery&nbsp; · &nbsp;UK remote contracts
          </span>
          <span className="hidden min-[720px]:inline">
            Senior delivery&nbsp; · &nbsp;Startups&nbsp; · &nbsp;Health
            tech&nbsp; · &nbsp;UK government
          </span>
        </p>

        <ProofStagger className="flex flex-col min-[720px]:flex-row">
          {proofPoints.map((point, index) => (
            <div
              className={`flex items-center gap-4 py-2.5 min-[720px]:flex-1 min-[720px]:flex-col min-[720px]:items-start min-[720px]:gap-[5px] min-[720px]:py-0 ${
                index === 0
                  ? "min-[720px]:pr-6"
                  : "border-t border-[var(--app-border)] min-[720px]:border-t-0 min-[720px]:border-l min-[720px]:px-6"
              } ${index === proofPoints.length - 1 ? "min-[720px]:pr-0" : ""}`}
              key={point.value}
            >
              <dt className="font-heading w-[112px] shrink-0 text-[22px] leading-none font-medium text-[var(--app-text-primary)] min-[720px]:w-auto min-[720px]:text-[26px]">
                {point.value}
              </dt>
              <dd className="text-[13px] leading-[1.4] text-[var(--app-text-secondary)] min-[720px]:leading-[17px]">
                {point.detail}
              </dd>
            </div>
          ))}
        </ProofStagger>
      </div>
    </section>
  );
}
import { ProofStagger } from "./motion";
