import { NextResponse } from "next/server";
import { sendSmtpMail } from "@/lib/smtp";
import { consumeRateLimit, hasOversizedBody, isTrustedRequestOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const quoteSubject = "New Quote Request from Velomac Website";
const applicationReviewSubject = "New Flowmeter Application Review from Velomac Website";

type QuotePayload = Record<string, unknown>;
type QuoteSubmission = { payload: QuotePayload; attachment?: File };

const maximumRequestBytes = 6 * 1024 * 1024;
const maximumTextPayloadBytes = 64 * 1024;
const maximumAttachmentBytes = 5 * 1024 * 1024;
const minimumCompletionTimeMs = 1_500;
const attachmentContentTypes: Record<string, string> = {
  ".pdf": "application/pdf",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp"
};

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
    const { payload, attachment } = await readPayload(request);

    if (JSON.stringify(payload).length > maximumTextPayloadBytes) {
      return NextResponse.json({ message: "Request is too large." }, { status: 413 });
    }

    const mailAttachment = attachment ? await prepareAttachment(attachment) : null;
    if (attachment && !mailAttachment) {
      return NextResponse.json(
        { message: "Please upload a valid PDF, JPG, PNG or WebP file up to 5 MB." },
        { status: attachment.size > maximumAttachmentBytes ? 413 : 415 }
      );
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
      text: isApplicationReview ? buildApplicationReviewEmailBody(payload) : buildEmailBody(payload),
      attachments: mailAttachment ? [mailAttachment] : undefined
    });

    return NextResponse.json({
      message: isApplicationReview ? "Application review received." : "Quote request received."
    });
  } catch (error) {
    console.error("Quote form submission failed", error);
    return NextResponse.json({ message: "Quote request could not be sent." }, { status: 500 });
  }
}

async function readPayload(request: Request): Promise<QuoteSubmission> {
  const contentType = request.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    return { payload: (await request.json()) as QuotePayload };
  }

  const formData = await request.formData();
  const payload: QuotePayload = {};
  let attachment: File | undefined;

  formData.forEach((value, key) => {
    if (typeof value === "string") {
      payload[key] = value;
    } else if (key === "attachment" && value.size > 0) {
      attachment = value;
    }
  });

  return { payload, attachment };
}

function buildEmailBody(payload: QuotePayload) {
  const rows = [
    ["Name", readString(payload.name)],
    ["Company", readString(payload.company)],
    ["Email", readString(payload.email)],
    ["Phone / WhatsApp", readString(payload["whatsapp-phone"])],
    ["Country / Region", readString(payload["country-region"])],
    ["Product interest", readString(payload["product-interest"])],
    ["Source product slug", readString(payload["source-product-slug"])],
    ["Source application slug", readString(payload["source-application-slug"])],
    ["Medium / fluid", readString(payload["medium-fluid"])],
    ["Pipe size", readString(payload["pipe-size"])],
    ["Flow range", readString(payload["flow-range"])],
    ["Temperature / pressure", readString(payload["temperature-pressure"])],
    ["Message", readString(payload.requirements)],
    ...leadAttributionRows(payload)
  ];

  return [
    "A new quote request was submitted through the Velomac website.",
    "",
    ...rows.map(([label, value]) => `${label}: ${value || "-"}`)
  ].join("\n");
}

async function prepareAttachment(file: File) {
  if (file.size <= 0 || file.size > maximumAttachmentBytes) return null;

  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  const contentType = attachmentContentTypes[extension];
  if (!contentType || (file.type && file.type !== contentType)) return null;

  const content = Buffer.from(await file.arrayBuffer());
  if (!matchesFileSignature(content, extension)) return null;

  return {
    filename: file.name,
    contentType,
    content
  };
}

function matchesFileSignature(content: Buffer, extension: string) {
  if (extension === ".pdf") return content.subarray(0, 5).toString("ascii") === "%PDF-";
  if (extension === ".jpg" || extension === ".jpeg") {
    return content[0] === 0xff && content[1] === 0xd8 && content[2] === 0xff;
  }
  if (extension === ".png") {
    return content.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  }
  if (extension === ".webp") {
    return content.subarray(0, 4).toString("ascii") === "RIFF" && content.subarray(8, 12).toString("ascii") === "WEBP";
  }
  return false;
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
    "Lead attribution:",
    ...leadAttributionRows(payload).map(([label, value]) => `${label}: ${value || "-"}`),
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

function leadAttributionRows(payload: QuotePayload): Array<[string, string]> {
  const rows: Array<[string, string]> = [
    ["First-touch landing page", readString(payload["first-touch-landing-page"])],
    ["First-touch referrer", readString(payload["first-touch-referrer"])],
    ["First-touch captured at", readString(payload["first-touch-captured-at"])],
    ["First-touch UTM source", readString(payload["first-touch-utm-source"])],
    ["First-touch UTM medium", readString(payload["first-touch-utm-medium"])],
    ["First-touch UTM campaign", readString(payload["first-touch-utm-campaign"])],
    ["First-touch UTM ID", readString(payload["first-touch-utm-id"])],
    ["First-touch UTM term", readString(payload["first-touch-utm-term"])],
    ["First-touch UTM content", readString(payload["first-touch-utm-content"])],
    ["First-touch UTM source platform", readString(payload["first-touch-utm-source-platform"])],
    ["First-touch UTM creative format", readString(payload["first-touch-utm-creative-format"])],
    ["First-touch UTM marketing tactic", readString(payload["first-touch-utm-marketing-tactic"])],
    ["Session landing page", readString(payload["session-touch-landing-page"])],
    ["Session referrer", readString(payload["session-touch-referrer"])],
    ["Session captured at", readString(payload["session-touch-captured-at"])],
    ["Session UTM source", readString(payload["session-touch-utm-source"])],
    ["Session UTM medium", readString(payload["session-touch-utm-medium"])],
    ["Session UTM campaign", readString(payload["session-touch-utm-campaign"])],
    ["Session UTM ID", readString(payload["session-touch-utm-id"])],
    ["Session UTM term", readString(payload["session-touch-utm-term"])],
    ["Session UTM content", readString(payload["session-touch-utm-content"])],
    ["Session UTM source platform", readString(payload["session-touch-utm-source-platform"])],
    ["Session UTM creative format", readString(payload["session-touch-utm-creative-format"])],
    ["Session UTM marketing tactic", readString(payload["session-touch-utm-marketing-tactic"])],
    ["Google click ID", readString(payload["session-touch-gclid"]) || readString(payload["first-touch-gclid"])],
    ["Google GBRAID", readString(payload["session-touch-gbraid"]) || readString(payload["first-touch-gbraid"])],
    ["Google WBRAID", readString(payload["session-touch-wbraid"]) || readString(payload["first-touch-wbraid"])],
    ["Microsoft click ID", readString(payload["session-touch-msclkid"]) || readString(payload["first-touch-msclkid"])],
    ["Facebook click ID", readString(payload["session-touch-fbclid"]) || readString(payload["first-touch-fbclid"])],
    ["TikTok click ID", readString(payload["session-touch-ttclid"]) || readString(payload["first-touch-ttclid"])],
    ["LinkedIn click ID", readString(payload["session-touch-linkedin-click-id"]) || readString(payload["first-touch-linkedin-click-id"])],
    ["Submission page", readString(payload["submission-page"])]
  ];

  return rows.filter(([, value]) => Boolean(value));
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
