"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement: when the URL fragment targets content inside a
 * collapsed <details>, open it so deep links such as /agents#versioning land
 * on visible text. Without JavaScript the link still scrolls to the block.
 */
export function RevealHashTarget() {
  useEffect(() => {
    function reveal() {
      const id = decodeURIComponent(window.location.hash.slice(1));
      if (!id) return;
      const target = document.getElementById(id);
      const details = target?.closest("details");
      if (!details || details.open) return;
      details.open = true;
      target?.scrollIntoView({ block: "start" });
    }
    reveal();
    window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return null;
}
