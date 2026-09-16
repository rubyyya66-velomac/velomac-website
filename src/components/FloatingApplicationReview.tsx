"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import { ClipboardCheck, X } from "lucide-react";

type ProductContext = {
  name: string;
  slug: string;
  category: "Flowmeters";
};

type ApplicationContext = {
  slug: string;
  mediumType: "liquid" | "gas" | "steam" | "not-sure";
};

const panelId = "floating-application-review-panel";
const sessionStateKey = "velomac-application-review-session-state";

const flowmeterProducts: Record<string, ProductContext> = {
  "/products/vortex-flowmeter": { name: "Vortex Flowmeter", slug: "vortex-flowmeter", category: "Flowmeters" },
  "/products/electromagnetic-flowmeter": { name: "Electromagnetic Flowmeter", slug: "electromagnetic-flowmeter", category: "Flowmeters" },
  "/products/liquid-turbine-flowmeter": { name: "Liquid Turbine Flowmeter", slug: "liquid-turbine-flowmeter", category: "Flowmeters" },
  "/products/gas-turbine-flowmeter": { name: "Gas Turbine Flowmeter", slug: "gas-turbine-flowmeter", category: "Flowmeters" },
  "/products/thermal-mass-flowmeter": { name: "Thermal Mass Flowmeter", slug: "thermal-mass-flowmeter", category: "Flowmeters" },
  "/products/v-cone-flowmeter": { name: "V-Cone Flowmeter", slug: "v-cone-flowmeter", category: "Flowmeters" },
  "/products/swirl-flowmeter": { name: "Swirl Flowmeter", slug: "swirl-flowmeter", category: "Flowmeters" },
  "/products/balanced-differential-pressure-flowmeter": { name: "Balanced Differential Pressure Flowmeter", slug: "balanced-differential-pressure-flowmeter", category: "Flowmeters" },
  "/products/ultrasonic-flowmeter": { name: "Ultrasonic Flowmeter", slug: "ultrasonic-flowmeter", category: "Flowmeters" },
  "/products/vortex-flowmeter/wide-turndown-anti-vibration": {
    name: "Wide-Turndown Anti-Vibration Vortex Flowmeter",
    slug: "wide-turndown-anti-vibration",
    category: "Flowmeters"
  }
};

const applicationContexts: Record<string, ApplicationContext> = {
  "/applications/steam-measurement": { slug: "steam-measurement", mediumType: "steam" },
  "/applications/gas-flow-measurement": { slug: "gas-flow-measurement", mediumType: "gas" },
  "/applications/conductive-liquid-measurement": { slug: "conductive-liquid-measurement", mediumType: "liquid" },
  "/applications/chemical-process-lines": { slug: "chemical-process-lines", mediumType: "liquid" },
  "/applications/high-vibration-pipelines": { slug: "high-vibration-pipelines", mediumType: "not-sure" },
  "/applications/energy-loss-visibility": { slug: "energy-loss-visibility", mediumType: "not-sure" }
};

