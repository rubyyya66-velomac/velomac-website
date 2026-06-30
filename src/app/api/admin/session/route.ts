import { NextResponse } from "next/server";
import {
  adminSessionCookieName,
  createAdminSession,
  getAdminConfigStatus,
  getAdminSessionMaxAge,
  validateAdminCredentials,
  verifyAdminSession
} from "@/lib/adminAuth";

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
  const config = getAdminConfigStatus();

  if (!config.configured) {
    return NextResponse.json(
      {
        message: `Admin login is not configured. Please set ${config.missing.join(", ")}.`
      },
      { status: 503 }
    );
  }

  const body = (await request.json()) as {
    username?: string;
    password?: string;
  };

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
