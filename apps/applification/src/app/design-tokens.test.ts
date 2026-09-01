import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

type ThemePair = {
  dark: string;
  light: string;
};

type PenVariable = {
  type: "color" | "string";
  value:
    | string
    | Array<{
        theme: { mode: "dark" | "light" };
        value: string;
      }>;
};

const sharedColourTokens = [
  "app-bg",
  "app-bg-end",
  "app-section",
  "app-muted-section",
  "app-card",
  "app-selected",
  "app-control",
  "app-label",
  "app-text-primary",
  "app-text-secondary",
  "app-text-muted",
  "app-border",
  "app-accent",
  "app-sky-text",
  "app-label-text",
  "app-action",
  "app-text-on-action",
] as const;

function normaliseColour(value: string) {
  return value.trim().toLowerCase();
}

function readRootDeclarations(css: string) {
  const root = css.match(/:root\s*\{([\s\S]*?)\n\}/)?.[1];

  if (!root) {
    throw new Error("Could not find the root design tokens in globals.css");
  }

  return new Map(
    [...root.matchAll(/^\s*--([\w-]+):\s*([^;]+);/gm)].map((match) => [
      match[1],
      match[2].trim(),
    ]),
  );
}

function resolveCssToken(
  name: string,
  declarations: Map<string, string>,
  seen = new Set<string>(),
): ThemePair {
  if (seen.has(name)) {
    throw new Error(`Circular CSS variable reference at --${name}`);
  }

  const raw = declarations.get(name);

  if (!raw) {
    throw new Error(`Missing --${name} in globals.css`);
  }

  const variable = raw.match(/^var\(--([\w-]+)\)$/)?.[1];

  if (variable) {
    return resolveCssToken(variable, declarations, new Set([...seen, name]));
  }

  const themed = raw.match(/^light-dark\(([^,]+),\s*([^\)]+)\)$/);

  if (themed) {
    return {
      light: normaliseColour(themed[1]),
      dark: normaliseColour(themed[2]),
    };
  }

  const fixed = normaliseColour(raw);
  return { light: fixed, dark: fixed };
}

function resolvePenToken(variable: PenVariable): ThemePair {
  if (typeof variable.value === "string") {
    const fixed = normaliseColour(variable.value);
    return { light: fixed, dark: fixed };
  }

  const values = Object.fromEntries(
    variable.value.map(({ theme, value }) => [theme.mode, normaliseColour(value)]),
  ) as ThemePair;

  return values;
}

describe("shared design tokens", () => {
  const css = readFileSync(new URL("./globals.css", import.meta.url), "utf8");
  const pen = JSON.parse(
    readFileSync(new URL("../../../../applification.pen", import.meta.url), "utf8"),
  ) as { variables: Record<string, PenVariable> };
  const declarations = readRootDeclarations(css);

  it.each(sharedColourTokens)("keeps %s aligned with the pen reference", (name) => {
    expect(resolvePenToken(pen.variables[name])).toEqual(
      resolveCssToken(name, declarations),
    );
  });

  it("does not retain the unused pre-theme palette", () => {
    const legacyTokens = [
      "surface-primary",
      "surface-inverse",
      "text-primary",
      "text-secondary",
      "text-muted",
      "text-inverse",
      "border-subtle",
      "accent",
    ];

    expect(legacyTokens.filter((name) => name in pen.variables)).toEqual([]);
  });
});
