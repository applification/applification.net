export function humanPath(pathname: string) {
  if (pathname === "/agent") return "/";
  return pathname.startsWith("/agent/") ? pathname.slice(6) : pathname;
}

export function agentPath(pathname: string) {
  const path = humanPath(pathname);
  return path === "/" ? "/agent" : `/agent${path}`;
}

export function markdownPath(pathname: string) {
  const path = humanPath(pathname);
  return path === "/" ? "/markdown" : `/markdown${path}`;
}

// Only editorial pages have a second view. Never carry query strings, private
// review capabilities, form drafts or preview routes into the public reader.
export function hasAgentView(pathname: string) {
  const path = humanPath(pathname);
  return ["/", "/about", "/agents", "/client-work", "/products", "/writing", "/privacy"].includes(path)
    || /^\/client-work\/(logically|eruptiv|peppy-health)$/.test(path)
    || /^\/products\/(contexture|voiced|storyloops|plantry)$/.test(path)
    || /^\/writing\/[a-z0-9]+(?:-[a-z0-9]+)*$/.test(path);
}
