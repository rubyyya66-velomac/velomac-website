type AnalyticsParameters = Record<string, unknown>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackAnalyticsEvent(event: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined") return;

  const analyticsWindow = window as AnalyticsWindow;
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...parameters });
  analyticsWindow.gtag?.("event", event, parameters);
}
