export type WritingOutlineItem = {
  id: string;
  label: string;
};

function plainText(value: string) {
  return value
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/<[^>]+>/g, "")
    .replace(/[`*_~]/g, "")
    .replace(/\\([\\`*{}\[\]()#+.!_>-])/g, "$1")
    .trim();
}

function baseHeadingId(label: string) {
  return label
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "section";
}

function markdownLines(markdown: string) {
  const lines: string[] = [];
  let fence: string | undefined;

  markdown.split("\n").forEach((line) => {
    const marker = line.match(/^\s*(```+|~~~+)/)?.[1];

    if (marker) {
      if (!fence) {
        fence = marker[0];
      } else if (marker[0] === fence) {
        fence = undefined;
      }
      return;
    }

    if (!fence) {
      lines.push(line);
    }
  });

  return lines;
}

export function extractWritingOutline(markdown: string) {
  const occurrences = new Map<string, number>();

  return markdownLines(markdown).flatMap<WritingOutlineItem>((line) => {
    const match = line.match(/^#{1,2}\s+(.+?)\s*#*\s*$/);

    if (!match) {
      return [];
    }

    const label = plainText(match[1]);
    const baseId = baseHeadingId(label);
    const occurrence = (occurrences.get(baseId) ?? 0) + 1;
    occurrences.set(baseId, occurrence);

    return [{
      id: occurrence === 1 ? baseId : `${baseId}-${occurrence}`,
      label,
    }];
  });
}
