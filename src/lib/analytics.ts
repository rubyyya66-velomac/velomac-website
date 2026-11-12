import { getLeadAttributionAnalyticsParameters } from "@/lib/leadAttribution";
import { isPrivateAnalyticsPath } from "@/lib/analyticsScope";
import { analyticsPageContext, analyticsPathname } from "@/lib/analyticsContext";

type AnalyticsParameters = Record<string, unknown>;

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

export function trackAnalyticsEvent(event: string, parameters: AnalyticsParameters = {}) {
  if (typeof window === "undefined" || isPrivateAnalyticsPath(window.location.pathname)) return;

  const analyticsWindow = window as AnalyticsWindow;
  const attributionParameters = getLeadAttributionAnalyticsParameters();
  const pageContext = analyticsPageContext(window.location.href, document.referrer);
  const eventParameters = {
    ...attributionParameters,
    ...parameters,
    ...pageContext,
    page_path: analyticsPathname(
      typeof parameters.page_path === "string" ? parameters.page_path : window.location.pathname
    )
  };
  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.dataLayer.push({ event, ...eventParameters });
  analyticsWindow.gtag?.("event", event, eventParameters);
}
