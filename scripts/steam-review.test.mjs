import assert from "node:assert/strict";
import { readFileSync, writeFileSync } from "node:fs";
import { test } from "node:test";
import { runInNewContext } from "node:vm";
import ts from "typescript";
import * as steam from "../src/lib/steamApplicationReview.ts";
import * as configs from "../src/content/applicationReview.ts";

function load(path, imports, globals = {}) {
  const { outputText } = ts.transpileModule(readFileSync(new URL(path, import.meta.url), "utf8"), { compilerOptions: { module: ts.ModuleKind.CommonJS, jsx: ts.JsxEmit.ReactJSX, target: ts.ScriptTarget.ES2022 } });
  const exports = {};
  runInNewContext(outputText, { exports, require: (name) => { assert.ok(Object.hasOwn(imports, name), name); return imports[name]; }, ...globals });
  return exports;
}

function formFixture(values = {}) {
  const data = new FormData();
  Object.entries({
    "medium-type": "Steam", "medium-name": "Steam", "steam-measurement-output": "Mass Flow (kg/h)", "steam-flow-unit": "kg/h",
    "minimum-flow": "125.50", "normal-flow": "900", "maximum-flow": "2400",
    "minimum-flow-unit": "kg/h", "normal-flow-unit": "kg/h", "maximum-flow-unit": "kg/h",
    "steam-condition": "Superheated Steam", pressure: "7.2", "pressure-unit": "bar", "steam-pressure-reference": "Gauge Pressure",
    temperature: "220", "temperature-unit": "°C", "pipe-size-value": "80", "pipe-size-value-unit": "DN",
    "connection-standard": "ASME B16.5", "upstream-straight-run": "12", "upstream-straight-run-unit": "D",
    "downstream-straight-run": "8", "downstream-straight-run-unit": "D", "nearby-fittings": "Multiple fittings",
    "pipe-orientation": "Horizontal", "output-communication": "DCS / PLC Integration", "additional-notes": "Synthetic QA example; lengths describe available pipe, not installation requirements.",
    name: "Steam QA Fixture", email: "buyer@example.test", company: "Example Engineering", "country-region": "Example country",
    ...values
  }).forEach(([key, value]) => data.set(key, value));
  ["Pressure Transmitter", "Temperature Transmitter", "External Flow Computer"].forEach((value) => data.append("steam-instrumentation", value));
  return data;
}

function api(smtp, { trusted = true, allowed = true, configured = true } = {}) {
  return load("../src/app/api/quote/route.ts", {
    "next/server": { NextResponse: Response }, "@/lib/smtp": { sendSmtpMail: smtp }, "@/lib/steamApplicationReview": steam,
    "@/lib/requestSecurity": { isTrustedRequestOrigin: () => trusted, hasOversizedBody: () => false, consumeRateLimit: () => ({ allowed, retryAfter: 60 }) }
  }, { process: { env: configured ? { SMTP_USER: "fixture@example.test", SMTP_PASS: "fixture", QUOTE_TO_EMAIL: "sales@example.test" } : {} }, console: { error() {} }, Buffer }).POST;
}

function payload(data = steam.steamReviewFromFormData(formFixture())) {
  return { "inquiry-type": "Flowmeter Application Review", "application-type": "steam-measurement", "steam-review-data": JSON.stringify(data), requirements: steam.formatSteamReview(data), name: "Steam QA Fixture", email: "buyer@example.test", company: "Example Engineering", "country-region": "Example country" };
}
const request = (data) => new Request("http://localhost/api/quote", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(data) });

test("steam values and units round-trip without conversion; incomplete and unknown ranges are accepted", () => {
  const data = steam.steamReviewFromFormData(formFixture());
  assert.equal(steam.validateSteamReview(data), "");
  assert.equal(data.minimumFlow, "125.50");
  assert.equal(data.flowUnit, "kg/h");
  assert.deepEqual(steam.parseSteamReviewData(JSON.stringify(data)), data);
  for (const [output, unit] of Object.entries(steam.steamMeasurementOutputs)) {
    const next = steam.steamReviewFromFormData(formFixture({ "steam-measurement-output": output, "steam-flow-unit": unit, "normal-flow": "", "maximum-flow": "", pressure: "", temperature: "" }));
    assert.equal(next.flowUnit, unit); assert.equal(next.minimumFlow, "125.50"); assert.equal(steam.validateSteamReview(next), "");
  }
  const blank = steam.steamReviewFromFormData(formFixture({ "steam-measurement-output": "Not Sure", "minimum-flow": "", "normal-flow": "", "maximum-flow": "", pressure: "", temperature: "" }));
  assert.equal(steam.validateSteamReview(blank), "");
});

