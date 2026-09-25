"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";
import { redactAnalyticsUrl } from "@/lib/analytics-redaction";

function beforeSend(event: BeforeSendEvent) {
  return { ...event, url: redactAnalyticsUrl(event.url) };
}

export function SiteAnalytics() {
  return <Analytics beforeSend={beforeSend} />;
}
