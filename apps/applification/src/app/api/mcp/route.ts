import { handleMcpRequest, mcpOptions } from "@/lib/mcp-server";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

export const GET = handleMcpRequest;
export const POST = handleMcpRequest;
export const DELETE = handleMcpRequest;
export const OPTIONS = mcpOptions;
