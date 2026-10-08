import { headers } from "next/headers";
import { parseSiteIdentity, siteIdentityHeader } from "./site-identity";

export async function getSiteIdentity() {
  return (
    parseSiteIdentity((await headers()).get(siteIdentityHeader)) ?? "business"
  );
}
