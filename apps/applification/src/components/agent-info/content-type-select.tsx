"use client";

import { useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const sections = [
  { value: "client-work", label: "Client work" },
  { value: "writing", label: "Writing" },
  { value: "products", label: "Products" },
];
const subscribe = () => () => {};
const clientSnapshot = () => true;
const serverSnapshot = () => false;
const triggerClass =
  "h-11 min-h-11 w-full border-[var(--app-border)] bg-[var(--app-card)] px-3 text-base text-[var(--app-text-primary)] motion-reduce:transition-none";

export function ContentTypeSelect() {
  const hydrated = useSyncExternalStore(
    subscribe,
    clientSnapshot,
    serverSnapshot,
  );

  // Preserve the GET form for JavaScript-free clients. Explicit appearance and
  // height also avoid Safari's native select sizing before hydration.
  if (!hydrated) {
    return (
      <div className="relative">
        <select
          id="catalog-section"
          name="type"
          defaultValue="client-work"
          className={`${triggerClass} appearance-none rounded-lg border pr-9 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[var(--app-focus)]`}
        >
          {sections.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        <ChevronDown
          aria-hidden="true"
          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
        />
      </div>
    );
  }

  return (
    <Select name="type" defaultValue="client-work">
      <SelectTrigger id="catalog-section" className={triggerClass}>
        <SelectValue />
      </SelectTrigger>
      <SelectContent
        position="popper"
        className="motion-reduce:animate-none motion-reduce:transition-none"
      >
        {sections.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
