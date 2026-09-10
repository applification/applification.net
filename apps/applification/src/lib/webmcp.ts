import { z } from "zod";
import { catalogSections, getPublicCatalog } from "./public-catalog";
import {
  searchSiteInputSchema,
  readContentInputSchema,
} from "./content-schema";

export type WebMcpTool = {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
  annotations: { readOnlyHint: boolean; untrustedContentHint?: boolean };
  execute: (input: unknown) => Promise<unknown>;
};

export function toolInputSchema(schema: z.ZodType) {
  const json = z.toJSONSchema(schema, { target: "draft-2020-12", io: "input" });
  delete json.$schema;
  return json;
}

function contentTool(
  name: string,
  description: string,
  schema: z.ZodType,
  endpoint: string,
): WebMcpTool {
  return {
    name,
    description,
    inputSchema: toolInputSchema(schema),
    annotations: {
      readOnlyHint: true,
      untrustedContentHint: name === "read_content",
    },
    execute: async (input) => {
      const parsed = schema.safeParse(input);
      if (!parsed.success)
        return {
          error: {
            code: "INVALID_QUERY",
            message: parsed.error.issues
              .map((i) => `${i.path.join(".")}: ${i.message}`)
              .join("; "),
          },
        };
      const params = new URLSearchParams(
        Object.entries(parsed.data as Record<string, unknown>).map(([k, v]) => [
          k,
          String(v),
        ]),
      );
      try {
        const response = await fetch(`${endpoint}?${params}`, {
          credentials: "omit",
          signal: AbortSignal.timeout(10000),
        });
        const body = await response.json();
        if (!response.ok && !body.error)
          return {
            error: {
              code: "UNAVAILABLE",
              message:
                "Content is temporarily unavailable. Open the source page or retry later.",
            },
          };
        return body;
      } catch {
        return {
          error: {
            code: "UNAVAILABLE",
            message:
              "Content could not be loaded. Open the source page or retry later.",
          },
        };
      }
    },
  };
}

export const searchSiteTool = contentTool(
  "search_site",
  "Find published client work, writing and products. Omit query to list. Filter by type, writing topic/date or product status. Returns summaries and source URLs; use read_content for details. Follow nextOffset for more results.",
  searchSiteInputSchema,
  "/api/v1/search",
);
export const readContentTool = contentTool(
  "read_content",
  "Read published content selected by type and slug from search_site. Returns one Markdown section, a table of contents and source links. Starts at section 0; follow nextSection to read the rest. Product availability includes planned capabilities where stated.",
  readContentInputSchema,
  "/api/v1/content",
);

export const catalogTool = {
  name: "get_applification_info",
  description:
    "Read public information about Dave Hudson and Applification: engineering expertise, product availability, or published pricing terms. Select all, profile, products or pricing. Does not send enquiries or change data.",
  inputSchema: {
    type: "object",
    properties: {
      section: {
        type: "string",
        enum: catalogSections,
        description: "The public catalog section to read. Defaults to all.",
      },
    },
    additionalProperties: false,
  },
  annotations: { readOnlyHint: true },
  execute: async (input: unknown) => getPublicCatalog(input),
};

export type ModelContext = {
  registerTool: (
    tool: WebMcpTool,
    options?: { signal: AbortSignal },
  ) => void | Promise<void>;
  // Older navigator implementations used explicit unregistration.
  unregisterTool?: (name: string) => void;
};

export function registerWebMcpTool(
  tool: WebMcpTool,
  documentContext?: ModelContext,
  navigatorContext?: ModelContext,
) {
  const primary = typeof documentContext?.registerTool === "function";
  const context = primary ? documentContext : navigatorContext;
  if (typeof context?.registerTool !== "function") return () => {};

  const controller = new AbortController();
  let registered = false;
  const removeLegacyTool = () => {
    if (!primary && registered) {
      try {
        context.unregisterTool?.(tool.name);
      } catch {
        /* Preview APIs may already have removed it. */
      }
      registered = false;
    }
  };

  try {
    const registration = context.registerTool(tool, {
      signal: controller.signal,
    });
    if (registration) {
      registration
        .then(() => {
          registered = true;
          if (controller.signal.aborted) removeLegacyTool();
        })
        .catch(() => {
          /* A disabled or incompatible preview must not break the site. */
        });
    } else {
      // Legacy synchronous APIs must unregister before a Strict Mode remount,
      // rather than waiting for a promise microtask after the next registration.
      registered = true;
    }
  } catch {
    /* Some preview implementations throw synchronously. */
  }

  return () => {
    controller.abort();
    removeLegacyTool();
  };
}

export function registerCatalogTool(
  documentContext?: ModelContext,
  navigatorContext?: ModelContext,
) {
  return registerWebMcpTool(catalogTool, documentContext, navigatorContext);
}

export function registerPageTool(tool: WebMcpTool) {
  const documentContext = (
    document as Document & { modelContext?: ModelContext }
  ).modelContext;
  const navigatorContext = (
    navigator as Navigator & { modelContext?: ModelContext }
  ).modelContext;
  return registerWebMcpTool(tool, documentContext, navigatorContext);
}
