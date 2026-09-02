const clients = [
  "Logically",
  "Client Server",
  "Peppy Health",
  "Pando",
  "HMRC",
  "Cabinet Office",
  "TUI",
] as const;

export function ClientLogos() {
  return (
    <section
      aria-labelledby="client-logos-label"
      className="border-b border-[var(--app-border)] bg-[var(--app-section)] px-6 py-7 min-[720px]:px-12 min-[1024px]:py-8 min-[1280px]:px-20 min-[1440px]:px-[120px]"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-4 min-[1024px]:gap-5">
        <p
          className="font-caption text-[11px] leading-[14px] font-bold tracking-[1px] text-[var(--app-label-text)] uppercase"
          id="client-logos-label"
        >
          20+ years of production work for
        </p>
        <ul
          className="flex flex-wrap items-baseline gap-x-6 gap-y-2.5 min-[1024px]:flex-nowrap min-[1024px]:justify-between min-[1024px]:gap-x-8"
          data-client-logos
        >
          {clients.map((client) => (
            <li
              className="font-heading text-[22px] leading-none font-medium whitespace-nowrap text-[var(--app-text-primary)] min-[1024px]:text-[26px]"
              key={client}
            >
              {client}
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