export function FloatingApplicationReview() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [reviewVisible, setReviewVisible] = useState(false);
  const [inlineEntryVisible, setInlineEntryVisible] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const desktopTriggerRef = useRef<HTMLButtonElement>(null);
  const mobileTriggerRef = useRef<HTMLButtonElement>(null);
  const desktopCloseRef = useRef<HTMLButtonElement>(null);
  const mobileCloseRef = useRef<HTMLButtonElement>(null);
  const lastImpressionPath = useRef("");
  const productContext = flowmeterProducts[pathname] || null;
  const applicationContext = applicationContexts[pathname] || null;
  const pageType = getPageType(pathname);
  const hiddenRoute = !isPublicRoute(pathname) || pathname === "/application-review";
  const centralReviewHref = useMemo(
    () => buildCentralReviewHref(pathname, pageType, applicationContext),
    [applicationContext, pageType, pathname]
  );

  useEffect(() => {
    setOpen(false);
    setReviewVisible(false);
    setInlineEntryVisible(false);

    try {
      setSubmitted(sessionStorage.getItem(sessionStateKey) === "submitted");
    } catch {
      setSubmitted(false);
    }
  }, [pathname]);

  useEffect(() => {
    if (hiddenRoute || lastImpressionPath.current === pathname) return;
    lastImpressionPath.current = pathname;
    trackFloatingReview("floating_application_review_impression", {
      pathname,
      pageType,
      productContext,
      applicationContext
    });
  }, [applicationContext, hiddenRoute, pageType, pathname, productContext]);

  useEffect(() => {
    const reviewSection = document.getElementById("application-review");
    const inlineEntries = Array.from(
      document.querySelectorAll<HTMLElement>(
        "main [data-application-review-entry], main a[href='/contact']"
      )
    );
    const visibleEntries = new Set<Element>();

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === reviewSection) {
            setReviewVisible(entry.isIntersecting);
          } else if (entry.isIntersecting) {
            visibleEntries.add(entry.target);
          } else {
            visibleEntries.delete(entry.target);
          }
        });
        const hasVisibleEntry = visibleEntries.size > 0;
        setInlineEntryVisible(hasVisibleEntry);
        if (entries.some((entry) => entry.isIntersecting)) setOpen(false);
      },
      { threshold: 0.18, rootMargin: "-64px 0px 0px" }
    );

    if (reviewSection) observer.observe(reviewSection);
    inlineEntries.forEach((entry) => observer.observe(entry));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && open) closePanel();
    }

    function handleSubmitted() {
      setSubmitted(true);
      setOpen(false);
    }

    document.addEventListener("keydown", handleKeyDown);
    window.addEventListener("velomac:application-review-submitted", handleSubmitted);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("velomac:application-review-submitted", handleSubmitted);
    };
  });

  useEffect(() => {
    if (!open) return;
    const desktop = window.matchMedia("(min-width: 1024px)").matches;
    (desktop ? desktopCloseRef : mobileCloseRef).current?.focus();
  }, [open]);

  if (hiddenRoute || reviewVisible || inlineEntryVisible) return null;

  const tabLabel = submitted ? "Application Submitted" : "Application Review →";

  function openPanel() {
    setOpen(true);
    trackFloatingReview("floating_application_review_open", {
      pathname,
      pageType,
      productContext,
      applicationContext
    });
  }

  function closePanel({ returnFocus = true } = {}) {
    setOpen(false);
    trackFloatingReview("floating_application_review_close", {
      pathname,
      pageType,
      productContext,
      applicationContext
    });
    if (returnFocus) {
      window.requestAnimationFrame(() => {
        const desktop = window.matchMedia("(min-width: 1024px)").matches;
        (desktop ? desktopTriggerRef : mobileTriggerRef).current?.focus();
      });
    }
  }

  function startReview() {
    trackFloatingReview("floating_application_review_start", {
      pathname,
      pageType,
      productContext,
      applicationContext
    });
    if (submitted) {
      setSubmitted(false);
      try {
        sessionStorage.removeItem(sessionStateKey);
      } catch {
        // Session storage is optional; starting another review still works.
      }
      window.dispatchEvent(new Event("velomac:application-review-reset"));
    }

    if (productContext) {
      setOpen(false);
      const reviewSection = document.getElementById("application-review");
      window.history.pushState(null, "", "#application-review");
      reviewSection?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
        block: "start"
      });
    }
  }

  return (
    <>
      <button
        ref={desktopTriggerRef}
        type="button"
        aria-label="Open Application Review information"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={openPanel}
        className={`focus-ring fixed right-0 top-[58%] z-30 hidden min-h-12 -translate-y-1/2 items-center border border-r-0 border-industrial-700 bg-white px-4 py-3 text-sm font-semibold text-navy-950 shadow-[0_8px_22px_rgba(7,26,45,0.12)] transition hover:bg-blue-50 hover:text-industrial-700 lg:inline-flex ${open ? "pointer-events-none translate-x-full opacity-0" : "translate-x-0 opacity-100"}`}
      >
        {tabLabel}
      </button>

      <button
        ref={mobileTriggerRef}
        type="button"
        aria-label="Open Application Review information"
        aria-expanded={open}
        aria-controls={`${panelId}-mobile`}
        onClick={openPanel}
        className={`focus-ring fixed bottom-[calc(0.75rem+env(safe-area-inset-bottom))] right-3 z-30 inline-flex h-11 w-11 items-center justify-center rounded-full border border-industrial-700 bg-white text-navy-950 shadow-[0_8px_22px_rgba(7,26,45,0.14)] transition hover:bg-blue-50 hover:text-industrial-700 lg:hidden ${open ? "pointer-events-none translate-y-3 opacity-0" : "translate-y-0 opacity-100"}`}
      >
        <ClipboardCheck size={18} strokeWidth={1.9} aria-hidden="true" />
        <span className="sr-only">{submitted ? "Application submitted" : "Application review"}</span>
      </button>

      <button
        type="button"
        aria-label="Close Application Review panel"
        tabIndex={open ? 0 : -1}
        onClick={() => closePanel()}
        className={`fixed inset-0 z-20 bg-navy-950/10 transition-opacity motion-reduce:transition-none ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
      />

      <aside
        id={panelId}
        role="dialog"
        aria-modal="false"
        aria-labelledby={`${panelId}-title`}
        aria-hidden={!open}
        inert={!open}
        className={`fixed right-0 top-[58%] z-30 hidden w-[360px] max-w-[calc(100vw-2rem)] -translate-y-1/2 border border-r-0 border-metal-300 bg-white shadow-[0_20px_50px_rgba(7,26,45,0.18)] transition-transform duration-200 motion-reduce:transition-none lg:block ${open ? "translate-x-0" : "pointer-events-none translate-x-full"}`}
      >
        <PanelContent
          closeRef={desktopCloseRef}
          submitted={submitted}
          productContext={productContext}
          destination={centralReviewHref}
          onClose={() => closePanel()}
          onStart={startReview}
        />
      </aside>

      <aside
        id={`${panelId}-mobile`}
        role="dialog"
        aria-modal="false"
        aria-labelledby={`${panelId}-mobile-title`}
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-x-0 bottom-0 z-30 border-t border-metal-300 bg-white pb-[env(safe-area-inset-bottom)] shadow-[0_-18px_45px_rgba(7,26,45,0.16)] transition-transform duration-200 motion-reduce:transition-none lg:hidden ${open ? "translate-y-0" : "pointer-events-none translate-y-full"}`}
      >
        <PanelContent
          closeRef={mobileCloseRef}
          compact
          submitted={submitted}
          productContext={productContext}
          destination={centralReviewHref}
          onClose={() => closePanel()}
          onStart={startReview}
        />
      </aside>
    </>
  );
}

