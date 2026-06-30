import { NextResponse } from "next/server";
import { adminSessionCookieName, getAdminAuthFailure, verifyAdminSession } from "@/lib/adminAuth";
import { isAllowedImageFilename, listPublicImages, saveUploadedImage } from "@/lib/adminContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const maxUploadBytes = 5 * 1024 * 1024;

export async function GET(request: Request) {
  const authFailure = requireAdmin(request);
  if (authFailure) {
    return authFailure;
  }

  try {
    const images = await listPublicImages();
    return NextResponse.json({ images });
  } catch (error) {
    console.error("Admin media list failed", error);
    return NextResponse.json(
      { message: "Images could not be loaded. Please refresh and try again." },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  const authFailure = requireAdmin(request);
  if (authFailure) {
    return authFailure;
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ message: "Please choose an image file to upload." }, { status: 400 });
    }

    if (!isAllowedImageFilename(file.name)) {
      return NextResponse.json({ message: "Please upload a JPG, PNG, WEBP or SVG image." }, { status: 400 });
    }

    if (file.size > maxUploadBytes) {
      return NextResponse.json({ message: "Image is too large. Please upload a file under 5 MB." }, { status: 400 });
    }

    const result = await saveUploadedImage({
      filename: file.name,
      bytes: Buffer.from(await file.arrayBuffer())
    });

    return NextResponse.json({
      message: result.mode === "github" ? "Image uploaded and committed to GitHub." : "Image uploaded locally.",
      path: result.path,
      mode: result.mode
    });
  } catch (error) {
    console.error("Admin media upload failed", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Image upload failed. Please try again." },
      { status: 500 }
    );
  }
}

function requireAdmin(request: Request) {
  if (verifyAdminSession(readCookie(request, adminSessionCookieName))) {
    return null;
  }

  const failure = getAdminAuthFailure();

  return NextResponse.json({ message: failure.message }, { status: failure.status });
}

function readCookie(request: Request, name: string) {
  const cookieHeader = request.headers.get("cookie") || "";
  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());
  const match = cookies.find((cookie) => cookie.startsWith(`${name}=`));

  return match ? decodeURIComponent(match.slice(name.length + 1)) : undefined;
}
