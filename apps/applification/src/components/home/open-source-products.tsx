const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const schemaNodes = [
  {
    name: "stories",
    detail: "20 tables",
    tone: "border-[var(--contexture-purple)]",
  },
  {
    name: "generated contracts",
    detail: "287 fields",
    tone: "border-[var(--contexture-pink)]",
  },
  {
    name: "agent context",
    detail: "84 references",
    tone: "border-[var(--contexture-amber)]",
  },
];

const contextureMetrics = [
  { value: "20", label: "tables" },
  { value: "287", label: "fields" },
  { value: "84", label: "references" },
];

type ProductLinkProps = {
  href: string;
  label: string;
  primary?: boolean;
  product: "contexture" | "voiced";
};

function GitHubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[15px] shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <path
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.59 2 12.253c0 4.53 2.865 8.373 6.839 9.73.5.094.682-.222.682-.494 0-.244-.009-.888-.014-1.743-2.782.62-3.369-1.372-3.369-1.372-.455-1.184-1.11-1.5-1.11-1.5-.908-.636.069-.623.069-.623 1.004.073 1.532 1.058 1.532 1.058.892 1.566 2.341 1.114 2.91.852.091-.663.35-1.114.636-1.37-2.22-.26-4.555-1.14-4.555-5.07 0-1.12.39-2.035 1.029-2.752-.103-.26-.446-1.304.098-2.716 0 0 .84-.276 2.75 1.051A9.31 9.31 0 0 1 12 7.002a9.3 9.3 0 0 1 2.504.346c1.909-1.327 2.747-1.05 2.747-1.05.546 1.411.203 2.455.1 2.715.64.717 1.028 1.632 1.028 2.752 0 3.94-2.339 4.807-4.566 5.062.359.317.678.943.678 1.9 0 1.372-.012 2.478-.012 2.814 0 .274.18.593.688.492C19.14 20.622 22 16.783 22 12.253 22 6.59 17.523 2 12 2Z"
        fillRule="evenodd"
      />
    </svg>
  );
}

function ExternalLinkIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-[13px] shrink-0"
      fill="none"
      viewBox="0 0 16 16"
    >
      <path
        d="M5 11 11 5M6 5h5v5"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      />
    </svg>
  );
}

function ProductLink({ href, label, primary = false, product }: ProductLinkProps) {
  const palette =
    product === "contexture"
      ? primary
        ? "bg-[var(--contexture-purple)] text-[var(--contexture-shell)] hover:bg-[var(--contexture-text)]"
        : "border border-[var(--contexture-border)] text-[var(--contexture-muted)] hover:border-[var(--contexture-cyan)] hover:text-[var(--contexture-text)]"
      : primary
        ? "bg-[var(--voiced-action)] text-[var(--voiced-action-text)] hover:bg-[var(--voiced-muted)]"
        : "border border-[var(--voiced-control-border)] text-[var(--voiced-muted)] hover:bg-[var(--voiced-preview)] hover:text-[var(--voiced-ink)]";

  return (
    <a
      className={`inline-flex min-h-11 items-center justify-center gap-[7px] rounded-lg px-3.5 text-xs font-bold transition-colors min-[1024px]:min-h-8 min-[1024px]:px-2.5 min-[1024px]:text-[11px] ${palette} ${focusClasses}`}
      href={href}
      rel="noopener noreferrer"
      target="_blank"
    >
      {primary ? null : <GitHubIcon />}
      {label}
      {primary ? <ExternalLinkIcon /> : null}
      <span className="sr-only">, opens in a new tab</span>
    </a>
  );
}

