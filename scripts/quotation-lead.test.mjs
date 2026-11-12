import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as analyticsContext from "../src/lib/analyticsContext.ts";
import { isPrivateAnalyticsPath } from "../src/lib/analyticsScope.ts";
import * as applicationReviewConfig from "../src/content/applicationReview.ts";

// Exercise the actual handler and client event guard without opening an SMTP
// connection, writing a lead, or sending analytics to Google.
function load(path, imports, globals = {}) {
  const source = readFileSync(new URL(path, import.meta.url), "utf8");
  const { outputText } = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 }
  });
  const exports = {};
  runInNewContext(outputText, {
    exports, require: (name) => {
      assert.ok(Object.hasOwn(imports, name), name);
      return imports[name];
    },
    ...globals
  });
  return exports;
}

function quoteRoute(smtp) {
  return load("../src/app/api/quote/route.ts", {
    "next/server": { NextResponse: Response },
    "@/lib/smtp": { sendSmtpMail: smtp },
    "@/lib/requestSecurity": {
      consumeRateLimit: () => ({ allowed: true }),
      hasOversizedBody: () => false,
      isTrustedRequestOrigin: () => true
    }
  }, {
    process: { env: { SMTP_USER: "test@example.test", SMTP_PASS: "fixture", QUOTE_TO_EMAIL: "test@example.test" } },
    console: { error: () => {} }
  }).POST;
}

const submit = (post, extra = {}) => post(new Request("http://localhost/api/quote", {
  method: "POST",
  headers: { "content-type": "application/json" },
  body: JSON.stringify({ name: "Test buyer", email: "buyer@example.test", requirements: "Test only", ...extra })
}));

test("quote API confirms accepted only after SMTP resolves", async () => {
  let smtpCalls = 0;
  const post = quoteRoute(async () => { smtpCalls++; });
  const bot = await submit(post, { website: "honeypot" });
  assert.equal(bot.status, 200);
  assert.notEqual((await bot.json()).accepted, true);
  assert.equal(smtpCalls, 0);

  const tooFast = await submit(post, { "started-at": String(Date.now()) });
  assert.equal(tooFast.status, 200);
  assert.notEqual((await tooFast.json()).accepted, true);
  assert.equal(smtpCalls, 0);

  const ok = await submit(post);
  assert.equal(ok.status, 200);
  assert.equal((await ok.json()).accepted, true);
  assert.equal(smtpCalls, 1);

  const invalid = await submit(post, { email: "invalid" });
  assert.equal(invalid.status, 400);
  assert.equal(smtpCalls, 1);

  const error = await submit(quoteRoute(async () => { throw new Error("SMTP fixture failure"); }));
  assert.equal(error.status, 500);
  assert.notEqual((await error.json()).accepted, true);
});

test("Contact form emits exactly one generate_lead only for accepted result", async () => {
  for (const [status, payload, expected] of [[200, { accepted: true }, 1], [200, {}, 0], [500, {}, 0]]) {
    const events = [];
    const jsx = (type, props) => ({ type, props });
    const { QuoteForm } = load("../src/components/QuoteForm.tsx", {
      "react/jsx-runtime": { jsx, jsxs: jsx },
      "react": {
        useEffect: () => {},
        useState: (initial) => [initial, () => {}],
        useRef: (current) => ({ current })
      },
      "@/content/contact": { contactContent: { form: { fields: [], processFields: [], errorMessage: "Request failed" } } },
      "@/content/products": { products: [] },
      "@/lib/analytics": { trackAnalyticsEvent: (...args) => events.push(args) },
      "@/lib/leadAttribution": { appendLeadAttribution: () => {} }
    }, {
      window: { location: { pathname: "/contact" } },
      fetch: async () => Response.json(payload, { status }),
      FormData: class {}
    });
    await QuoteForm().props.onSubmit({ preventDefault: () => {}, currentTarget: { reset: () => {} } });
    assert.equal(events.filter(([event]) => event === "generate_lead").length, expected);
    assert.equal(events.filter(([event]) => event === "quote_form_success").length, expected);
  }
});

test("Buyer Tools link records a quote click, not a lead", () => {
  const events = [];
  const { BuyerToolsQuoteLink } = load("../src/components/BuyerToolsQuoteLink.tsx", {
    "react/jsx-runtime": { jsx: (type, props) => ({ type, props }) },
    "next/link": { __esModule: true, default: "a" },
    "@/lib/analytics": { trackAnalyticsEvent: (...args) => events.push(args) }
  });
  const link = BuyerToolsQuoteLink();
  assert.equal(link.props.href, "/contact");
  link.props.onClick();
  assert.deepEqual(events.map(([name, { contact_channel, cta_location, page_path }]) => [
    name, contact_channel, cta_location, page_path
  ]), [["contact_link_click", "quote", "buyer_tools", "/resources"]]);
});

