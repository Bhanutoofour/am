import { NextRequest, NextResponse } from "next/server";
import { uploadFileToS3 } from "@/lib/server/s3-upload";

export const runtime = "nodejs";

const MAX_UPLOAD_BYTES = 25 * 1024 * 1024;

function slugFileName(fileName: string) {
  const parts = fileName.split(".");
  const ext = parts.length > 1 ? parts.pop() : "";
  const base = parts
    .join(".")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");

  return `${base || "upload"}${ext ? `.${ext.toLowerCase()}` : ""}`;
}

function safeFolder(folder: FormDataEntryValue | null) {
  if (typeof folder !== "string") return "admin";

  return (
    folder
      .toLowerCase()
      .replace(/[^a-z0-9/_-]+/g, "-")
      .replace(/\/+/g, "/")
      .replace(/^\/|\/$/g, "") || "admin"
  );
}

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    if (file.size > MAX_UPLOAD_BYTES) {
      return NextResponse.json(
        { error: "File must be 25 MB or smaller" },
        { status: 400 }
      );
    }

    const folder = safeFolder(formData.get("folder"));
    const key = `${folder}/${Date.now()}-${crypto.randomUUID()}-${slugFileName(
      file.name
    )}`;
    const uploaded = await uploadFileToS3({ file, key });

    return NextResponse.json(uploaded);
  } catch (error) {
    console.error("Admin upload error:", error);

    return NextResponse.json(
      {
        error: "Upload failed",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}
