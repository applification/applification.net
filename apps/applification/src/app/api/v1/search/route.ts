import { searchSiteInputSchema } from "@/lib/content-schema";
import { searchSite } from "@/lib/public-content.server";
import {
  publicRead,
  publicReadOnlyMethods,
  publicReadOptions,
} from "@/lib/public-content-http";
export function GET(request: Request) {
  return publicRead(request, searchSiteInputSchema, searchSite);
}
export const OPTIONS = publicReadOptions;
export const { POST, PUT, PATCH, DELETE } = publicReadOnlyMethods;
