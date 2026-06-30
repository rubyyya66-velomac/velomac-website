import { NextResponse } from "next/server";
import { adminContentFiles } from "@/content/adminContentFiles";
import { readAdminContent, saveAdminContent } from "@/lib/adminContent";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const fileKey = searchParams.get("file");

  if (!fileKey) {
    return NextResponse.json({ files: adminContentFiles });
  }

  try {
    const result = await readAdminContent(fileKey);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Admin content read failed", error);
    return NextResponse.json({ message: "Could not read content file." }, { status: 400 });
  }
}

export async function POST(request: Request) {
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
      message: body.message
    });

    return NextResponse.json({
      message: result.mode === "github" ? "Saved and committed to GitHub." : "Saved locally.",
      mode: result.mode
    });
  } catch (error) {
    console.error("Admin content save failed", error);
    return NextResponse.json(
      { message: error instanceof Error ? error.message : "Could not save content." },
      { status: 500 }
    );
  }
}
