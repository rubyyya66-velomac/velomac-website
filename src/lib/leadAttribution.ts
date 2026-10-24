export type AttributionTouch = {
  landingPage: string;
  referrer: string;
  capturedAt: string;
  utmSource: string;
  utmMedium: string;
  utmCampaign: string;
  utmId: string;
  utmTerm: string;
  utmContent: string;
  utmSourcePlatform: string;
  utmCreativeFormat: string;
  utmMarketingTactic: string;
  gclid: string;
  gbraid: string;
  wbraid: string;
  msclkid: string;
  fbclid: string;
  ttclid: string;
  linkedInClickId: string;
};

export type LeadAttribution = {
  firstTouch: AttributionTouch;
  sessionTouch: AttributionTouch;
  submissionPage: string;
};

const firstTouchStorageKey = "velomac-lead-attribution-first-touch-v1";
const sessionTouchStorageKey = "velomac-lead-attribution-session-touch-v1";
const maximumStoredValueLength = 500;

const campaignParameters = {
  utmSource: "utm_source",
  utmMedium: "utm_medium",
  utmCampaign: "utm_campaign",
  utmId: "utm_id",
  utmTerm: "utm_term",
  utmContent: "utm_content",
  utmSourcePlatform: "utm_source_platform",
  utmCreativeFormat: "utm_creative_format",
  utmMarketingTactic: "utm_marketing_tactic",
  gclid: "gclid",
  gbraid: "gbraid",
  wbraid: "wbraid",
  msclkid: "msclkid",
  fbclid: "fbclid",
  ttclid: "ttclid",
  linkedInClickId: "li_fat_id"
} as const;

const emptyTouch: AttributionTouch = {
  landingPage: "",
  referrer: "",
  capturedAt: "",
  utmSource: "",
  utmMedium: "",
  utmCampaign: "",
  utmId: "",
  utmTerm: "",
  utmContent: "",
  utmSourcePlatform: "",
  utmCreativeFormat: "",
  utmMarketingTactic: "",
  gclid: "",
  gbraid: "",
  wbraid: "",
  msclkid: "",
  fbclid: "",
  ttclid: "",
  linkedInClickId: ""
};

export function captureLeadAttribution(): LeadAttribution | null {
  if (typeof window === "undefined") return null;

  const currentTouch = buildCurrentTouch();
  const localStorage = safeStorage("localStorage");
  const sessionStorage = safeStorage("sessionStorage");
  const firstTouch = readStoredTouch(localStorage, firstTouchStorageKey) || currentTouch;
  let sessionTouch = readStoredTouch(sessionStorage, sessionTouchStorageKey) || currentTouch;

  if (hasCampaignData(currentTouch) && !hasCampaignData(sessionTouch)) {
    sessionTouch = mergeCampaignData(sessionTouch, currentTouch);
  }

  writeStoredTouch(localStorage, firstTouchStorageKey, firstTouch);
  writeStoredTouch(sessionStorage, sessionTouchStorageKey, sessionTouch);

  return {
    firstTouch,
    sessionTouch,
    submissionPage: window.location.pathname
  };
}

export function appendLeadAttribution(formData: FormData) {
  const payload = getLeadAttributionPayload();
  Object.entries(payload).forEach(([key, value]) => formData.set(key, value));
}

export function getLeadAttributionPayload(): Record<string, string> {
  const attribution = captureLeadAttribution();
  if (!attribution) return {};

  return {
    ...touchPayload("first-touch", attribution.firstTouch),
    ...touchPayload("session-touch", attribution.sessionTouch),
    "submission-page": attribution.submissionPage
  };
}

export function getLeadAttributionAnalyticsParameters(): Record<string, string> {
  const attribution = captureLeadAttribution();
  if (!attribution) return {};

  const effectiveTouch = attribution.sessionTouch;
  const inferredSource = effectiveTouch.utmSource || referrerHostname(effectiveTouch.referrer) || "direct";
  const inferredMedium = effectiveTouch.utmMedium || (effectiveTouch.referrer ? "referral" : "none");

  return compactRecord({
    campaign_source: inferredSource,
    campaign_medium: inferredMedium,
    campaign_name: effectiveTouch.utmCampaign,
    campaign_id: effectiveTouch.utmId,
    campaign_term: effectiveTouch.utmTerm,
    campaign_content: effectiveTouch.utmContent,
    source_platform: effectiveTouch.utmSourcePlatform,
    creative_format: effectiveTouch.utmCreativeFormat,
    marketing_tactic: effectiveTouch.utmMarketingTactic,
    landing_page: effectiveTouch.landingPage,
    lead_referrer: effectiveTouch.referrer || "direct",
    attribution_scope: "session"
  });
}

