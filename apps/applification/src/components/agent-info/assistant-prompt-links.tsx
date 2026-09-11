"use client";

import { useState } from "react";
import { buttonVariants } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { agentsCopy, assistantPromptLinks } from "@/lib/content/site-pages";
import { cn } from "@/lib/utils";
import { AssistantLogo } from "./assistant-logos";

export function AssistantPromptLinks() {
  const [copyStatus, setCopyStatus] = useState("");

  async function copyForGemini() {
    try {
      await navigator.clipboard.writeText(agentsCopy.prompt);
      setCopyStatus("Prompt copied. Paste it into Gemini to start your conversation.");
    } catch {
      setCopyStatus("Copy the prompt above, then paste it into Gemini.");
    }
  }

  return (
    <div className="w-fit max-w-full">
      <TooltipProvider delayDuration={150}>
        <div role="group" aria-label="Open this prompt with an assistant" className="flex gap-3">
          {assistantPromptLinks.map(({ id, label, href }) => (
            <Tooltip key={id}>
              <TooltipTrigger asChild>
                <a
                  href={href}
                  aria-label={`${id === "gemini" ? "Copy prompt and open Gemini" : label}, opens in a new tab`}
                  title={id === "gemini" ? "Copy prompt and open Gemini" : label}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={id === "gemini" ? copyForGemini : undefined}
                  className={cn(buttonVariants({ variant: "outline", size: "icon", className: "size-11 motion-reduce:transform-none motion-reduce:transition-none" }))}
                >
                  <AssistantLogo name={id} />
                </a>
              </TooltipTrigger>
              <TooltipContent sideOffset={8} className="motion-reduce:animate-none">
                {id === "gemini" ? "Copy prompt and open Gemini" : label} (opens in a new tab)
              </TooltipContent>
            </Tooltip>
          ))}
        </div>
      </TooltipProvider>
      <p role="status" className="max-w-67 text-sm text-[var(--app-text-secondary)] empty:hidden not-empty:mt-2">{copyStatus}</p>
    </div>
  );
}
