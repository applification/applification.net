"use client";

import { useEffect } from "react";
import {
  catalogTool,
  searchSiteTool,
  readContentTool,
  registerPageTool,
} from "@/lib/webmcp";

export function WebMcpTools() {
  useEffect(() => {
    const cleanup = [catalogTool, searchSiteTool, readContentTool].map(
      registerPageTool,
    );
    return () => cleanup.forEach((remove) => remove());
  }, []);
  return null;
}
