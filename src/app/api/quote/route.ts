import { NextResponse } from "next/server";
import { sendSmtpMail } from "@/lib/smtp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const subject = "New Quote Request from Velomac Website";

type QuotePayload = Record<string, unknown>;

export async function POST(request: Request) {
  try {
    const payload = await readPayload(request);
    const name = readString(payload.name);
    const email = readString(payload.email);
    const message = readString(payload.requirements);

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
      subject,
      text: buildEmailBody(payload)
    });

    return NextResponse.json({ message: "Quote request received." });
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

function readString(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
