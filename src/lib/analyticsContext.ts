// Apply this only at the analytics boundary. Inquiry attribution remains unchanged.
const campaignQueryKeys = [
  "utm_source", "utm_medium", "utm_campaign", "utm_id", "utm_term", "utm_content",
  "utm_source_platform", "utm_creative_format", "utm_marketing_tactic",
  "gclid", "dclid", "gbraid", "wbraid"
];
const campaignCharacters = new RegExp("^[\\p{L}\\p{N} ._-]+$", "u");
const contiguousDigits = new RegExp("\\p{Nd}{9,}", "u");
const onlyNumeric = new RegExp("^[\\p{Nd} ._-]+$", "u");
const digit = new RegExp("\\p{Nd}", "gu");
const groupedDigits = new RegExp("(?:^|[ ._-])\\p{Nd}(?:[ ._-]*\\p{Nd}){8,}(?:$|[ ._-])", "u");

export function analyticsCampaignValue(value: string) {
  const trimmed = value.trim();
  if (!trimmed || trimmed.length > 100 || !campaignCharacters.test(trimmed)) return "";
  return looksLikePhoneNumber(trimmed) ? "" : trimmed;
}

function looksLikePhoneNumber(value: string) {
  return contiguousDigits.test(value) ||
    (onlyNumeric.test(value) && (value.match(digit)?.length ?? 0) >= 7) ||
    groupedDigits.test(value);
}

export function analyticsPathname(pathname: string) {
  // Public routes use plain slugs, not user-supplied text or identifiers.
  return /^\/(?:[a-z0-9-]+\/)*[a-z0-9-]*$/i.test(pathname) &&
    !pathname.split("/").some(looksLikePhoneNumber)
    ? pathname
    : "/unknown";
}

export function analyticsReferrerOrigin(referrer: string) {
  try {
    const url = new URL(referrer);
    return url.protocol === "https:" || url.protocol === "http:" ? url.origin : "";
  } catch {
    return "";
  }
}

function analyticsPagePath(url: URL) {
  const query = new URLSearchParams();
  for (const key of campaignQueryKeys) {
    const value = analyticsCampaignValue(url.searchParams.get(key) || "");
    if (value) query.set(key, value);
  }
  const campaignQuery = query.toString();
  return analyticsPathname(url.pathname) + (campaignQuery ? `?${campaignQuery}` : "");
}

export function analyticsLandingPage(path: string) {
  if (!path.startsWith("/") || path.startsWith("//")) return "";
  try {
    return analyticsPagePath(new URL(path, "https://analytics.invalid"));
  } catch {
    return "";
  }
}

export function analyticsPageContext(href: string, referrer: string) {
  const url = new URL(href);
  const pagePath = analyticsPagePath(url);
  return {
    page_path: pagePath,
    page_location: url.origin + pagePath,
    page_referrer: analyticsReferrerOrigin(referrer)
  };
}
