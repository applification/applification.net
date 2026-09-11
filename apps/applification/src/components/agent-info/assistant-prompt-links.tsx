"use client";

import { useId, useRef, useState } from "react";
import { ArrowUpRight, Copy, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { agentsCopy, assistantPromptLinks } from "@/lib/content/site-pages";
import { AssistantLogo } from "./assistant-logos";

export function AssistantPromptComposer() {
  const id = useId();
  const promptRef = useRef<HTMLTextAreaElement>(null);
  const [prompt, setPrompt] = useState<string>(agentsCopy.prompt);
  const [copyStatus, setCopyStatus] = useState("");
  const hasPrompt = prompt.trim().length > 0;
  const geminiFormId = `${id}-gemini`;

  async function copyPrompt(destination: "clipboard" | "gemini") {
    // Read the field itself so browser autofill and edits are copied exactly.
    const text = promptRef.current?.value ?? prompt;
    if (!text.trim()) return;
    try {
      await navigator.clipboard.writeText(text);
      if (promptRef.current?.value !== text) return;
      setCopyStatus(destination === "gemini"
        ? "Prompt copied. Paste it into Gemini to start your conversation."
        : "Prompt copied. Paste it into your chat.");
    } catch {
      if (promptRef.current?.value !== text) return;
      setCopyStatus(destination === "gemini"
        ? "Select and copy your prompt, then paste it into Gemini."
        : "Select and copy your prompt, then paste it into your chat.");
      promptRef.current?.focus();
      promptRef.current?.select();
    }
  }

  return (
    <div className="space-y-4">
      {/* Gemini needs a plain chat URL; its separate form omits the q field. */}
      <form id={geminiFormId} action="https://gemini.google.com/app" method="get" target="_blank" rel="noopener noreferrer" onSubmit={() => { void copyPrompt("gemini"); }} />
      <form
        aria-label="Start a conversation with your prompt"
        action="https://chatgpt.com/"
        method="get"
        target="_blank"
        rel="noopener noreferrer"
        onReset={() => { setPrompt(agentsCopy.prompt); setCopyStatus(""); }}
        className="space-y-5"
      >
        <div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-1">
            <label htmlFor={`${id}-prompt`} className="text-base font-medium text-[var(--app-text-primary)]">Your prompt</label>
            <div className="ml-auto flex items-center">
              <Button type="reset" variant="ghost" className="min-h-11 gap-2 px-1.5 text-[var(--app-text-secondary)] motion-reduce:transition-none">
                <RotateCcw aria-hidden="true" /> Reset prompt
              </Button>
              <Button type="button" variant="ghost" size="icon" aria-label="Copy prompt" title="Copy prompt" disabled={!hasPrompt} onClick={() => { void copyPrompt("clipboard"); }} className="size-11 text-[var(--app-text-secondary)] motion-reduce:transform-none motion-reduce:transition-none">
                <Copy aria-hidden="true" />
              </Button>
            </div>
          </div>
          <Textarea
            ref={promptRef}
            id={`${id}-prompt`}
            name="q"
            required
            rows={6}
            value={prompt}
            onChange={(event) => { setPrompt(event.target.value); setCopyStatus(""); }}
            aria-describedby={`${id}-hint`}
            className="min-h-48 resize-y bg-[var(--app-card)] p-4 text-base leading-relaxed text-[var(--app-text-primary)] md:text-base dark:bg-[var(--app-card)] motion-reduce:transition-none"
          />
          <p id={`${id}-hint`} className="mt-2 text-sm text-[var(--app-text-muted)]">Add your project, a question, or what you’d like to explore.</p>
          <p role="status" className="mt-2 text-sm text-[var(--app-text-secondary)] empty:hidden">{copyStatus}</p>
        </div>
        <div role="group" aria-label="Open this prompt with an assistant" className="flex flex-wrap gap-x-2">
          {assistantPromptLinks.map(({ id: assistant, name, label, href }) => (
            <Button
              key={assistant}
              type="submit"
              variant="ghost"
              form={assistant === "gemini" ? geminiFormId : undefined}
              formAction={href.split("?")[0]}
              disabled={!hasPrompt}
              aria-label={`${assistant === "gemini" ? "Copy prompt and open Gemini" : label}, opens in a new tab`}
              className="min-h-11 rounded-md border-0 px-0 text-[var(--app-text-secondary)] hover:bg-transparent hover:text-[var(--app-text-primary)] dark:hover:bg-transparent motion-reduce:transform-none motion-reduce:transition-none"
            >
              <span className="inline-flex h-9 items-center gap-1.5 rounded-md border border-[var(--app-border)] bg-[var(--app-card)] px-2.5 group-hover/button:bg-[var(--app-muted-section)]">
                <AssistantLogo name={assistant} />
                <span>{name}</span>
                <ArrowUpRight aria-hidden="true" className="size-3" />
              </span>
            </Button>
          ))}
        </div>
        <noscript><p className="text-sm">To copy your prompt, select the text above. For Gemini, paste it into the new chat.</p></noscript>
      </form>
    </div>
  );
}
