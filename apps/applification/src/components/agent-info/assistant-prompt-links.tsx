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
          <div className="mb-2 flex flex-wrap items-center justify-between gap-x-4">
            <label htmlFor={`${id}-prompt`} className="text-base font-medium text-[var(--app-text-primary)]">Your prompt</label>
            <Button type="reset" variant="ghost" className="min-h-11 gap-2 px-2 text-[var(--app-text-secondary)] motion-reduce:transition-none">
              <RotateCcw aria-hidden="true" /> Reset prompt
            </Button>
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
        </div>
        <div role="group" aria-label="Open this prompt with an assistant" className="grid grid-cols-[repeat(auto-fit,minmax(min(100%,144px),1fr))] gap-3">
          {assistantPromptLinks.map(({ id: assistant, name, label, href }) => (
            <Button
              key={assistant}
              type="submit"
              form={assistant === "gemini" ? geminiFormId : undefined}
              formAction={href.split("?")[0]}
              disabled={!hasPrompt}
              aria-label={`${assistant === "gemini" ? "Copy prompt and open Gemini" : label}, opens in a new tab`}
              className="min-h-12 w-full justify-start gap-2 px-3 hover:bg-[var(--app-action-hover)] motion-reduce:transform-none motion-reduce:transition-none"
            >
              <AssistantLogo name={assistant} />
              <span>{name}</span>
              <ArrowUpRight aria-hidden="true" className="ml-auto size-3.5" />
            </Button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button type="button" variant="outline" disabled={!hasPrompt} onClick={() => { void copyPrompt("clipboard"); }} className="min-h-11 gap-2 px-4 motion-reduce:transform-none motion-reduce:transition-none">
            <Copy aria-hidden="true" /> Copy prompt
          </Button>
          <p role="status" className="text-sm text-[var(--app-text-secondary)] empty:hidden">{copyStatus}</p>
        </div>
        <noscript><p className="text-sm">To copy your prompt, select the text above. For Gemini, paste it into the new chat.</p></noscript>
      </form>
    </div>
  );
}