function PanelContent({
  closeRef,
  compact = false,
  submitted,
  productContext,
  destination,
  onClose,
  onStart
}: {
  closeRef: React.RefObject<HTMLButtonElement>;
  compact?: boolean;
  submitted: boolean;
  productContext: ProductContext | null;
  destination: string;
  onClose: () => void;
  onStart: () => void;
}) {
  const titleId = compact ? `${panelId}-mobile-title` : `${panelId}-title`;
  const ctaLabel = submitted ? "Start Another Review" : compact ? "Start Review" : "Start Application Review";
  const ctaClass = "focus-ring mt-6 inline-flex min-h-11 w-full items-center justify-center bg-navy-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-industrial-700";

  return (
    <div className={compact ? "px-5 py-5" : "p-7"}>
      <div className="flex items-start justify-between gap-5">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-industrial-700">Application Review</p>
          <h2 id={titleId} className={`${compact ? "mt-2 text-xl" : "mt-3 text-2xl"} font-semibold leading-tight text-navy-950`}>
            {submitted ? "Application submitted" : compact ? "Start with the operating conditions." : "Start with what you know"}
          </h2>
        </div>
        <button
          ref={closeRef}
          type="button"
          aria-label="Close Application Review panel"
          onClick={onClose}
          className="focus-ring -mr-1 inline-flex h-10 w-10 shrink-0 items-center justify-center text-slate-500 transition hover:text-industrial-700"
        >
          <X aria-hidden="true" className="h-5 w-5" strokeWidth={1.8} />
        </button>
      </div>

      {submitted ? (
        <p className="mt-4 text-sm leading-6 text-slate-600">Your review was received in this session. You can start another review when needed.</p>
      ) : compact ? (
        <ol className="mt-5 grid gap-3 text-sm font-semibold text-navy-950">
          <li><span className="mr-3 text-industrial-700">01</span>Share the basics</li>
          <li><span className="mr-3 text-industrial-700">02</span>Add details if available</li>
          <li><span className="mr-3 text-industrial-700">03</span>Application review</li>
        </ol>
      ) : (
        <>
          <p className="mt-4 text-sm leading-6 text-slate-600">A few operating details are enough to begin.</p>
          <ol className="mt-6 divide-y divide-metal-200 border-y border-metal-200">
            <Step number="01" title="Share the basics" text="Medium, flow range, pressure / temperature and pipe size" />
            <Step number="02" title="Add details if available" text="Installation and application details are optional" />
            <Step number="03" title="Application review" text="We identify what still needs to be confirmed" />
          </ol>
        </>
      )}

      {productContext ? (
        <button type="button" className={ctaClass} onClick={onStart}>{ctaLabel}</button>
      ) : (
        <Link href={destination} className={ctaClass} onClick={onStart}>{ctaLabel}</Link>
      )}
    </div>
  );
}

