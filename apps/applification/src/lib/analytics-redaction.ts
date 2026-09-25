// Owner review links carry a 14-day bearer capability in the path. Analytics
// only needs the page type, so the capability never leaves the browser.
const privatePathPatterns: [RegExp, string][] = [
  [/^\/contact\/review\/(?!complete(?:\/|$))[^/]+/, "/contact/review/[capability]"],
  [/^\/api\/contact\/attachment\/download(?:\/|$)/, "/api/contact/attachment/download"],
];

export function redactAnalyticsUrl(value: string) {
  let url: URL;
  try {
    url = new URL(value);
  } catch {
    return value;
  }
  for (const [pattern, replacement] of privatePathPatterns) {
    if (pattern.test(url.pathname)) {
      url.pathname = url.pathname.replace(pattern, replacement);
      url.search = "";
      url.hash = "";
      break;
    }
  }
  return url.toString();
}
