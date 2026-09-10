import { parseArgs } from "node:util";
import {
  Applification,
  ApplificationError,
  DOCS_URL,
  MCP_CLIENT_CONFIG,
  MCP_ENDPOINT,
  OPENAPI_URL,
  type ApplificationOptions,
  type CatalogSection,
  type ContentType,
  type ProductStatus,
  type SearchParams,
} from "@applification/sdk";

export const VERSION = "0.1.0";

export const HELP = `applification ${VERSION}
Read public information about Dave Hudson and Applification Ltd.
Free, read-only, no API key. Docs: ${DOCS_URL}

Usage
  applification catalog [--section all|profile|products|pricing]
  applification search [query] [--type client-work|writing|products]
                       [--topic t] [--status live|in-development|research]
                       [--after YYYY-MM-DD] [--before YYYY-MM-DD]
                       [--limit 1-10] [--offset n] [--all]
  applification read <type> <slug> [--section n | --all] [--json]
  applification mcp        Print the MCP client configuration (Streamable HTTP)
  applification openapi    Print the OpenAPI specification URL

Options
  --base-url <origin>  Use another origin, for example http://localhost:3333
  --json               Force JSON output (default for catalog and search)
  -h, --help           Show this help
  -v, --version        Show the version
`;

export interface Io {
  stdout: (text: string) => void;
  stderr: (text: string) => void;
}

const contentTypes = new Set<ContentType>(["client-work", "writing", "products"]);
const statuses = new Set<ProductStatus>(["live", "in-development", "research"]);
const sections = new Set<CatalogSection>(["all", "profile", "products", "pricing"]);

class UsageError extends Error {}

function json(value: unknown) {
  return `${JSON.stringify(value, null, 2)}\n`;
}

function integer(name: string, value: string | undefined) {
  if (value === undefined) return undefined;
  if (!/^\d+$/.test(value)) throw new UsageError(`--${name} must be a whole number.`);
  return Number(value);
}

function oneOf<T extends string>(name: string, value: string | undefined, allowed: Set<T>): T | undefined {
  if (value === undefined) return undefined;
  if (!allowed.has(value as T))
    throw new UsageError(`--${name} must be one of ${[...allowed].join(", ")}.`);
  return value as T;
}

export async function run(
  argv: string[],
  io: Io,
  clientOptions: ApplificationOptions = {},
): Promise<number> {
  const parse = () =>
    parseArgs({
      args: argv,
      allowPositionals: true,
      options: {
        help: { type: "boolean", short: "h" },
        version: { type: "boolean", short: "v" },
        json: { type: "boolean" },
        all: { type: "boolean" },
        "base-url": { type: "string" },
        section: { type: "string" },
        type: { type: "string" },
        topic: { type: "string" },
        status: { type: "string" },
        after: { type: "string" },
        before: { type: "string" },
        limit: { type: "string" },
        offset: { type: "string" },
      },
    });
  let parsed: ReturnType<typeof parse>;
  try {
    parsed = parse();
  } catch (error) {
    io.stderr(`${(error as Error).message}\n\n${HELP}`);
    return 2;
  }
  const { values, positionals } = parsed;
  const [command, ...rest] = positionals;

  if (values.version) {
    io.stdout(`${VERSION}\n`);
    return 0;
  }
  if (values.help || !command || command === "help") {
    io.stdout(HELP);
    return command || values.help ? 0 : 2;
  }

  const client = new Applification({
    ...clientOptions,
    ...(values["base-url"] ? { baseUrl: values["base-url"] } : {}),
    headers: { "User-Agent": `applification-cli/${VERSION}`, ...clientOptions.headers },
  });

  try {
    switch (command) {
      case "catalog": {
        const section = oneOf("section", values.section, sections) ?? "all";
        io.stdout(json(await client.catalog(section)));
        return 0;
      }
      case "search": {
        const params: SearchParams = {
          query: rest.join(" ") || undefined,
          type: oneOf("type", values.type, contentTypes),
          topic: values.topic,
          status: oneOf("status", values.status, statuses),
          after: values.after,
          before: values.before,
          limit: integer("limit", values.limit),
          offset: integer("offset", values.offset),
        };
        if (values.all) {
          const results = [];
          for await (const result of client.searchAll(params)) results.push(result);
          io.stdout(json({ results, total: results.length, nextOffset: null }));
        } else {
          io.stdout(json(await client.search(params)));
        }
        return 0;
      }
      case "read": {
        const [type, slug] = rest;
        if (!type || !slug) throw new UsageError("read needs <type> and <slug>.");
        const contentType = oneOf("type", type, contentTypes)!;
        if (values.all && values.section !== undefined)
          throw new UsageError("Use either --all or --section, not both.");
        if (values.all) {
          const markdown = await client.readAll({ type: contentType, slug });
          io.stdout(values.json ? json({ type: contentType, slug, content: markdown }) : `${markdown}\n`);
          return 0;
        }
        const page = await client.read({
          type: contentType,
          slug,
          section: integer("section", values.section),
        });
        if (values.json) io.stdout(json(page));
        else {
          io.stdout(`${page.content}\n`);
          if (page.nextSection !== null)
            io.stderr(
              `Section ${page.section} of ${page.sections.length}. Next: --section ${page.nextSection} (or --all).\n`,
            );
        }
        return 0;
      }
      case "mcp":
        io.stdout(json(MCP_CLIENT_CONFIG));
        io.stderr(`Streamable HTTP endpoint: ${MCP_ENDPOINT}\n`);
        return 0;
      case "openapi":
        io.stdout(`${OPENAPI_URL}\n`);
        return 0;
      default:
        throw new UsageError(`Unknown command "${command}".`);
    }
  } catch (error) {
    if (error instanceof UsageError) {
      io.stderr(`${error.message}\n\n${HELP}`);
      return 2;
    }
    if (error instanceof ApplificationError) {
      io.stderr(
        json({
          error: {
            code: error.code,
            status: error.status,
            message: error.message,
            url: error.url,
            ...(error.retryAfter !== undefined ? { retryAfter: error.retryAfter } : {}),
          },
        }),
      );
      return error.code === "INVALID_QUERY" ? 2 : error.code === "NOT_FOUND" ? 3 : 1;
    }
    throw error;
  }
}