function ContextureGraph() {
  return (
    <div
      aria-label="One reviewed Contexture model feeding generated application contracts and coding-agent context."
      className="overflow-hidden rounded-xl border border-[var(--contexture-border)] bg-[var(--contexture-surface)]"
      role="img"
    >
      <div aria-hidden="true">
        <div className="font-caption flex h-9 items-center justify-between border-b border-[var(--contexture-border)] bg-[var(--contexture-surface-raised)] px-3 text-[8px] font-semibold text-[var(--contexture-muted)]">
          <span className="text-[var(--contexture-text)]">
            <span className="text-[var(--contexture-purple)]">●</span>
            &nbsp; Contexture / StoryLoops
          </span>
          <span>REVIEWED MODEL</span>
        </div>
        <div className="grid gap-2.5 p-3 min-[1024px]:grid-cols-3 min-[1024px]:gap-5 min-[1024px]:p-5">
          {schemaNodes.map((node, index) => (
            <div className="relative" key={node.name}>
              <div
                className={`rounded-lg border bg-[var(--contexture-surface-raised)] px-3 py-2.5 ${node.tone}`}
              >
                <div className="font-caption text-[9px] font-bold text-[var(--contexture-text)]">
                  {node.name}
                </div>
                <div className="font-caption mt-1 text-[8px] text-[var(--contexture-muted)]">
                  {node.detail}
                </div>
              </div>
              {index < schemaNodes.length - 1 ? (
                <span className="font-caption absolute -right-4 top-1/2 hidden -translate-y-1/2 text-[var(--contexture-cyan)] min-[1024px]:block">
                  →
                </span>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function ContextureCard() {
  return (
    <article className="flex flex-col gap-[18px] rounded-[20px] bg-[var(--contexture-shell)] p-5 text-[var(--contexture-text)] shadow-[0_12px_30px_var(--contexture-shadow)] min-[1024px]:rounded-3xl min-[1024px]:p-7">
      <div className="flex flex-col gap-5 min-[1024px]:flex-row min-[1024px]:items-start min-[1024px]:justify-between">
        <div className="max-w-[720px]">
          <div className="font-caption flex items-center justify-between gap-4 text-[9px] font-bold tracking-[0.7px] text-[var(--contexture-cyan)] min-[1024px]:justify-start">
            <span>CONTEXTURE</span>
            <span className="text-[var(--contexture-green)]">
              OPEN SOURCE&nbsp; · &nbsp;CONVEX
            </span>
          </div>
          <h3 className="font-heading mt-3 text-[32px] leading-none font-medium text-[var(--contexture-text)] min-[1024px]:text-[42px]">
            See the schema. Give the agent context.
          </h3>
          <p className="mt-3 max-w-[680px] text-sm leading-[1.5] text-[var(--contexture-muted)] min-[1024px]:text-base">
            Model the product once. The app, generated contracts and coding
            agents all work from the same reviewed structure.
          </p>
        </div>
        <div className="grid shrink-0 grid-cols-2 gap-2 min-[1024px]:flex">
          <ProductLink
            href="https://github.com/applification/contexture"
            label="GitHub source"
            product="contexture"
          />
          <ProductLink
            href="https://contexture.applification.net/"
            label="Open Contexture"
            primary
            product="contexture"
          />
        </div>
      </div>

      <ContextureGraph />

      <dl className="grid grid-cols-3 gap-2">
        {contextureMetrics.map((metric) => (
          <div
            className="rounded-lg bg-[var(--contexture-surface)] px-2 py-3 text-center min-[1024px]:text-left"
            key={metric.label}
          >
            <dt className="font-data text-lg font-bold text-[var(--contexture-cyan)] min-[1024px]:text-xl">
              {metric.value}
            </dt>
            <dd className="font-caption mt-0.5 text-[8px] font-semibold tracking-[0.6px] text-[var(--contexture-muted)] uppercase min-[1024px]:text-[9px]">
              {metric.label}
            </dd>
          </div>
        ))}
      </dl>

      <div className="font-caption hidden min-h-14 items-center justify-between rounded-[10px] bg-[var(--contexture-surface-raised)] px-[18px] text-[11px] font-bold min-[1024px]:flex">
        <span className="text-[var(--contexture-cyan)]">THE TRUSTED LOOP</span>
        <span>01&nbsp; MODEL</span>
        <span>02&nbsp; GENERATE</span>
        <span>03&nbsp; REVIEW</span>
        <span className="rounded-full bg-[var(--contexture-surface)] px-3 py-1.5 text-[var(--contexture-purple)]">
          HITL APPROVAL
        </span>
      </div>
    </article>
  );
}

function VoiceWaveform() {
  const bars = [
    { height: "h-2.5", tone: "bg-[var(--voiced-mint)]" },
    { height: "h-[18px]", tone: "bg-[var(--voiced-muted)]" },
    { height: "h-7", tone: "bg-[var(--voiced-mint-soft)]" },
    { height: "h-[15px]", tone: "bg-[var(--voiced-ink)]" },
    { height: "h-[31px]", tone: "bg-[var(--voiced-mint)]" },
    { height: "h-[22px]", tone: "bg-[var(--voiced-muted)]" },
    { height: "h-3", tone: "bg-[var(--voiced-mint-soft)]" },
  ];

  return (
    <div aria-hidden="true" className="flex h-8 items-center gap-[5px]">
      {bars.map((bar, index) => (
        <span
          className={`w-1 rounded-full ${bar.tone} ${bar.height}`}
          key={`${bar.height}-${index}`}
        />
      ))}
    </div>
  );
}

function VoicedCard() {
  return (
    <article className="voiced-card grid gap-[18px] rounded-[20px] border border-[var(--voiced-border)] bg-[var(--voiced-card)] p-5 text-[var(--voiced-ink)] shadow-[0_12px_28px_var(--voiced-shadow)] min-[1024px]:grid-cols-[minmax(0,1fr)_360px] min-[1024px]:gap-12 min-[1024px]:rounded-3xl min-[1024px]:px-12 min-[1024px]:py-8">
      <div>
        <div className="font-caption flex items-center justify-between gap-4 text-[9px] font-bold tracking-[0.7px] text-[var(--voiced-accent)] min-[1024px]:justify-start">
          <span>VOICED</span>
          <span className="text-[var(--voiced-status)]">
            OPEN SOURCE&nbsp; · &nbsp;NOTARISED
          </span>
        </div>
        <h3 className="font-heading mt-3 text-[32px] leading-none font-medium min-[1024px]:text-[42px]">
          Hold a key. Speak. Keep typing.
        </h3>
        <p className="mt-3 max-w-[680px] text-sm leading-[1.5] text-[var(--voiced-muted)] min-[1024px]:text-base">
          Hold Right Command, speak, and paste the transcription into the text
          field you are already using.
        </p>
        <div className="mt-5 grid grid-cols-2 gap-2 min-[1024px]:flex">
          <ProductLink
            href="https://github.com/applification/voiced"
            label="GitHub source"
            product="voiced"
          />
          <ProductLink
            href="https://voiced.applification.net/"
            label="Open Voiced"
            primary
            product="voiced"
          />
        </div>
      </div>

      <div
        aria-label="Hold the Right Command key, speak, transcribe and paste into the focused field."
        className="flex min-h-[132px] flex-col items-center justify-center gap-3 rounded-2xl bg-[var(--voiced-preview)] p-4"
        role="img"
      >
        <div aria-hidden="true" className="flex flex-col items-center gap-3">
          <div className="flex h-24 w-24 flex-col justify-between rounded-2xl border border-transparent bg-[var(--voiced-ink)] p-3 text-[var(--voiced-action-text)] shadow-[0_10px_22px_var(--voiced-shadow)] min-[1024px]:border-[var(--voiced-mint)]">
            <span className="text-3xl">⌘</span>
            <span className="font-caption text-[8px] font-bold tracking-[0.6px] text-[var(--voiced-mint-soft)]">
              RIGHT COMMAND
            </span>
          </div>
          <VoiceWaveform />
          <span className="font-caption text-[9px] font-bold tracking-[0.5px] text-[var(--voiced-accent)]">
            SPEAK&nbsp; → &nbsp;TRANSCRIBE&nbsp; → &nbsp;PASTE
          </span>
        </div>
      </div>
    </article>
  );
}

export function OpenSourceProducts() {
  return (
    <section
      aria-labelledby="open-source-products-heading"
      className="bg-[var(--app-muted-section)] px-6 py-14 min-[1024px]:px-[120px] min-[1024px]:py-24"
      id="open-source-products"
    >
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-6 min-[1024px]:gap-10">
        <header className="grid gap-4 min-[1024px]:grid-cols-[minmax(0,780px)_390px] min-[1024px]:items-end min-[1024px]:justify-between min-[1024px]:gap-[30px]">
          <div>
            <p className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-label-text)]">
              DESIGNED, BUILT AND RELEASED
            </p>
            <h2
              className="font-heading mt-3 text-[38px] leading-[1.06] font-medium text-[var(--app-text-primary)] min-[1024px]:mt-2.5 min-[1024px]:text-[48px] min-[1024px]:leading-none"
              id="open-source-products-heading"
            >
              Open-source products.
            </h2>
          </div>
          <p className="text-base leading-[1.55] text-[var(--app-text-secondary)]">
            Contexture gives apps and agents one reviewed product model. Voiced
            pastes speech into the field you are already using.
          </p>
        </header>

        <div className="flex flex-col gap-6 min-[1024px]:gap-8">
          <ContextureCard />
          <VoicedCard />
        </div>
      </div>
    </section>
  );
}