test("steam range, unit, numeric and instrumentation inconsistencies are rejected", () => {
  const data = steam.steamReviewFromFormData(formFixture());
  for (const change of [{ minimumFlow: "1000" }, { normalFlow: "3000" }, { flowUnit: "invented unit" }, { minimumFlow: "-1" }, { temperature: "not numeric" }, { pressureUnit: "unknown unit" }, { pressureReference: "guessed" }, { instrumentation: ["None", "Pressure Transmitter"] }]) assert.ok(steam.validateSteamReview({ ...data, ...change }));
  assert.equal(steam.parseSteamReviewData("broken"), null);
  assert.equal(steam.parseSteamReviewData("{}"), null);
});

test("required output and known flow units remain separate through the real email handler", async () => {
  const data = steam.steamReviewFromFormData(formFixture({ "steam-measurement-output": "Mass Flow (t/h)", "steam-flow-unit": "m³/h", "steam-condition": "Not Sure", "steam-pressure-reference": "Absolute Pressure" }));
  assert.equal(data.flowUnit, "m³/h"); assert.equal(data.minimumFlow, "125.50"); assert.equal(steam.validateSteamReview(data), "");
  let captured;
  const response = await api(async (mail) => { captured = mail; })(request(payload(data)));
  assert.equal((await response.json()).accepted, true);
  for (const line of ["Required measurement output: Mass Flow (t/h)", "Flow unit: m³/h", "Minimum Flow: 125.50 m³/h", "Steam condition: Not Sure", "Pressure reference: Absolute Pressure"]) assert.ok(captured.text.includes(line), line);
});

test("incomplete technical data and unknown steam condition reach email without inferred values", async () => {
  const form = formFixture({ "steam-measurement-output": "Not Sure", "steam-flow-unit": "Not Sure", "steam-condition": "Not Sure", "minimum-flow": "", "normal-flow": "", "maximum-flow": "", pressure: "", temperature: "" });
  const data = steam.steamReviewFromFormData(form); let captured;
  const response = await api(async (mail) => { captured = mail; })(request(payload(data)));
  assert.equal((await response.json()).accepted, true);
  for (const line of ["Minimum Flow: Not provided", "Operating pressure: Not provided", "Steam condition: Not Sure"]) assert.ok(captured.text.includes(line), line);
});

test("actual quote handler renders every canonical steam field and attribution into the SMTP notification", async () => {
  let captured;
  const data = steam.steamReviewFromFormData(formFixture());
  const body = { ...payload(data), requirements: "Client summary deliberately omitted", "source-type": "application_page", "source-section": "bottom-application-review", "source-origin-path": "/applications/steam-measurement", "page-path": "/application-review", "first-touch-utm-source": "qa_fixture", "session-touch-landing-page": "/applications/steam-measurement" };
  const response = await api(async (mail) => { captured = mail; })(request(body));
  assert.equal(response.status, 200); assert.equal((await response.json()).accepted, true);
  for (const [label, value] of steam.steamReviewRows(data)) assert.ok(captured.text.includes(`${label}: ${value}`), label);
  for (const value of ["First-touch UTM source: qa_fixture", "Source section: bottom-application-review", "Pressure reference: Gauge Pressure", "Company: Example Engineering", "Country / Region: Example country"]) assert.ok(captured.text.includes(value), value);
  assert.equal(captured.replyTo, "buyer@example.test");
  if (process.env.STEAM_QA_EMAIL_PATH) writeFileSync(process.env.STEAM_QA_EMAIL_PATH, "SIMULATED SMTP CAPTURE — NOT SENT TO VELOMAC\n\n" + captured.text + "\n");
});

test("steam API rejects invalid ranges and missing essential contacts before SMTP; unrelated/legacy inquiries still work", async () => {
  let sent = 0; const post = api(async () => { sent++; });
  for (const body of [payload({ ...steam.steamReviewFromFormData(formFixture()), normalFlow: "3000" }), { ...payload(), company: "" }, { ...payload(), "country-region": "" }, { ...payload(), "steam-review-data": "broken" }]) assert.equal((await post(request(body))).status, 400);
  assert.equal(sent, 0);
  for (const body of [{ ...payload(), "application-type": "gas-flow-measurement", company: "", "country-region": "" }, { ...payload(), "steam-review-data": undefined, company: "", "country-region": "" }]) assert.equal((await post(request(body))).status, 200);
  assert.equal(sent, 2);
});

