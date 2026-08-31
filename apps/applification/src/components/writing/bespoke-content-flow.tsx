"use client";

import { motion, useInView, useReducedMotion } from "motion/react";
import { useRef } from "react";
import {
  bespokeContentFlowSchema,
  type BespokeContentFlowProps,
} from "@/lib/rich-block-registry";

const ease = [0.22, 1, 0.36, 1] as const;
const beamCycle = 11.8;
const scanDuration = 2.6;

export function BespokeContentFlow(props: Record<string, unknown>) {
  const { caption, description }: BespokeContentFlowProps =
    bespokeContentFlowSchema.parse(props);
  const figureRef = useRef<HTMLElement>(null);
  const inView = useInView(figureRef, { amount: 0.35, once: true });
  const reduceMotion = useReducedMotion();
  const play = reduceMotion || inView;

  const reveal = (delay: number) => ({
    animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 },
    initial: false as const,
    transition: reduceMotion ? { duration: 0 } : { delay, duration: 0.42, ease },
  });

  const beam = (delay: number, duration: number) => ({
    animate: reduceMotion
      ? { opacity: 0, strokeDashoffset: 0 }
      : play
        ? {
            opacity: [0, 1, 1, 0],
            strokeDashoffset: [1, 0.82, -0.82, -1],
          }
        : { opacity: 0, strokeDashoffset: 1 },
    initial: false as const,
    transition: reduceMotion
      ? { duration: 0 }
      : {
          delay,
          duration,
          ease: "linear" as const,
          repeat: Infinity,
          repeatDelay: beamCycle - duration,
          times: [0, 0.08, 0.92, 1],
        },
  });

  const beamStyle = {
    fill: "none",
    pathLength: 1,
    stroke: "var(--writing-accent-text)",
    strokeDasharray: "0.14 0.86",
    strokeLinecap: "round" as const,
    strokeWidth: 2,
  };

  return (
    <figure
      ref={figureRef}
      className="my-10 overflow-hidden rounded-[18px] border border-[var(--app-border)] bg-[var(--app-card)]"
      data-rich-block="bespoke-content-flow"
    >
      <svg
        aria-labelledby="bespoke-flow-mobile-title bespoke-flow-mobile-description"
        className="block h-auto w-full min-[520px]:hidden"
        role="img"
        viewBox="0 0 340 520"
      >
        <title id="bespoke-flow-mobile-title">{caption}</title>
        <desc id="bespoke-flow-mobile-description">{description}</desc>
        <defs>
          <linearGradient id="flow-scan-mobile" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--writing-accent-text)" stopOpacity="0" />
            <stop offset="0.42" stopColor="var(--writing-accent-text)" stopOpacity="0.18" />
            <stop offset="0.72" stopColor="var(--writing-accent-text)" stopOpacity="0.82" />
            <stop offset="1" stopColor="var(--writing-accent-text)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="flow-chart-mobile">
            <rect x="84" y="437" width="76" height="31" rx="6" />
          </clipPath>
        </defs>

        <rect width="340" height="520" fill="var(--app-muted-section)" />
        <path d="M170 145V205M170 315V375" fill="none" stroke="color-mix(in srgb, var(--writing-accent-text) 28%, var(--app-border))" />
        <motion.g {...reveal(0.05)}>
          <rect x="64" y="35" width="212" height="110" rx="12" fill="var(--app-card)" stroke="var(--app-border)" />
          <text x="84" y="62" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.2">COMMISSION · EXACT NEED</text>
          <rect x="84" y="82" width="122" height="5" rx="2.5" fill="var(--app-text-primary)" />
          <rect x="84" y="99" width="170" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.55" />
          <rect x="84" y="113" width="142" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.38" />
          <rect x="84" y="126" width="74" height="9" rx="4.5" fill="var(--app-label)" />
        </motion.g>

        <motion.g {...reveal(0.4)}>
          <circle cx="170" cy="260" r="55" fill="var(--app-card)" stroke="var(--app-border)" strokeWidth="1.5" />
          <motion.path
            animate={play && !reduceMotion ? { scale: [0.92, 1.08, 0.92] } : { scale: 1 }}
            d="M170 235c2.5 13.2 10.8 21.5 24 24-13.2 2.5-21.5 10.8-24 24-2.5-13.2-10.8-21.5-24-24 13.2-2.5 21.5-10.8 24-24Z"
            fill="var(--writing-accent-text)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: reduceMotion ? 0 : Infinity }}
          />
          <path d="M145 238c.8 4.4 3.6 7.2 8 8-4.4.8-7.2 3.6-8 8-.8-4.4-3.6-7.2-8-8 4.4-.8 7.2-3.6 8-8Z" fill="var(--writing-accent-text)" opacity="0.65" />
          <path d="M198 273c.6 3.3 2.7 5.4 6 6-3.3.6-5.4 2.7-6 6-.6-3.3-2.7-5.4-6-6 3.3-.6 5.4-2.7 6-6Z" fill="var(--writing-accent-text)" opacity="0.8" />
          <text x="170" y="335" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.1" textAnchor="middle">CREATE · AI BUILDS IN PLACE</text>
        </motion.g>

        <motion.g {...reveal(0.8)}>
          <rect x="64" y="375" width="212" height="110" rx="12" fill="var(--app-card)" stroke="var(--app-border)" />
          <text x="84" y="402" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.2">PUBLISH · FINISHED ARTICLE</text>
          <rect x="84" y="420" width="80" height="5" rx="2.5" fill="var(--app-text-primary)" />
          <rect x="84" y="437" width="76" height="31" rx="6" fill="var(--app-label)" />
          <path d="M93 458c8-12 15-16 24-7 8 8 16 5 31-8" fill="none" stroke="var(--writing-accent-text)" strokeLinecap="round" strokeWidth="2" />
          <motion.g
            animate={
              play && !reduceMotion
                ? { opacity: [0, 1, 1, 0], y: [0, 0, 38, 45] }
                : { opacity: 0, y: 0 }
            }
            clipPath="url(#flow-chart-mobile)"
            initial={false}
            transition={
              reduceMotion
                ? { duration: 0 }
                : {
                    delay: 7.35,
                    duration: scanDuration,
                    ease: "linear",
                    repeat: Infinity,
                    repeatDelay: beamCycle - scanDuration,
                    times: [0, 0.08, 0.92, 1],
                  }
            }
          >
            <rect fill="url(#flow-scan-mobile)" height="14" width="76" x="84" y="426" />
            <path d="M84 437H160" stroke="var(--writing-accent-text)" strokeOpacity="0.9" strokeWidth="1.25" />
          </motion.g>
          <rect x="174" y="437" width="82" height="5" rx="2.5" fill="var(--app-text-secondary)" opacity="0.5" />
          <rect x="174" y="451" width="64" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.32" />
        </motion.g>

        <motion.path
          {...beam(0, 2.4)}
          {...beamStyle}
          d="M170 145H76a12 12 0 0 1-12-12V47a12 12 0 0 1 12-12h188a12 12 0 0 1 12 12v86a12 12 0 0 1-12 12h-94Z"
        />
        <motion.path
          {...beam(2.4, 1.2)}
          {...beamStyle}
          d="M170 145V205"
        />
        <motion.path
          {...beam(3.6, 2.4)}
          {...beamStyle}
          d="M170 205a55 55 0 1 1 0 110 55 55 0 1 1 0-110Z"
        />
        <motion.path
          {...beam(6, 1.2)}
          {...beamStyle}
          d="M170 315V375"
        />
        <motion.path
          {...beam(7.2, 2.6)}
          {...beamStyle}
          d="M170 375h94a12 12 0 0 1 12 12v86a12 12 0 0 1-12 12H76a12 12 0 0 1-12-12v-86a12 12 0 0 1 12-12h94Z"
        />
      </svg>

      <svg
        aria-labelledby="bespoke-flow-desktop-title bespoke-flow-desktop-description"
        className="hidden h-auto w-full min-[520px]:block"
        role="img"
        viewBox="0 0 680 350"
      >
        <title id="bespoke-flow-desktop-title">{caption}</title>
        <desc id="bespoke-flow-desktop-description">{description}</desc>

        <defs>
          <linearGradient id="flow-wash" x1="0" x2="1" y1="0" y2="1">
            <stop offset="0" stopColor="var(--app-muted-section)" />
            <stop offset="1" stopColor="var(--app-section)" />
          </linearGradient>
          <filter id="flow-glow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur stdDeviation="7" />
          </filter>
          <linearGradient id="flow-scan-desktop" x1="0" x2="0" y1="0" y2="1">
            <stop offset="0" stopColor="var(--writing-accent-text)" stopOpacity="0" />
            <stop offset="0.42" stopColor="var(--writing-accent-text)" stopOpacity="0.18" />
            <stop offset="0.72" stopColor="var(--writing-accent-text)" stopOpacity="0.82" />
            <stop offset="1" stopColor="var(--writing-accent-text)" stopOpacity="0" />
          </linearGradient>
          <clipPath id="flow-chart-desktop">
            <rect x="528" y="153" width="98" height="47" rx="7" />
          </clipPath>
        </defs>

        <rect width="680" height="350" fill="url(#flow-wash)" />

        <g fill="none" stroke="color-mix(in srgb, var(--writing-accent-text) 28%, var(--app-border))" strokeWidth="1">
          <path d="M170 174H284" />
          <path d="M396 174H510" />
        </g>

        <motion.g {...reveal(0.05)}>
          <rect x="34" y="112" width="136" height="124" rx="12" fill="var(--app-card)" stroke="var(--app-border)" />
          <text x="52" y="139" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.2">EXACT NEED</text>
          <rect x="52" y="158" width="91" height="5" rx="2.5" fill="var(--app-text-primary)" />
          <rect x="52" y="174" width="72" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.7" />
          <rect x="52" y="187" width="96" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.45" />
          <rect x="52" y="209" width="66" height="12" rx="6" fill="var(--app-label)" />
        </motion.g>

        <motion.g {...reveal(0.42)}>
          <circle cx="340" cy="174" r="56" fill="var(--app-card)" stroke="var(--app-border)" strokeWidth="1.5" />
          <circle cx="340" cy="174" r="13" fill="var(--writing-accent-text)" opacity="0.16" filter="url(#flow-glow)" />
          <motion.path
            animate={play && !reduceMotion ? { scale: [0.92, 1.08, 0.92] } : { scale: 1 }}
            d="M340 149c2.5 13.2 10.8 21.5 24 24-13.2 2.5-21.5 10.8-24 24-2.5-13.2-10.8-21.5-24-24 13.2-2.5 21.5-10.8 24-24Z"
            fill="var(--writing-accent-text)"
            style={{ transformBox: "fill-box", transformOrigin: "center" }}
            transition={{ duration: 2.2, ease: "easeInOut", repeat: reduceMotion ? 0 : Infinity }}
          />
          <path d="M315 152c.8 4.4 3.6 7.2 8 8-4.4.8-7.2 3.6-8 8-.8-4.4-3.6-7.2-8-8 4.4-.8 7.2-3.6 8-8Z" fill="var(--writing-accent-text)" opacity="0.65" />
          <path d="M368 187c.6 3.3 2.7 5.4 6 6-3.3.6-5.4 2.7-6 6-.6-3.3-2.7-5.4-6-6 3.3-.6 5.4-2.7 6-6Z" fill="var(--writing-accent-text)" opacity="0.8" />
          <text x="340" y="250" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.2" textAnchor="middle">AI BUILDS IN PLACE</text>
        </motion.g>

        <motion.g {...reveal(0.86)}>
          <rect x="510" y="83" width="136" height="182" rx="12" fill="var(--app-card)" stroke="var(--app-border)" />
          <rect x="528" y="104" width="64" height="5" rx="2.5" fill="var(--app-text-primary)" />
          <rect x="528" y="120" width="98" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.55" />
          <rect x="528" y="132" width="81" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.4" />

          <motion.g {...reveal(1.06)}>
            <rect x="528" y="153" width="98" height="47" rx="7" fill="var(--app-label)" />
            <path d="M542 188c11-19 20-25 32-12 10 11 20 7 38-12" fill="none" stroke="var(--writing-accent-text)" strokeLinecap="round" strokeWidth="2" />
            <motion.g
              animate={
                play && !reduceMotion
                  ? { opacity: [0, 1, 1, 0], y: [0, 0, 51, 58] }
                  : { opacity: 0, y: 0 }
              }
              clipPath="url(#flow-chart-desktop)"
              initial={false}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay: 7.35,
                      duration: scanDuration,
                      ease: "linear",
                      repeat: Infinity,
                      repeatDelay: beamCycle - scanDuration,
                      times: [0, 0.08, 0.92, 1],
                    }
              }
            >
              <rect fill="url(#flow-scan-desktop)" height="16" width="98" x="528" y="142" />
              <path d="M528 153H626" stroke="var(--writing-accent-text)" strokeOpacity="0.9" strokeWidth="1.5" />
            </motion.g>
            <motion.circle
              animate={
                play && !reduceMotion
                  ? { opacity: [0.55, 1, 0.55], scale: [1, 1.65, 1] }
                  : { opacity: 1, scale: 1 }
              }
              cx="612"
              cy="164"
              fill="var(--writing-accent-text)"
              initial={false}
              r="3"
              style={{ transformBox: "fill-box", transformOrigin: "center" }}
              transition={
                reduceMotion
                  ? { duration: 0 }
                  : {
                      delay: 9.35,
                      duration: 0.55,
                      ease,
                      repeat: Infinity,
                      repeatDelay: beamCycle - 0.55,
                    }
              }
            />
          </motion.g>

          <motion.g {...reveal(1.22)}>
            <rect x="528" y="214" width="26" height="30" rx="5" fill="var(--app-control)" />
            <rect x="563" y="214" width="63" height="5" rx="2.5" fill="var(--app-text-secondary)" opacity="0.55" />
            <rect x="563" y="226" width="49" height="4" rx="2" fill="var(--app-text-secondary)" opacity="0.35" />
          </motion.g>
        </motion.g>

        <motion.path
          {...beam(0, 2.4)}
          {...beamStyle}
          d="M170 174v50a12 12 0 0 1-12 12H46a12 12 0 0 1-12-12V124a12 12 0 0 1 12-12h112a12 12 0 0 1 12 12v50Z"
        />
        <motion.path
          {...beam(2.4, 1.2)}
          {...beamStyle}
          d="M170 174H284"
        />
        <motion.path
          {...beam(3.6, 2.4)}
          {...beamStyle}
          d="M284 174a56 56 0 1 0 112 0 56 56 0 1 0-112 0Z"
        />
        <motion.path
          {...beam(6, 1.2)}
          {...beamStyle}
          d="M396 174H510"
        />
        <motion.path
          {...beam(7.2, 2.6)}
          {...beamStyle}
          d="M510 174V95a12 12 0 0 1 12-12h112a12 12 0 0 1 12 12v158a12 12 0 0 1-12 12H522a12 12 0 0 1-12-12v-79Z"
        />

        <text x="34" y="319" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.1">COMMISSION</text>
        <text x="340" y="319" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.1" textAnchor="middle">CREATE</text>
        <text x="646" y="319" fill="var(--app-text-muted)" fontFamily="var(--font-caption)" fontSize="9" fontWeight="700" letterSpacing="1.1" textAnchor="end">PUBLISH</text>
      </svg>
      <figcaption className="border-t border-[var(--app-border)] px-5 py-4 text-[13px] leading-[1.55] text-[var(--app-text-muted)]">
        {caption}
      </figcaption>
    </figure>
  );
}
