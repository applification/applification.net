const proofPoints = [
  {
    value: "20+ years",
    detail: "Shipping products with small teams",
  },
  {
    value: "Days to minutes",
    detail: "Routine UI changes at Logically",
  },
  {
    value: "4 months",
    detail: "Greenfield Eruptiv frontend built",
  },
];

export function CommercialProof() {
  return (
    <section
      aria-labelledby="commercial-proof-label"
      className="border-y border-[var(--app-border)] bg-[var(--app-muted-section)] min-[821px]:min-h-[134px] min-[821px]:bg-[var(--app-section)]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 px-6 py-7 min-[821px]:w-[calc(100%-48px)] min-[821px]:gap-[18px] min-[821px]:px-0 min-[821px]:pt-6 min-[821px]:pb-[26px]">
        <p
          className="font-caption text-[11px] leading-[14px] font-bold tracking-[0.9px] text-[var(--app-label-text)] uppercase min-[821px]:tracking-[1px]"
          id="commercial-proof-label"
        >
          <span className="min-[821px]:hidden">
            Commercial proof&nbsp; · &nbsp;UK remote contracts
          </span>
          <span className="hidden min-[821px]:inline">
            Commercial proof&nbsp; · &nbsp;Startups&nbsp; · &nbsp;Health
            tech&nbsp; · &nbsp;UK government
          </span>
        </p>

        <dl className="flex flex-col min-[821px]:flex-row">
          {proofPoints.map((point, index) => (
            <div
              className={`flex items-center gap-4 py-3 min-[821px]:flex-1 min-[821px]:flex-col min-[821px]:items-start min-[821px]:gap-[5px] min-[821px]:py-0 ${
                index === 0
                  ? "min-[821px]:pr-6"
                  : "border-t border-[var(--app-border)] min-[821px]:border-t-0 min-[821px]:border-l min-[821px]:px-6"
              } ${index === proofPoints.length - 1 ? "min-[821px]:pr-0" : ""}`}
              key={point.value}
            >
              <dt className="font-heading w-[118px] shrink-0 text-2xl leading-none font-medium text-[var(--app-text-primary)] min-[821px]:w-auto min-[821px]:text-[28px]">
                {point.value}
              </dt>
              <dd className="text-[13px] leading-[1.4] text-[var(--app-text-secondary)] min-[821px]:leading-[17px]">
                {point.detail}
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
