import { NextResponse } from "next/server";
import { adminSessionCookieName, getAdminAuthFailure, verifyAdminSession } from "@/lib/adminAuth";
import { sanitizeArticleBodyHtml } from "@/lib/richTextSanitizer";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Read-only rendering preview. It never saves content or publishes a draft.
export async function POST(request: Request) {
  const cookie = (request.headers.get("cookie") || "").split(";").map(value => value.trim()).find(value => value.startsWith(`${adminSessionCookieName}=`));
  if (!verifyAdminSession(cookie ? decodeURIComponent(cookie.slice(adminSessionCookieName.length + 1)) : undefined)) {
    const failure = getAdminAuthFailure();
    return NextResponse.json({message: failure.message}, {status: failure.status});
  }
  try {
    const body = await request.json();
    if (typeof body.html !== "string" || body.html.length > 2_000_000) return NextResponse.json({message: "Article preview requires HTML text under 2 MB."}, {status: 400});
    return NextResponse.json({html: sanitizeArticleBodyHtml(body.html)}, {headers: {"Cache-Control": "no-store"}});
  } catch {
    return NextResponse.json({message: "Article preview could not be rendered."}, {status: 400});
  }
}
