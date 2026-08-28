import type { CSSProperties, ReactNode } from "react";
import {
  Archive,
  Download,
  Inbox,
  LockKeyhole,
  Mic,
  TextCursorInput,
} from "lucide-react";
import { DetailContextRail } from "@/components/detail-context-rail";
import { ContractCta } from "@/components/home/contract-cta";
import { ProductDetailEyebrow } from "@/components/products/product-detail";

const voicedTheme = {
  "--app-accent": "#2f7a52",
  "--app-label-text": "#2f7a52",
  "--app-text-primary": "#173f32",
  "--app-text-secondary": "#4d665e",
  "--app-text-muted": "#618374",
  "--app-focus": "#2f7a52",
} as CSSProperties;

const waveformHeights = [22, 40, 66, 34, 78, 54, 28, 46, 70, 38];
const waveformColors = [
  "bg-[#75c99a]",
  "bg-[#618374]",
  "bg-[#a7e3c1]",
  "bg-[#75c99a]",
  "bg-[#a7e3c1]",
  "bg-[#618374]",
  "bg-[#75c99a]",
  "bg-[#618374]",
  "bg-[#a7e3c1]",
  "bg-[#75c99a]",
];

const captureRoutes = [
  {
    shortcut: "Hold ⌘",
    shortcutLabel: "Hold Command",
    title: "Speak and paste",
    description: "Transcribe into the previously focused editor.",
    icon: <Mic aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
  {
    shortcut: "⇧ + ⌘",
    shortcutLabel: "Shift plus Command",
    title: "Save quietly",
    description: "Record, release and send the capture to Inbox.",
    icon: <Inbox aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
  {
    shortcut: "Shift ×2",
    shortcutLabel: "Shift twice",
    title: "Capture selection",
    description: "Take the selected text without changing tools.",
    icon: <TextCursorInput aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
  {
    shortcut: "⌥ Space",
    shortcutLabel: "Option Space",
    title: "Open the shelf",
    description: "Search, edit, export or move saved captures.",
    icon: <Archive aria-hidden="true" size={25} strokeWidth={1.7} />,
  },
];

const buildRows = [
  {
    label: "Native application",
    value: "Swift 6 · SwiftUI · macOS 14+",
  },
  {
    label: "Speech and storage",
    value: "Local Whisper · readable JSON · atomic writes",
  },
  {
    label: "Distribution",
    value: "Developer ID · Hardened Runtime · notarised",
  },
];

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#2f7a52]";

function GithubIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 fill-current"
      viewBox="0 0 24 24"
    >
      <path d="M12 2C6.48 2 2 6.58 2 12.23c0 4.52 2.87 8.35 6.84 9.71.5.1.68-.22.68-.49v-1.92c-2.78.62-3.37-1.22-3.37-1.22-.45-1.18-1.11-1.49-1.11-1.49-.91-.64.07-.63.07-.63 1 .08 1.53 1.06 1.53 1.06.9 1.56 2.35 1.11 2.92.85.09-.66.35-1.11.64-1.37-2.22-.26-4.56-1.14-4.56-5.06 0-1.12.39-2.03 1.03-2.75-.1-.26-.45-1.3.1-2.71 0 0 .84-.28 2.75 1.05A9.36 9.36 0 0 1 12 6.91a9.3 9.3 0 0 1 2.5.35c1.91-1.33 2.75-1.05 2.75-1.05.55 1.41.2 2.45.1 2.71.64.72 1.03 1.63 1.03 2.75 0 3.93-2.34 4.79-4.57 5.05.36.32.68.94.68 1.9v2.83c0 .27.18.59.69.49A10.25 10.25 0 0 0 22 12.23C22 6.58 17.52 2 12 2Z" />
    </svg>
  );
}

function VoicedExternalLink({
  children,
  href,
  primary = false,
  roomy = false,
}: {
  children: ReactNode;
  href: string;
  primary?: boolean;
  roomy?: boolean;
}) {
  return (
    <a
      className={`${
        primary
          ? "border-[#b8cec0] bg-[#173f32] text-[#f7faf8] hover:bg-[#254f42]"
          : "border-[#b8cec0] bg-[#f7faf8] text-[#173f32] hover:bg-[#eaf3ed]"
      } ${
        roomy ? "min-h-[44px] px-[18px]" : "min-h-[42px] px-[17px]"
      } ${focusClasses} inline-flex w-fit items-center justify-center gap-2 rounded-full border text-sm font-semibold transition-[background-color,transform] active:translate-y-px`}
      href={href}
      rel="noreferrer"
      target="_blank"
    >
      {children}
      <span className="sr-only">, opens in a new tab</span>
    </a>
  );
}

function VoicedCapturePreview() {
  return (
    <figure
      aria-label="Voiced local and private capture preview. Hold Right Command and say: Turn that rough thought into something I can edit, without breaking focus. Speak, review and paste after eight seconds."
      className="min-w-0 rounded-[22px] bg-[#f7faf8] p-5 shadow-[0_14px_32px_#00080814] ring-1 ring-inset ring-[#c5d6ca] min-[1024px]:h-[440px] min-[1024px]:p-6"
      role="img"
    >
      <div aria-hidden="true" className="flex flex-col">
        <div className="font-caption flex items-center justify-between gap-4 text-[10px] leading-[14px] font-bold tracking-[0.7px] text-[#2f7a52] min-[1024px]:text-[11px]">
          <span>VOICED&nbsp; / &nbsp;CAPTURE</span>
          <span className="text-[#4d665e]">LOCAL&nbsp; · &nbsp;PRIVATE</span>
        </div>

        <div className="mt-[18px] grid min-h-[154px] grid-cols-[88px_minmax(0,1fr)] items-center gap-4 rounded-2xl bg-[#173f32] p-[18px] min-[560px]:grid-cols-[108px_minmax(0,1fr)] min-[560px]:gap-6 min-[1024px]:min-h-[170px] min-[1024px]:px-[22px] min-[1024px]:py-[31px]">
          <div className="flex aspect-square w-[88px] flex-col justify-between rounded-[18px] border border-[#75c99a] bg-[#254f42] p-3 text-[#f7faf8] min-[560px]:w-[108px] min-[560px]:p-[14px]">
            <span className="text-[34px] leading-none min-[560px]:text-[38px]">
              ⌘
            </span>
            <span className="font-caption text-[7px] font-bold tracking-[0.6px] text-[#a7e3c1] min-[560px]:text-[8px]">
              RIGHT COMMAND
            </span>
          </div>

          <div className="flex h-[92px] min-w-0 items-center justify-center gap-[clamp(5px,1.3vw,7px)] overflow-hidden">
            {waveformHeights.map((height, index) => (
              <span
                className={`${waveformColors[index]} w-[5px] shrink-0 rounded-full min-[560px]:w-[7px]`}
                key={`${height}-${index}`}
                style={{ height }}
              />
            ))}
          </div>
        </div>

        <p className="font-heading mt-[18px] text-xl leading-[1.3] text-[#173f32] min-[1024px]:text-[22px]">
          “Turn that rough thought into something I can edit, without breaking
          focus.”
        </p>

        <div className="font-caption mt-[18px] flex items-center justify-between gap-4 text-[10px] leading-[13px] font-bold tracking-[0.65px] text-[#2f7a52]">
          <span>SPEAK&nbsp; → &nbsp;REVIEW&nbsp; → &nbsp;PASTE</span>
          <span className="font-data text-xs leading-4 text-[#4d665e]">
            00:08
          </span>
        </div>
      </div>
    </figure>
  );
}

function VoicedHero() {
  return (
    <section
      aria-labelledby="voiced-heading"
      className="bg-[#eaf3ed] px-6 py-12 min-[720px]:px-12 min-[1024px]:min-h-[580px] min-[1024px]:pt-[66px] min-[1024px]:pb-[70px] min-[1440px]:px-[120px]"
    >
      <div className="mx-auto w-full max-w-[1200px]">
        <DetailContextRail
          backHref="/products"
          backLabel="Product index"
          detail="Voiced"
          family="Products"
        />
        <div className="mt-5 grid gap-10 min-[1280px]:grid-cols-[520px_minmax(0,610px)] min-[1280px]:items-center min-[1280px]:gap-[70px]">
          <div className="flex flex-col items-start gap-5">
            <h1
              className="font-heading max-w-[560px] text-[48px] leading-[0.98] font-medium text-[#173f32] min-[1024px]:text-[60px] min-[1024px]:leading-[1.02]"
              id="voiced-heading"
            >
              Capture the thought. Keep your hands on the work.
            </h1>
            <p className="max-w-[560px] text-base leading-[1.55] text-[#4d665e] min-[1024px]:text-lg min-[1024px]:leading-[1.5]">
              A local capture layer for macOS. Speak, select or type, then paste
              it, queue it or keep it on a shelf you control.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <VoicedExternalLink
                href="https://voiced.applification.net/"
                primary
              >
                Download Voiced
                <Download aria-hidden="true" size={16} strokeWidth={1.8} />
              </VoicedExternalLink>
              <VoicedExternalLink href="https://github.com/applification/voiced">
                GitHub source
                <GithubIcon />
              </VoicedExternalLink>
            </div>
          </div>

          <VoicedCapturePreview />
        </div>
      </div>
    </section>
  );
}

function VoicedRationale() {
  return (
    <section
      aria-labelledby="voiced-rationale-heading"
      className="bg-[#173f32] px-6 py-14 text-[#f7faf8] min-[1024px]:flex min-[1024px]:min-h-[370px] min-[1024px]:items-center min-[1024px]:px-20 min-[1024px]:py-[62px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-9 min-[1024px]:grid-cols-[500px_minmax(0,690px)] min-[1024px]:items-center min-[1024px]:gap-[90px]">
        <div>
          <p className="font-caption text-[11px] font-bold tracking-[1px] text-[#a7e3c1] min-[1024px]:text-xs min-[1024px]:font-semibold">
            WHY THIS EXISTS
          </p>
          <h2
            className="font-heading mt-[18px] text-[36px] leading-[1.08] font-medium min-[1024px]:text-[40px]"
            id="voiced-rationale-heading"
          >
            Good thoughts often arrive while the cursor is somewhere else.
          </h2>
        </div>

        <div>
          <p className="text-base leading-[1.55] text-[#cfe0d6] min-[1024px]:text-[17px]">
            Most dictation tools ask you to move into their interface. Voiced
            works from the editor already in focus, then gives longer captures a
            quiet place to wait. Nothing needs an account or a cloud transcript.
          </p>
          <div className="mt-[18px] flex items-center gap-[14px] rounded-[14px] bg-[#254f42] p-[18px]">
            <LockKeyhole
              aria-hidden="true"
              className="shrink-0 text-[#a7e3c1]"
              size={26}
              strokeWidth={1.7}
            />
            <p className="text-[15px] leading-[1.5] font-semibold text-[#f7faf8] min-[1024px]:text-base">
              Local Whisper transcription. No account, telemetry, cloud storage
              or server.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

function VoicedCaptureRoutes() {
  return (
    <section
      aria-labelledby="voiced-capture-model-heading"
      className="bg-[#f7faf8] px-6 py-14 min-[1024px]:min-h-[560px] min-[1024px]:px-20 min-[1024px]:py-[58px]"
    >
      <div className="mx-auto w-full max-w-[1280px]">
        <div className="grid gap-4 min-[1024px]:grid-cols-[690px_minmax(0,400px)] min-[1024px]:items-end min-[1024px]:justify-between min-[1024px]:gap-[190px]">
          <div>
            <ProductDetailEyebrow>ONE CAPTURE MODEL</ProductDetailEyebrow>
            <h2
              className="font-heading mt-3 text-[36px] leading-[1.08] font-medium text-[#173f32] min-[1024px]:text-[40px]"
              id="voiced-capture-model-heading"
            >
              Voice, selection and typed notes all land in the same shelf.
            </h2>
          </div>
          <p className="text-[15px] leading-[1.55] text-[#4d665e]">
            Quick captures paste straight back. Anything worth keeping can stay
            in Inbox until it is edited, copied or moved to Done.
          </p>
        </div>

        <ol className="mt-[30px] grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {captureRoutes.map((route) => (
            <li
              className="flex min-h-[260px] flex-col gap-3.5 rounded-2xl bg-[#eaf3ed] p-[22px] min-[1024px]:min-h-[300px]"
              key={route.shortcut}
            >
              <span className="text-[#2f7a52]">{route.icon}</span>
              <kbd
                aria-label={route.shortcutLabel}
                className="font-data block text-[13px] leading-[19px] font-bold text-[#4d665e]"
              >
                {route.shortcut}
              </kbd>
              <h3 className="font-heading text-2xl leading-[1.12] font-medium text-[#173f32]">
                {route.title}
              </h3>
              <p className="text-sm leading-[1.5] text-[#4d665e]">
                {route.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function VoicedBuild() {
  return (
    <section
      aria-labelledby="voiced-build-heading"
      className="bg-[#f3f4f6] px-6 py-14 min-[1024px]:min-h-[430px] min-[1024px]:px-20 min-[1024px]:py-[99px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-10 min-[1024px]:grid-cols-[500px_minmax(0,700px)] min-[1024px]:items-center min-[1024px]:gap-20">
        <div>
          <ProductDetailEyebrow>HOW IT WAS BUILT</ProductDetailEyebrow>
          <h2
            className="font-heading mt-4 text-[35px] leading-[1.08] font-medium text-[#173f32] min-[1024px]:text-[38px] min-[1024px]:leading-[1.1]"
            id="voiced-build-heading"
          >
            A native Mac utility built around recoverable actions.
          </h2>
          <p className="mt-4 text-[15px] leading-[1.55] text-[#4d665e] min-[1024px]:text-base">
            Voiced uses one CaptureItem across voice, selection and typed input.
            Clipboard writes restore the previous value when safe, storage is
            atomic, and corrupt data gets a recovery copy before the shelf
            starts clean.
          </p>
        </div>

        <dl>
          {buildRows.map((row) => (
            <div
              className="grid min-h-[59px] gap-1 border-t border-[#b8cec0] py-4 sm:grid-cols-[150px_minmax(0,1fr)] sm:items-center sm:gap-6 sm:py-0"
              key={row.label}
            >
              <dt className="font-caption text-[11px] font-bold text-[#2f7a52]">
                {row.label}
              </dt>
              <dd className="text-[15px] text-[#173f32]">{row.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}

function VoicedAvailability() {
  return (
    <section
      aria-labelledby="voiced-availability-heading"
      className="bg-white px-6 py-14 min-[1024px]:min-h-[270px] min-[1024px]:px-20 min-[1024px]:py-[50px]"
    >
      <div className="mx-auto grid w-full max-w-[1280px] gap-8 min-[1024px]:grid-cols-[760px_minmax(0,1fr)] min-[1024px]:items-center min-[1024px]:justify-between min-[1024px]:gap-[120px]">
        <div>
          <ProductDetailEyebrow>
            WHERE TO GET IT&nbsp; / &nbsp;OPEN SOURCE
          </ProductDetailEyebrow>
          <h2
            className="font-heading mt-3 text-[35px] leading-[1.08] font-medium text-[#173f32] min-[1024px]:text-[38px] min-[1024px]:leading-[1.1]"
            id="voiced-availability-heading"
          >
            Download the notarised Mac app or build it yourself.
          </h2>
          <p className="mt-3 text-[15px] leading-[1.55] text-[#4d665e]">
            Voiced is MIT licensed and distributed directly for macOS 14 or
            newer. The source includes local build, packaging and smoke-test
            guides.
          </p>
        </div>

        <div className="flex flex-wrap gap-2.5 min-[1024px]:w-fit min-[1024px]:flex-col min-[1024px]:items-end min-[1024px]:justify-self-end">
          <VoicedExternalLink
            href="https://voiced.applification.net/"
            primary
            roomy
          >
            Download Voiced
            <Download aria-hidden="true" size={16} strokeWidth={1.8} />
          </VoicedExternalLink>
          <VoicedExternalLink
            href="https://github.com/applification/voiced"
            roomy
          >
            View on GitHub
            <GithubIcon />
          </VoicedExternalLink>
        </div>
      </div>
    </section>
  );
}

export function VoicedProductPage() {
  return (
    <main className="overflow-x-clip" style={voicedTheme}>
      <VoicedHero />
      <VoicedRationale />
      <VoicedCaptureRoutes />
      <VoicedBuild />
      <VoicedAvailability />
      <ContractCta
        description="I can join an existing team or assemble the product, design and engineering team needed to deliver the project. Remote work across the UK."
        title="Need a senior product engineer or a team to build your AI product?"
        variant="dark"
      />
    </main>
  );
}
