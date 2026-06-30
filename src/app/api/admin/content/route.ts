import { NextResponse } from "next/server";
import { adminContentFiles } from "@/content/adminContentFiles";
import { adminSessionCookieName, getAdminAuthFailure, verifyAdminSession } from "@/lib/adminAuth";
import { AdminContentLoadError, readAdminContent, saveAdminContent } from "@/lib/adminContent";
import type { AdminContentDiagnostics } from "@/lib/adminContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const authFailure = requireAdmin(request);
  if (authFailure) {
    return authFailure;
  }

  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("file");

  if (!fileKey) {
    return NextResponse.json({ files: adminContentFiles });
  }

  try {
    const result = await readAdminContent(fileKey);
    logAdminContentRead(result.diagnostics);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof AdminContentLoadError) {
      logAdminContentRead(error.diagnostics);
      console.error("Admin content read failed", {
        message: error.message,
        diagnostics: error.diagnostics
      });
    } else {
      console.error("Admin content read failed", {
        nodeEnv: process.env.NODE_ENV,
        requestedFileKey: fileKey,
        message: error instanceof Error ? error.message : String(error)
      });
    }

    return NextResponse.json(
      { message: error instanceof Error ? error.message : "This content could not be loaded. Please refresh and try again." },
      { status: 400 }
    );
  }
}

export async function POST(request: Request) {
  const authFailure = requireAdmin(request);
  if (authFailure) {
    return authFailure;
  }

  try {
    const body = (await request.json()) as {
      file?: string;
      content?: unknown;
      message?: string;
    };

    if (!body.file || body.content === undefined) {
      return NextResponse.json({ message: "File and content are required." }, { status: 400 });
    }

    const result = await saveAdminContent({
      key: body.file,
      content: body.content,
      message: "Update website content from admin"
    });

    return NextResponse.json({
      message: result.mode === "github" ? "Saved and committed to GitHub." : "Saved locally.",
      mode: result.mode
    });
  } catch (error) {
    console.error("Admin content save failed", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not save content. Please try again." },
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

function logAdminContentRead(diagnostics: AdminContentDiagnostics) {
  console.info("Admin content read diagnostics", {
    nodeEnv: diagnostics.nodeEnv,
    requestedFileKey: diagnostics.key,
    resolvedRepoPath: diagnostics.repoPath,
    githubEnv: diagnostics.githubEnv,
    githubStatus: diagnostics.githubStatus,
    githubError: diagnostics.githubError,
    localFsError: diagnostics.localFsError,
    fallbackError: diagnostics.fallbackError,
    finalLoadingMode: diagnostics.mode
  });
}
