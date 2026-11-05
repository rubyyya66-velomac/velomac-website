import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";

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
  for (const hostname of ["www.velomacflowmeter.com", "127.0.0.1"]) {
    const commands = [];
    const search = "?utm_source=linkedin&utm_medium=organic_social&utm_campaign=quotation_comparison_sheet";
    const href = `https://${hostname}/resources${search}#buyer-tools-heading`;
    const { GoogleAnalytics } = load("../src/components/GoogleAnalytics.tsx", {
      "next/navigation": { usePathname: () => "/resources" },
      "react": {
        useEffect: (effect) => effect(),
        useRef: (current) => ({ current })
      },
      "@/lib/leadAttribution": {
        captureLeadAttribution: () => {},
        getLeadAttributionAnalyticsParameters: () => ({})
      }
    }, {
      window: { location: { hostname, search, href }, gtag: (...args) => commands.push(args) },
      document: { title: "Resources", getElementById: () => ({}) }
    });
    GoogleAnalytics({ measurementId: "G-FIXTURE" });
    const pageViews = commands.filter(([command, event]) => command === "event" && event === "page_view");
    assert.equal(pageViews.length, hostname === "127.0.0.1" ? 0 : 1);
    if (pageViews.length) {
      assert.equal(pageViews[0][2].page_location, href);
      assert.equal(pageViews[0][2].page_path, "/resources" + search);
    }
  }
});
