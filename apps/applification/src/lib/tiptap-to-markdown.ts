export type TipTapMark = {
  type: string;
  attrs?: Record<string, unknown>;
};

export type TipTapNode = {
  type: string;
  text?: string;
  attrs?: Record<string, unknown>;
  marks?: TipTapMark[];
  content?: TipTapNode[];
};

export type TipTapConversion = {
  markdown: string;
  warnings: string[];
};

function escapeText(value: string) {
  return value.replace(/([\\`*_[\]<>])/g, "\\$1");
}

function plainText(node: TipTapNode): string {
  if (node.type === "text") {
    return node.text ?? "";
  }

  return (node.content ?? []).map(plainText).join("");
}

function renderMarkedText(node: TipTapNode) {
  const marks = node.marks ?? [];
  const code = marks.some((mark) => mark.type === "code");
  let value = code
    ? `\`${(node.text ?? "").replace(/`/g, "\\`")}\``
    : escapeText(node.text ?? "");

  for (const mark of marks) {
    if (mark.type === "bold") {
      value = `**${value}**`;
    }

    if (mark.type === "italic") {
      value = `*${value}*`;
    }

    if (mark.type === "link") {
      const href = typeof mark.attrs?.href === "string" ? mark.attrs.href : "";
      if (href) {
        value = `[${value}](${href})`;
      }
    }
  }

  return value;
}

function renderImage(node: TipTapNode) {
  const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
  const alt = typeof node.attrs?.alt === "string" ? node.attrs.alt : "";
  const title = typeof node.attrs?.title === "string" ? node.attrs.title : "";
  const titleSuffix = title ? ` \"${title.replace(/\"/g, "\\\"")}\"` : "";

  return src ? `![${alt.replace(/]/g, "\\]")}](${src}${titleSuffix})` : "";
}

function renderInline(node: TipTapNode, warnings: string[]): string {
  if (node.type === "text") {
    return renderMarkedText(node);
  }

  if (node.type === "hardBreak") {
    return "  \n";
  }

  if (node.type === "image") {
    return renderImage(node);
  }

  if (node.content) {
    return node.content.map((child) => renderInline(child, warnings)).join("");
  }

  warnings.push(`Unsupported inline TipTap node: ${node.type}`);
  return "";
}

function indent(value: string, spaces = 2) {
  const prefix = " ".repeat(spaces);
  return value
    .split("\n")
    .map((line) => `${prefix}${line}`)
    .join("\n");
}

function renderList(node: TipTapNode, ordered: boolean, warnings: string[]) {
  const start = ordered && typeof node.attrs?.start === "number" ? node.attrs.start : 1;

  return (node.content ?? [])
    .map((item, index) => {
      const blocks = (item.content ?? [])
        .map((child) => renderBlock(child, warnings))
        .filter(Boolean);
      const marker = ordered ? `${start + index}. ` : "- ";
      const [first = "", ...rest] = blocks;
      const firstLines = first.split("\n");
      const renderedFirst = [
        `${marker}${firstLines[0] ?? ""}`,
        ...firstLines.slice(1).map((line) => `  ${line}`),
      ].join("\n");

      return [renderedFirst, ...rest.map((block) => indent(block))].join("\n");
    })
    .join("\n");
}

function renderYoutube(node: TipTapNode) {
  const src = typeof node.attrs?.src === "string" ? node.attrs.src : "";
  const match = src.match(/\/embed\/([^?]+)/);
  const url = match ? `https://www.youtube.com/watch?v=${match[1]}` : src;
  return url ? `[Watch on YouTube](${url})` : "";
}

function renderSocialPost(node: TipTapNode) {
  const source = node.attrs?.src;
  const id = typeof source === "string" || typeof source === "number" ? String(source) : "";
  return id ? `[View the embedded post](https://x.com/i/web/status/${id})` : "";
}

function renderBlock(node: TipTapNode, warnings: string[]): string {
  switch (node.type) {
    case "doc":
      return (node.content ?? [])
        .map((child) => renderBlock(child, warnings))
        .filter(Boolean)
        .join("\n\n");
    case "paragraph":
      return (node.content ?? [])
        .map((child) => renderInline(child, warnings))
        .join("")
        .trimEnd();
    case "heading": {
      const level = typeof node.attrs?.level === "number" ? node.attrs.level : 2;
      return `${"#".repeat(Math.min(6, Math.max(1, level)))} ${(node.content ?? [])
        .map((child) => renderInline(child, warnings))
        .join("")}`;
    }
    case "horizontalRule":
      return "---";
    case "codeBlock": {
      const language =
        typeof node.attrs?.language === "string" ? node.attrs.language : "";
      const code = plainText(node).replace(/\n$/, "");
      const longestFence = Math.max(3, ...(code.match(/`+/g) ?? []).map((run) => run.length + 1));
      const fence = "`".repeat(longestFence);
      return `${fence}${language}\n${code}\n${fence}`;
    }
    case "blockquote":
      return (node.content ?? [])
        .map((child) => renderBlock(child, warnings))
        .join("\n\n")
        .split("\n")
        .map((line) => `> ${line}`)
        .join("\n");
    case "bulletList":
      return renderList(node, false, warnings);
    case "orderedList":
      return renderList(node, true, warnings);
    case "listItem":
      return (node.content ?? [])
        .map((child) => renderBlock(child, warnings))
        .filter(Boolean)
        .join("\n");
    case "image":
      return renderImage(node);
    case "youtube":
      return renderYoutube(node);
    case "reactComponent":
      return renderSocialPost(node);
    default:
      if (node.content) {
        warnings.push(`Used child content for unsupported TipTap node: ${node.type}`);
        return node.content
          .map((child) => renderBlock(child, warnings))
          .filter(Boolean)
          .join("\n\n");
      }

      warnings.push(`Unsupported TipTap node: ${node.type}`);
      return "";
  }
}

export function convertTipTapToMarkdown(document: TipTapNode): TipTapConversion {
  const warnings: string[] = [];
  const markdown = renderBlock(document, warnings)
    .replace(/\n{3,}/g, "\n\n")
    .trim();

  return { markdown, warnings: [...new Set(warnings)] };
}

export function getTipTapPlainText(document: TipTapNode) {
  return plainText(document).replace(/\s+/g, " ").trim();
}
