"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { analyticsPageContext } from "@/lib/analyticsContext";
import { isPrivateAnalyticsPath } from "@/lib/analyticsScope";
import {
  captureLeadAttribution,
  getLeadAttributionAnalyticsParameters
} from "@/lib/leadAttribution";

type AnalyticsWindow = Window & {
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

const productionHosts = new Set(["velomacflowmeter.com", "www.velomacflowmeter.com"]);

export function GoogleAnalytics({ measurementId }: { measurementId: string }) {
  const pathname = usePathname();
  const initialized = useRef(false);
  const lastPagePath = useRef("");

  useEffect(() => {
    if (!pathname || isPrivateAnalyticsPath(pathname)) {
      lastPagePath.current = "";
      return;
    }
    captureLeadAttribution();
    if (!measurementId || !productionHosts.has(window.location.hostname)) return;

    const pageContext = analyticsPageContext(window.location.href, document.referrer);
    if (lastPagePath.current === pageContext.page_path) return;
    lastPagePath.current = pageContext.page_path;

    const analyticsWindow = window as AnalyticsWindow;
    analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
    analyticsWindow.gtag = analyticsWindow.gtag || function gtag() {
      // Google tag dispatches gtag commands from Arguments objects, not arrays.
      analyticsWindow.dataLayer?.push(arguments);
    };

    const shouldInitialize = !initialized.current;
    if (shouldInitialize) analyticsWindow.gtag("js", new Date());

    // Use the same filtered context for the tag's automatic and manual events.
    analyticsWindow.gtag("set", {
      page_location: pageContext.page_location,
      page_referrer: pageContext.page_referrer
    });

    if (shouldInitialize) {
      initialized.current = true;
      analyticsWindow.gtag("config", measurementId, { send_page_view: false });

      if (!document.getElementById("velomac-google-analytics")) {
        const script = document.createElement("script");
        script.id = "velomac-google-analytics";
        script.async = true;
        script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(measurementId)}`;
        document.head.appendChild(script);
      }
    }

    const attributionParameters = getLeadAttributionAnalyticsParameters();

    analyticsWindow.gtag("event", "page_view", {
      ...attributionParameters,
      page_title: document.title,
      ...pageContext,
      send_to: measurementId
    });
  }, [measurementId, pathname]);

  return null;
}
