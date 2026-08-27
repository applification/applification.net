import Link from "next/link";

const focusClasses =
  "focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]";

const footerLinks = [
  {
    href: "https://github.com/applification",
    label: "GitHub",
    external: true,
  },
  {
    href: "https://www.linkedin.com/in/davehudson",
    label: "LinkedIn",
    external: true,
  },
  { href: "/writing", label: "Writing", external: false },
  {
    href: "mailto:dave@applification.net?subject=Applification%20enquiry",
    label: "Contact",
    external: false,
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
            Dave Hudson&nbsp; · &nbsp;Contract AI Product Engineer
          </span>
        </div>

        <nav
          aria-label="Footer navigation"
          className="flex flex-wrap items-center gap-x-[18px] gap-y-3 text-sm font-medium text-[var(--app-text-secondary)] min-[821px]:gap-6 min-[821px]:text-[13px] min-[821px]:font-normal"
        >
          {footerLinks.map((item) => {
            const classes = `transition-colors hover:text-[var(--app-text-primary)] ${focusClasses}`;

            if (item.external) {
              return (
                <a
                  className={classes}
                  href={item.href}
                  key={item.href}
                  rel="noreferrer"
                  target="_blank"
                >
                  {item.label}
                  <span className="sr-only">, opens in a new tab</span>
                </a>
              );
            }

            if (item.href.startsWith("/")) {
              return (
                <Link className={classes} href={item.href} key={item.href}>
                  {item.label}
                </Link>
              );
            }

            return (
              <a className={classes} href={item.href} key={item.href}>
                {item.label}
              </a>
            );
          })}
        </nav>
      </div>
    </footer>
  );
}
