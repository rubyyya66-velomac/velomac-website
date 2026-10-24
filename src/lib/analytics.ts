import { getLeadAttributionAnalyticsParameters } from "@/lib/leadAttribution";

type AnalyticsParameters = Record<string, unknown>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackAnalyticsEvent(event: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as AnalyticsWindow;
  const attributionParameters = getLeadAttributionAnalyticsParameters();
  const eventParameters = { ...attributionParameters, ...parameters };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...eventParameters });
  analyticsWindow.gtag?.("event", event, eventParameters);
}