function buildCurrentTouch(): AttributionTouch {
  const search = new URLSearchParams(window.location.search);
  const touch = { ...emptyTouch };

  touch.landingPage = trackingLandingPage(search);
  touch.referrer = sanitizeReferrer(document.referrer);
  touch.capturedAt = new Date().toISOString();

  for (const [property, queryParameter] of Object.entries(campaignParameters) as Array<
    [keyof typeof campaignParameters, (typeof campaignParameters)[keyof typeof campaignParameters]]
  >) {
    touch[property] = cleanValue(search.get(queryParameter));
  }

  return touch;
}

function trackingLandingPage(search: URLSearchParams) {
  const trackingSearch = new URLSearchParams();
  Object.values(campaignParameters).forEach((parameter) => {
    const value = cleanValue(search.get(parameter));
    if (value) trackingSearch.set(parameter, value);
  });
  const query = trackingSearch.toString();
  return cleanValue(`${window.location.pathname}${query ? `?${query}` : ""}`);
}

function sanitizeReferrer(value: string) {
  if (!value) return "";
  try {
    const url = new URL(value);
    return cleanValue(`${url.origin}${url.pathname}`);
  } catch {
    return cleanValue(value.split(/[?#]/, 1)[0]);
  }
}

function mergeCampaignData(base: AttributionTouch, incoming: AttributionTouch): AttributionTouch {
  const merged = { ...base };
  for (const property of Object.keys(campaignParameters) as Array<keyof typeof campaignParameters>) {
    if (incoming[property]) merged[property] = incoming[property];
  }
  return merged;
}

function hasCampaignData(touch: AttributionTouch) {
  return (Object.keys(campaignParameters) as Array<keyof typeof campaignParameters>).some(
    (property) => Boolean(touch[property])
  );
}

function safeStorage(type: "localStorage" | "sessionStorage") {
  try {
    return window[type];
  } catch {
    return null;
  }
}

function readStoredTouch(storage: Storage | null, key: string): AttributionTouch | null {
  if (!storage) return null;
  try {
    const stored = storage.getItem(key);
    if (!stored) return null;
    const parsed = JSON.parse(stored) as Partial<AttributionTouch>;
    return normalizeTouch(parsed);
  } catch {
    return null;
  }
}

function writeStoredTouch(storage: Storage | null, key: string, touch: AttributionTouch) {
  if (!storage) return;
  try {
    storage.setItem(key, JSON.stringify(touch));
  } catch {
    // Attribution must never block navigation or form submission.
  }
}

function normalizeTouch(value: Partial<AttributionTouch>): AttributionTouch {
  const normalized = { ...emptyTouch };
  for (const property of Object.keys(normalized) as Array<keyof AttributionTouch>) {
    normalized[property] = cleanValue(value[property]);
  }
  return normalized;
}

function touchPayload(prefix: string, touch: AttributionTouch) {
  return compactRecord({
    [`${prefix}-landing-page`]: touch.landingPage,
    [`${prefix}-referrer`]: touch.referrer || "direct",
    [`${prefix}-captured-at`]: touch.capturedAt,
    [`${prefix}-utm-source`]: touch.utmSource,
    [`${prefix}-utm-medium`]: touch.utmMedium,
    [`${prefix}-utm-campaign`]: touch.utmCampaign,
    [`${prefix}-utm-id`]: touch.utmId,
    [`${prefix}-utm-term`]: touch.utmTerm,
    [`${prefix}-utm-content`]: touch.utmContent,
    [`${prefix}-utm-source-platform`]: touch.utmSourcePlatform,
    [`${prefix}-utm-creative-format`]: touch.utmCreativeFormat,
    [`${prefix}-utm-marketing-tactic`]: touch.utmMarketingTactic,
    [`${prefix}-gclid`]: touch.gclid,
    [`${prefix}-gbraid`]: touch.gbraid,
    [`${prefix}-wbraid`]: touch.wbraid,
    [`${prefix}-msclkid`]: touch.msclkid,
    [`${prefix}-fbclid`]: touch.fbclid,
    [`${prefix}-ttclid`]: touch.ttclid,
    [`${prefix}-linkedin-click-id`]: touch.linkedInClickId
  });
}

function compactRecord(values: Record<string, string>) {
  return Object.fromEntries(Object.entries(values).filter(([, value]) => Boolean(value)));
}

function cleanValue(value: unknown) {
  return typeof value === "string" ? value.trim().slice(0, maximumStoredValueLength) : "";
}

function referrerHostname(referrer: string) {
  if (!referrer) return "";
  try {
    return new URL(referrer).hostname.replace(/^www\./, "");
  } catch {
    return "";
  }
}