function Step({ number, title, text }: { number: string; title: string; text: string }) {
  return (
    <li className="grid grid-cols-[2rem_1fr] gap-3 py-4">
      <span className="pt-0.5 text-xs font-semibold tracking-[0.12em] text-industrial-700">{number}</span>
      <div>
        <p className="text-sm font-semibold text-navy-950">{title}</p>
        <p className="mt-1 text-sm leading-6 text-slate-600">{text}</p>
      </div>
    </li>
  );
}

function buildCentralReviewHref(pathname: string, pageType: string, applicationContext: ApplicationContext | null) {
  const params = new URLSearchParams({
    source_type: getSourceType(pageType),
    source_section: "floating_application_review",
    source_path: pathname
  });
  if (applicationContext) {
    params.set("application_type", applicationContext.slug);
    params.set("mediumType", applicationContext.mediumType);
  }
  return `/application-review?${params.toString()}`;
}

function isPublicRoute(pathname: string) {
  return pathname === "/" || ["/products", "/applications", "/technology", "/resources", "/about", "/quality-innovation", "/contact"].some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );
}

function getPageType(pathname: string) {
  if (pathname === "/") return "homepage";
  if (pathname === "/products") return "products_overview";
  if (pathname.startsWith("/products/")) return "product";
  if (pathname.startsWith("/applications/")) return "application_page";
  if (pathname === "/applications") return "applications_overview";
  if (pathname.startsWith("/resources/")) return "resource";
  if (pathname === "/resources") return "resources_overview";
  if (pathname.startsWith("/technology")) return "technology";
  if (pathname === "/contact") return "contact";
  if (pathname === "/about" || pathname === "/quality-innovation") return "company";
  return "public_page";
}

function getSourceType(pageType: string) {
  if (["homepage", "product", "products_overview", "application_page", "resource"].includes(pageType)) return pageType;
  return "navigation";
}

function trackFloatingReview(
  event: string,
  context: {
    pathname: string;
    pageType: string;
    productContext: ProductContext | null;
    applicationContext: ApplicationContext | null;
  }
) {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event,
    page_path: context.pathname,
    page_type: context.pageType,
    source_section: "floating_application_review",
    ...(context.productContext ? { product_slug: context.productContext.slug } : {}),
    ...(context.applicationContext ? { application_type: context.applicationContext.slug } : {})
  });
}
