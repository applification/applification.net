import { ExternalLink } from "@/components/external-link";
import type { ComponentType } from "react";
import { contractPositioning } from "@/lib/contract-positioning";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

type SocialLink = {
  href: string;
  label: string;
  icon: ComponentType;
};

function GitHubIcon() {
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

function LinkedInIcon() {
  return (
    <svg
      aria-hidden="true"
      className="size-4 shrink-0 fill-current"
      viewBox="0 0 448 512"
    >
      <path d="M100.28 448H7.4V148.9h92.88ZM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3ZM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448Z" />
    </svg>
  );
}

const socialLinks: SocialLink[] = [
  {
    href: "https://github.com/applification",
    label: "GitHub",
    icon: GitHubIcon,
  },
  {
    href: "https://www.linkedin.com/in/hudsond",
    label: "LinkedIn",
    icon: LinkedInIcon,
  },
];

export function SiteFooter() {
  return (
    <footer className="bg-[var(--app-section)]">
      <div className="mx-auto flex w-full max-w-[1200px] flex-col gap-5 px-6 py-8 min-[821px]:min-h-[101px] min-[821px]:w-[calc(100%-48px)] min-[821px]:flex-row min-[821px]:items-center min-[821px]:justify-between min-[821px]:px-0">
        <div className="flex flex-col gap-1">
          <span className="font-caption text-[11px] font-bold tracking-[1px] text-[var(--app-text-primary)] uppercase min-[821px]:text-xs min-[821px]:font-semibold">
            Applification Ltd
          </span>
          <span className="text-sm leading-[1.4] text-[var(--app-text-secondary)] min-[821px]:text-[13px] min-[821px]:leading-[17px]">
            Dave Hudson&nbsp; · &nbsp;{contractPositioning.role}
          </span>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-[18px] gap-y-3 text-sm font-medium text-[var(--app-text-secondary)] min-[821px]:gap-6 min-[821px]:text-[13px] min-[821px]:font-normal"
        >
          {socialLinks.map((item) => {
            const Icon = item.icon;
            const classes = `link-sweep inline-flex min-h-11 items-center gap-2 transition-colors hover:text-[var(--app-text-primary)] ${focusClasses}`;

            return (
              <ExternalLink
                className={classes}
                href={item.href}
                key={item.href}
              >
                <Icon />
                <span className="link-sweep-label">{item.label}</span>
              </ExternalLink>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
