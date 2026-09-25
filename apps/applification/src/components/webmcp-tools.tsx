"use client";

import { useEffect } from "react";

type RemoveTool = () => void;

// Only browsers with the WebMCP preview load the tool definitions, so zod and
// the catalogue stay out of every other visitor's bundle.
function hasModelContext() {
  return "modelContext" in document || "modelContext" in navigator;
}

export function WebMcpTools() {
  useEffect(() => {
    if (!hasModelContext()) return;
    let cancelled = false;
    let cleanup: RemoveTool[] = [];
    void import("@/lib/webmcp").then(
      ({ catalogTool, searchSiteTool, readContentTool, registerPageTool }) => {
        if (cancelled) return;
        cleanup = [catalogTool, searchSiteTool, readContentTool].map(registerPageTool);
      },
    );
    return () => {
      cancelled = true;
      cleanup.forEach((remove) => remove());
    };
  }, []);
  return null;
}