test("existing page_view instrumentation sends one manual event with campaign URL on the production hostname", () => {
  for (const [hostname, pathname, pageViewCount, captureCount] of [
    ["www.velomacflowmeter.com", "/resources", 1, 1],
    ["127.0.0.1", "/resources", 0, 1],
    ["www.velomacflowmeter.com", "/admin", 0, 0],
    ["www.velomacflowmeter.com", "/admin/content", 0, 0],
    ["www.velomacflowmeter.com", "/api/quote", 0, 0]
  ]) {
    const commands = [];
    let captures = 0;
    const search = "?utm_source=linkedin&utm_medium=organic_social&utm_campaign=quotation_comparison_sheet";
    const href = `https://${hostname}${pathname}${search}&email=buyer%40example.test#private-message`;
    const { GoogleAnalytics } = load("../src/components/GoogleAnalytics.tsx", {
      "next/navigation": { usePathname: () => pathname },
      "react": {
        useEffect: (effect) => effect(),
        useRef: (current) => ({ current })
      },
      "@/lib/leadAttribution": {
        captureLeadAttribution: () => { captures++; },
        getLeadAttributionAnalyticsParameters: () => ({})
      },
      "@/lib/analyticsScope": { isPrivateAnalyticsPath },
      "@/lib/analyticsContext": analyticsContext
    }, {
      window: { location: { hostname, search, href }, gtag: (...args) => commands.push(args) },
      document: { title: "Resources", referrer: "https://example.test/buyer/private?email=buyer%40example.test", getElementById: () => ({}) }
    });
    GoogleAnalytics({ measurementId: "G-FIXTURE" });
    const pageViews = commands.filter(([command, event]) => command === "event" && event === "page_view");
    assert.equal(pageViews.length, pageViewCount);
    assert.equal(captures, captureCount);
    if (pageViews.length) {
      assert.equal(pageViews[0][2].page_location, `https://${hostname}${pathname}${search}`);
      assert.equal(pageViews[0][2].page_path, "/resources" + search);
      assert.equal(pageViews[0][2].page_referrer, "https://example.test");
      const set = commands.find(([command]) => command === "set");
      assert.equal(set[1].page_location, pageViews[0][2].page_location);
      assert.equal(set[1].page_referrer, pageViews[0][2].page_referrer);
    }
  }
});

test("custom analytics and attribution are skipped on private paths", () => {
  for (const pathname of ["/admin", "/admin/content", "/api/quote", "/resources"]) {
    const commands = [];
    const window = {
      location: { pathname, href: `https://www.velomacflowmeter.com${pathname}?utm_source=linkedin&requirements=private` },
      gtag: (...args) => commands.push(args)
    };
    const { trackAnalyticsEvent } = load("../src/lib/analytics.ts", {
      "@/lib/analyticsScope": { isPrivateAnalyticsPath },
      "@/lib/leadAttribution": { getLeadAttributionAnalyticsParameters: () => ({}) },
      "@/lib/analyticsContext": analyticsContext
    }, { window, document: { referrer: "" } });
    trackAnalyticsEvent("fixture", { page_location: "https://example.test/?email=buyer@example.test" });
    assert.equal(commands.length, pathname === "/resources" ? 1 : 0);
    assert.equal(window.dataLayer?.length ?? 0, commands.length);
    if (commands.length) {
      assert.equal(commands[0][2].page_location, "https://www.velomacflowmeter.com/resources?utm_source=linkedin");
      assert.equal(window.dataLayer[0].page_path, "/resources");
      assert.equal(window.dataLayer[0].page_location, commands[0][2].page_location);
    }
  }
});

