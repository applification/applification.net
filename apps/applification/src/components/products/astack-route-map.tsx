"use client";

import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { ExternalLink } from "@/components/external-link";
import { astackRouteExamples } from "./astack-route-examples";
import styles from "./astack-route-map.module.css";

const routes = [
  {
    name: "Feature",
    tone: "feature",
    steps: ["Agree the outcome", "Implement in slices"],
  },
  {
    name: "Bug fix",
    tone: "bug",
    steps: ["Reproduce the symptom", "Fix and rerun the path"],
  },
  {
    name: "Refactor",
    tone: "refactor",
    steps: ["Name the invariant", "Change in small steps"],
  },
  {
    name: "Performance",
    tone: "performance",
    steps: ["Measure a baseline", "Change one cause"],
  },
  {
    name: "Investigation",
    tone: "investigation",
    steps: ["Gather evidence", "Answer or advise"],
    endsWithAnswer: true,
  },
  {
    name: "Pull request",
    tone: "pr",
    steps: ["Read the full diff", "Trace affected consumers"],
  },
  {
    name: "App control",
    tone: "control",
    steps: ["Build or adopt a CLI", "Prove a user path"],
  },
  {
    name: "Project setup",
    tone: "setup",
    steps: ["Inspect the repository", "Record local proof routes"],
    setup: true,
  },
];

export function AstackRouteMap() {
  const [exampleId, setExampleId] = useState("all");
  const example = astackRouteExamples.find((item) => item.id === exampleId);
  const scrollRef = useRef<HTMLDivElement>(null);
  const selectedRef = useRef<HTMLLIElement>(null);
  const selectId = useId();
  const noteId = useId();

  useEffect(() => {
    const scroll = scrollRef.current;
    const selected = selectedRef.current;
    if (scroll && selected) {
      const region = scroll.getBoundingClientRect();
      const route = selected.getBoundingClientRect();
      scroll.scrollLeft +=
        route.left - region.left - (region.width - route.width) / 2;
    }
  }, [exampleId]);

  return (
    <figure className={styles.map}>
      <figcaption className="flex flex-wrap items-baseline justify-between gap-2 px-5 pt-5 min-[720px]:px-7">
        <span className="font-caption text-xs font-semibold text-[var(--app-label-text)]">
          astack / The route map
        </span>
        <h2 className="text-sm font-semibold text-[var(--app-text-primary)]">
          One task. The right line.
        </h2>
      </figcaption>
      <div className="grid gap-3 border-b border-[var(--app-border)] px-5 py-5 min-[720px]:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] min-[720px]:gap-7 min-[720px]:px-7">
        <div className="flex min-w-0 flex-col gap-2">
          <Label htmlFor={selectId}>Choose an eval example</Label>
          <Select value={exampleId} onValueChange={setExampleId}>
            <SelectTrigger id={selectId} className="min-h-11 w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent
              position="popper"
              className="max-w-[calc(100vw-48px)]"
            >
              <SelectGroup>
                <SelectItem value="all">Show all routes</SelectItem>
                {astackRouteExamples.map((item) => (
                  <SelectItem key={item.id} value={item.id}>
                    {item.request}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <ExternalLink
            className="link-sweep inline-flex min-h-11 w-fit items-center text-sm text-[var(--app-label-text)]"
            href="https://github.com/applification/astack/blob/main/evals/routing.md"
          >
            <span className="link-sweep-label">All routing examples</span>
          </ExternalLink>
        </div>
        <div aria-live="polite" aria-atomic="true" className="min-w-0">
          <p className="text-sm font-semibold text-[var(--app-text-primary)]">
            {example
              ? `Expected route: ${example.route}`
              : "Choose a request to trace its route."}
          </p>
          <p className="mt-2 text-sm leading-relaxed text-[var(--app-text-secondary)]">
            {example?.decision ??
              "These examples come from astack's routing evals. Each shows the expected decision, with the selected line highlighted below."}
          </p>
        </div>
      </div>
      <p className="px-5 pt-3 text-sm text-[var(--app-text-secondary)] min-[720px]:px-7 min-[1280px]:hidden">
        Scroll sideways to follow every route.
      </p>
      <div
        ref={scrollRef}
        className={styles.scroll}
        role="region"
        aria-label="astack engineering routes"
        aria-describedby={noteId}
        tabIndex={0}
      >
        <div className={styles.diagram}>
          <div className={styles.entry}>
            <p className="font-data text-sm font-semibold">
              $applification:astack &lt;task&gt;
            </p>
            <p className="mt-2 text-sm text-[var(--app-text-secondary)]">
              Choose a route by the intended outcome.
            </p>
          </div>
          <svg
            aria-hidden="true"
            className={styles.branches}
            viewBox="0 0 1040 64"
            preserveAspectRatio="none"
          >
            {routes.map((route, index) => {
              const x = 65 + index * 130;
              return (
                <path
                  key={route.name}
                  data-selected={example?.route === route.name || undefined}
                  data-muted={
                    (!!example && example.route !== route.name) || undefined
                  }
                  className={`${styles.branch} ${styles[route.tone]}`}
                  d={`M 520 0 C 520 30, ${x} 20, ${x} 64`}
                  fill="none"
                  stroke="var(--route-colour)"
                  strokeWidth="2"
                  strokeDasharray={route.setup ? "4 4" : undefined}
                />
              );
            })}
          </svg>
          <ol className={styles.routes}>
            {routes.map((route) => (
              <li
                ref={example?.route === route.name ? selectedRef : undefined}
                data-selected={example?.route === route.name || undefined}
                data-muted={
                  (!!example && example.route !== route.name) || undefined
                }
                className={`${styles.route} ${styles[route.tone]}`}
                key={route.name}
                style={
                  {
                    "--route-line-style": route.setup ? "dashed" : "solid",
                  } as CSSProperties
                }
              >
                <h3 className={styles.label}>{route.name}</h3>
                <ol className={styles.steps}>
                  {route.steps.map((step) => (
                    <li key={step}>{step}</li>
                  ))}
                </ol>
                {route.endsWithAnswer ? (
                  <p className={styles.answer}>Ends with an answer</p>
                ) : (
                  <span className={styles.continuation} aria-hidden="true" />
                )}
              </li>
            ))}
          </ol>
          <div
            className={styles.finish}
            data-selected={
              (!!example && example.route !== "Investigation") || undefined
            }
          >
            <p className="font-caption text-[11px] font-semibold text-[var(--app-text-muted)]">
              For kept repository changes
            </p>
            <ol className="mt-3 grid grid-cols-3 gap-6">
              {[
                ["Proof", "Observe the result"],
                ["Review", "Check intent and quality"],
                ["Pull request", "Attach evidence and gaps"],
              ].map(([title, description]) => (
                <li
                  key={title}
                  className="border-l-2 border-[var(--app-action)] pl-3"
                >
                  <p className="text-sm font-semibold text-[var(--app-text-primary)]">
                    {title}
                  </p>
                  <p className="mt-1 text-xs text-[var(--app-text-secondary)]">
                    {description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
      <p
        className="border-t border-[var(--app-border)] px-5 py-4 text-xs leading-relaxed text-[var(--app-text-secondary)] min-[720px]:px-7"
        id={noteId}
      >
        A compact view of the workflow. Investigation ends with an answer.
        Project setup is a task-specific path alongside the seven work routes.
      </p>
    </figure>
  );
}
