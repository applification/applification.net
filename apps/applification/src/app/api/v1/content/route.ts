import { readContentInputSchema } from "@/lib/content-schema";
import { readContent } from "@/lib/public-content.server";
import {
  publicRead,
  publicReadOnlyMethods,
  publicReadOptions,
} from "@/lib/public-content-http";
export function GET(request: Request) {
  return publicRead(request, readContentInputSchema, readContent);
}
export const OPTIONS = publicReadOptions;
export const { POST, PUT, PATCH, DELETE } = publicReadOnlyMethods;