test("steam submission preserves origin/rate-limit/honeypot/timing protections and reports SMTP failures", async () => {
  let sent = 0;
  for (const options of [{ trusted: false }, { allowed: false }, { configured: false }]) {
    const response = await api(async () => { sent++; }, options)(request(payload()));
    assert.ok([403, 429, 500].includes(response.status)); assert.notEqual((await response.json()).accepted, true);
  }
  for (const extra of [{ website: "bot" }, { "started-at": String(Date.now()) }]) assert.notEqual((await (await api(async () => { sent++; })(request({ ...payload(), ...extra }))).json()).accepted, true);
  assert.equal(sent, 0);
  const failure = await api(async () => { throw new Error("SMTP failure fixture"); })(request(payload()));
  assert.equal(failure.status, 500); assert.notEqual((await failure.json()).accepted, true);
});

test("existing multipart attachment handling carries steam data and rejects disguised files", async () => {
  let captured; const post = api(async (mail) => { captured = mail; });
  const multipart = () => { const data = new FormData(); Object.entries(payload()).forEach(([key, value]) => data.set(key, value)); return data; };
  const good = multipart(); good.set("attachment", new Blob(["%PDF-1.7\nSynthetic QA fixture\n"], { type: "application/pdf" }), "steam-qa.pdf");
  assert.equal((await post(new Request("http://localhost/api/quote", { method: "POST", body: good }))).status, 200);
  assert.equal(captured.attachments[0].filename, "steam-qa.pdf"); assert.ok(captured.text.includes("Maximum Flow: 2400 kg/h"));
  const bad = multipart(); bad.set("attachment", new Blob(["not a pdf"], { type: "application/pdf" }), "bad.pdf");
  assert.equal((await post(new Request("http://localhost/api/quote", { method: "POST", body: bad }))).status, 415);
});

test("steam client posts the actual full form through the existing API with no lost fields, with and without an attachment", async () => {
  for (const withAttachment of [false, true]) {
    const fixture = formFixture();
    if (withAttachment) fixture.set("attachment", new Blob(["%PDF-1.7\nQA\n"], { type: "application/pdf" }), "steam-qa.pdf");
    const jsx = (type, props) => ({ type, props }); let captured;
    const { ApplicationReview } = load("../src/components/ApplicationReview.tsx", {
      "next/link": { __esModule: true, default: "a" }, "react/jsx-runtime": { jsx, jsxs: jsx, Fragment: "fragment" },
      react: { useEffect() {}, useState: (value) => [typeof value === "function" ? value() : value, () => {}], useRef: (current) => ({ current }) },
      "@/components/Layout": { Container: "div" }, "@/components/SteamApplicationReviewFields": { SteamApplicationReviewFields: "steam-fields" },
      "@/content/applicationReview": configs, "@/lib/steamApplicationReview": steam, "@/lib/analytics": { trackAnalyticsEvent() {} },
      "@/lib/leadAttribution": { getLeadAttributionPayload: () => ({ "first-touch-landing-page": "/applications/steam-measurement", "first-touch-referrer": "https://example.test/", "first-touch-utm-source": "qa_fixture", "first-touch-utm-medium": "test", "first-touch-utm-campaign": "steam_review_qa", "session-touch-landing-page": "/applications/steam-measurement", "session-touch-utm-source": "qa_fixture" }) }
    }, {
      FormData: class { constructor(form) { return form ? fixture : new FormData(); } },
      Date: class extends Date { static now() { return Date.now() - 10_000; } },
      window: { location: { href: "http://localhost/application-review?application_type=steam-measurement" }, dispatchEvent() {} }, sessionStorage: { setItem() {} }, Event,
      fetch: async (url, options) => { assert.equal(url, "/api/quote"); return api(async (mail) => { captured = mail; })(new Request("http://localhost/api/quote", { ...options, body: options.body })); }
    });
    function findForm(node) { if (Array.isArray(node)) return node.map(findForm).find(Boolean); return node?.type === "form" ? node : node?.props ? findForm(node.props.children) : undefined; }
    const form = findForm(ApplicationReview({ productName: "Not sure yet", productSlug: "not-sure-yet", productCategory: "Flowmeters", sourcePath: "/application-review", allowProductSelection: true, sourceContext: { applicationType: "steam-measurement", sourceType: "application_page", sourceSection: "bottom-application-review", sourcePath: "/applications/steam-measurement" } }));
    assert.ok(form); await form.props.onSubmit({ preventDefault() {}, currentTarget: {} });
    assert.ok(captured); assert.ok(captured.text.includes("Minimum Flow: 125.50 kg/h")); assert.ok(captured.text.includes("Session UTM source: qa_fixture"));
    assert.equal(Boolean(captured.attachments?.length), withAttachment);
    if (!withAttachment && process.env.STEAM_QA_EMAIL_PATH) writeFileSync(process.env.STEAM_QA_EMAIL_PATH, "SIMULATED SMTP CAPTURE — NOT SENT TO VELOMAC\nSynthetic values only; available pipe lengths are not installation requirements.\n\n" + captured.text + "\n");
  }
});