test("analytics URL context allows campaign and ad tags but drops personal or unknown inputs", () => {
  const href = "https://www.velomacflowmeter.com/contact?product=vortex-flowmeter&utm_source=newsletter" +
    "&utm_campaign=Flow+meters&utm_term=buyer%40example.test&utm_content=office-44-1234-567890" +
    "&utm_medium=555-123-4567&utm_id=buyer%2540example.test&gclid=abc-123_abc&email=buyer%40example.test#message";
  const referrer = "https://user:password@example.test/path-with-personal-details?phone=555-123-4567";
  assert.deepEqual(analyticsContext.analyticsPageContext(href, referrer), {
    page_location: "https://www.velomacflowmeter.com/contact?utm_source=newsletter&utm_campaign=Flow+meters&gclid=abc-123_abc",
    page_path: "/contact?utm_source=newsletter&utm_campaign=Flow+meters&gclid=abc-123_abc",
    page_referrer: "https://example.test"
  });
  assert.equal(analyticsContext.analyticsPathname("/resources/buyer%40example.test"), "/unknown");
  assert.equal(analyticsContext.analyticsPathname("/resources/phone-15551234567"), "/unknown");
  assert.equal(analyticsContext.analyticsPathname("/resources/dn50-flowmeter-flange-compatibility"), "/resources/dn50-flowmeter-flange-compatibility");
});

test("analytics filters stored attribution without changing inquiry attribution", () => {
  const fixture = new URL("https://www.velomacflowmeter.com/contact?utm_source=linkedin" +
    "&utm_content=buyer%40example.test&requirements=private");
  const storage = new Map();
  const fixtureStorage = { getItem: (key) => storage.get(key), setItem: (key, value) => storage.set(key, value) };
  const { getLeadAttributionAnalyticsParameters, getLeadAttributionPayload } = load("../src/lib/leadAttribution.ts", {
    "@/lib/analyticsContext": analyticsContext
  }, {
    URL, URLSearchParams,
    window: { location: fixture, localStorage: fixtureStorage, sessionStorage: fixtureStorage },
    document: { referrer: "https://example.test/campaign/referrer?email=buyer%40example.test" }
  });
  const analytics = getLeadAttributionAnalyticsParameters();
  assert.equal(analytics.campaign_source, "linkedin");
  assert.equal(analytics.landing_page, "/contact?utm_source=linkedin");
  assert.equal(analytics.lead_referrer, "https://example.test");
  assert.equal(analytics.campaign_content, undefined);
  const inquiry = getLeadAttributionPayload();
  assert.equal(inquiry["session-touch-utm-content"], "buyer@example.test");
  assert.equal(inquiry["session-touch-referrer"], "https://example.test/campaign/referrer");
  assert.equal(inquiry["submission-page"], "/contact");
});

test("Application Review only records accepted inquiries as successful leads", async () => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    "medium-name": "Water", "medium-type": "Liquid", "normal-flow": "10", "entrained-gas": "No",
    name: "Fixture", email: "test@example.test"
  })) form.set(key, value);
  const jsx = (type, props) => ({ type, props });
  const findSubmit = (element) => {
    if (Array.isArray(element)) return element.map(findSubmit).find(Boolean);
    if (element?.type === "form") return element.props.onSubmit;
    return element?.props ? findSubmit(element.props.children) : undefined;
  };
  for (const [status, payload, accepted] of [[200, { accepted: true }, true], [200, {}, false], [400, {}, false], [500, {}, false]]) {
    const events = [];
    const signals = [];
    const { ApplicationReview } = load("../src/components/ApplicationReview.tsx", {
      "next/link": { __esModule: true, default: "a" },
      "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: Symbol("Fragment") },
      "react": {
        useEffect: () => {},
        useState: (initial) => [typeof initial === "function" ? initial() : initial, () => {}],
        useRef: (current) => ({ current })
      },
      "@/components/Layout": { Container: "div" },
      "@/content/applicationReview": applicationReviewConfig,
      "@/lib/analytics": { trackAnalyticsEvent: (name) => events.push(name) },
      "@/lib/leadAttribution": { getLeadAttributionPayload: () => ({}) }
    }, {
      FormData: class { constructor() { return form; } },
      window: { location: { href: "https://www.velomacflowmeter.com/application-review" }, dispatchEvent: (event) => signals.push(event.type) },
      sessionStorage: { setItem: () => signals.push("submitted") },
      Event,
      fetch: async () => Response.json(payload, { status })
    });
    const submit = findSubmit(ApplicationReview({
      productName: "Liquid Turbine Flowmeter", productSlug: "liquid-turbine-flowmeter",
      productCategory: "Flowmeters", sourcePath: "/application-review"
    }));
    assert.ok(submit);
    await submit({ preventDefault() {}, currentTarget: {} });
    assert.deepEqual(events, [
      "application_review_submit",
      ...(accepted ? ["application_review_success", "generate_lead", "liquid_phase_check_submitted"] : []),
      ...(status >= 400 ? ["application_review_error"] : [])
    ]);
    assert.deepEqual(signals, accepted ? ["submitted", "velomac:application-review-submitted"] : []);
  }
});
