import { getLeadAttributionAnalyticsParameters } from "@/lib/leadAttribution";
import { isPrivateAnalyticsPath } from "@/lib/analyticsScope";

type AnalyticsParameters = Record<string, unknown>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackAnalyticsEvent(event: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || isPrivateAnalyticsPath(window.location.pathname)) return;

  const analyticsWindow = window as AnalyticsWindow;
  const attributionParameters = getLeadAttributionAnalyticsParameters();
  const eventParameters = { ...attributionParameters, ...parameters };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...eventParameters });
  analyticsWindow.gtag?.("event", event, eventParameters);
}
