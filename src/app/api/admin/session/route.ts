import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  createAdminSession,
  getAdminConfigStatus,
  getAdminSessionMaxAge,
  validateAdminCredentials,
  verifyAdminSession
} from "@/lib/adminAuth";
import { consumeRateLimit, hasOversizedBody, isTrustedRequestOrigin } from "@/lib/requestSecurity";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const config = getAdminConfigStatus();
  const token = readCookie(request, adminSessionCookieName);

  return NextResponse.json({
    authenticated: config.configured && verifyAdminSession(token),
    configured: config.configured,
    missing: config.missing
  });
}

export async function POST(request: Request) {
  if (!isTrustedRequestOrigin(request)) {
    return NextResponse.json({ message: "Request origin is not allowed." }, { status: 403 });
  }

  if (hasOversizedBody(request, 8 * 1024)) {
    return NextResponse.json({ message: "Request is too large." }, { status: 413 });
  }

  const rateLimit = consumeRateLimit(request, "admin-login", 10, 15 * 60 * 1000);
  if (!rateLimit.allowed) {
    return NextResponse.json(
      { message: "Too many login attempts. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rateLimit.retryAfter) } }
    );
  }

  const config = getAdminConfigStatus();

  if (!config.configured) {
    return NextResponse.json(
      {
        message: `Admin login is not configured. Please set ${config.missing.join(", ")}.`
      },
      { status: 503 }
    );
  }

  let body: { username?: string; password?: string };
  try {
    body = (await request.json()) as { username?: string; password?: string };
  } catch {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  if (!validateAdminCredentials(body.username || "", body.password || "")) {
    return NextResponse.json({ message: "Authentication failed. Please check the username and password." }, { status: 401 });
  }

  const response = NextResponse.json({ authenticated: true });

  response.cookies.set(adminSessionCookieName, createAdminSession(body.username || ""), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: getAdminSessionMaxAge(),
    path: "/"
  });

  return response;
}

export async function DELETE() {
  const response = NextResponse.json({ authenticated: false });

  response.cookies.set(adminSessionCookieName, "", {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 0,
    path: "/"
  });

  return response;
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}
