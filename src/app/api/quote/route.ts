import { NextResponse } from "next/server";
import { sendSmtpMail } from "@/lib/smtp";
import { consumeRateLimit, hasOversizedBody, isTrustedRequestOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const quoteSubject = "New Quote Request from Velomac Website";
const applicationReviewSubject = "New Flowmeter Application Review from Velomac Website";

type QuotePayload = Record<string, unknown>;

const maximumRequestBytes = 64 * 1024;
const minimumCompletionTimeMs = 1_500;

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  }

  if (hasOversizedBody(request, maximumRequestBytes)) {
    return NextResponse.json({ message: "Request is too large." }, { status: 413 });
  }

  const rateLimit = consumeRateLimit(request, "quote", 6, 10 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many requests. Please try again shortly." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  try {
    const payload = await readPayload(request);

    if (JSON.stringify(payload).length > maximumRequestBytes) {
      return NextResponse.json({ message: "Request is too large." }, { status: 413 });
    }

    if (isLikelyAutomatedSubmission(payload)) {
      return NextResponse.json({ message: "Quote request received." });
    }

    const name = readString(payload.name);
    const email = readString(payload.email);
    const message = readString(payload.requirements);
    const isApplicationReview = readString(payload["inquiry-type"]) === "Flowmeter Application Review";

    if (!name || !email || !message) {
      return NextResponse.json(
        { message: "Name, email and message/application details are required." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json({ message: "Please enter a valid email address." }, { status: 400 });
    }

    const smtpHost = process.env.SMTP_HOST || "smtp.hostinger.com";
    const smtpPort = Number(process.env.SMTP_PORT || 465);
    const smtpUser = process.env.SMTP_USER;
    const smtpPass = process.env.SMTP_PASS;
    const quoteToEmail = process.env.QUOTE_TO_EMAIL;

    if (!smtpUser || !smtpPass || !quoteToEmail || !Number.isFinite(smtpPort)) {
      return NextResponse.json({ message: "Email delivery is not configured." }, { status: 500 });
    }

    await sendSmtpMail({
      host: smtpHost,
      port: smtpPort,
      user: smtpUser,
      pass: smtpPass,
      to: quoteToEmail,
      replyTo: email,
      subject: isApplicationReview ? applicationReviewSubject : quoteSubject,
      text: isApplicationReview ? buildApplicationReviewEmailBody(payload) : buildEmailBody(payload)
    });

    return NextResponse.json({
      message: isApplicationReview ? "Application review received." : "Quote request received."
    });
  } catch (error) {
    console.error("Quote form submission failed", error);
    return NextResponse.json({ message: "Quote request could not be sent." }, { status: 500 });
  }
}

async function readPayload(request: Request): Promise<QuotePayload> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return (await request.json()) as QuotePayload;
  }

  const formData = await request.formData();
  const payload: QuotePayload = {};

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      payload[key] = value;
    }
  });

  return payload;
}

function buildEmailBody(payload: QuotePayload) {
  const rows = [
    ["Name", readString(payload.name)],
    ["Company", readString(payload.company)],
    ["Email", readString(payload.email)],
    ["Phone / WhatsApp", readString(payload["whatsapp-phone"])],
    ["Country / Region", readString(payload["country-region"])],
    ["Product interest", readString(payload["product-interest"])],
    ["Medium / fluid", readString(payload["medium-fluid"])],
    ["Pipe size", readString(payload["pipe-size"])],
    ["Flow range", readString(payload["flow-range"])],
    ["Temperature / pressure", readString(payload["temperature-pressure"])],
    ["Message", readString(payload.requirements)]
  ];

  return [
    "A new quote request was submitted through the Velomac website.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value || "-"}`)
  ].join("\n");
}

function buildApplicationReviewEmailBody(payload: QuotePayload) {
  const applicationData = readString(payload.requirements);

  return [
    "Flowmeter Application Review",
    "",
    `Product: ${readString(payload["product-interest"]) || "-"}`,
    `Product slug: ${readString(payload["product-slug"]) || "-"}`,
    `Product category: ${readString(payload["product-category"]) || "-"}`,
    `Source page: ${readString(payload["source-page"]) || "-"}`,
    `Page path: ${readString(payload["page-path"]) || "-"}`,
    `Page URL: ${readString(payload["page-url"]) || "-"}`,
    `Source type: ${readString(payload["source-type"]) || "-"}`,
    `Source section: ${readString(payload["source-section"]) || "-"}`,
    `Source origin path: ${readString(payload["source-origin-path"]) || "-"}`,
    `Application type: ${readString(payload["application-type"]) || "-"}`,
    "",
    applicationData,
    "",
    "Contact:",
    `Name: ${readString(payload.name) || "-"}`,
    `Work email: ${readString(payload.email) || "-"}`,
    `Company: ${readString(payload.company) || "-"}`,
    `Country / Region: ${readString(payload["country-region"]) || "-"}`,
    `Phone / WhatsApp: ${readString(payload["whatsapp-phone"]) || "-"}`
  ].join("\n");
}

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function isLikelyAutomatedSubmission(payload: QuotePayload) {
  if (readString(payload.website)) return true;

  const startedAt = Number(readString(payload["started-at"]));
  return Number.isFinite(startedAt) && startedAt > 0 && Date.now() - startedAt < minimumCompletionTimeMs;
}
