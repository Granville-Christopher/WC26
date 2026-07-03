import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { requireAdmin } from "@/lib/auth";
import { hasBlobStorage, uploadBlobFile } from "@/lib/blob-storage";

export async function POST(request: Request) {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const methodId = form.get("methodId");

  if (!(file instanceof File) || typeof methodId !== "string" || !methodId.trim()) {
    return NextResponse.json({ error: "Missing file or methodId" }, { status: 400 });
  }

  if (!file.type.startsWith("image/")) {
    return NextResponse.json({ error: "File must be an image" }, { status: 400 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "png";
  const safeId = methodId.replace(/[^a-z0-9_-]/gi, "");
  const buffer = Buffer.from(await file.arrayBuffer());

  if (hasBlobStorage()) {
    try {
      const url = await uploadBlobFile(`payment-qr/${safeId}.${ext}`, buffer, file.type);
      return NextResponse.json({ url });
    } catch (error) {
      const message = error instanceof Error ? error.message : "Blob upload failed";
      return NextResponse.json({ error: message }, { status: 500 });
    }
  }

  try {
    const filename = `${safeId}.${ext}`;
    const dir = path.join(process.cwd(), "public", "payment-qr");
    await mkdir(dir, { recursive: true });
    await writeFile(path.join(dir, filename), buffer);
    return NextResponse.json({ url: `/payment-qr/${filename}` });
  } catch {
    return NextResponse.json(
      {
        error:
          "Image storage is not configured. On Vercel, link a Blob store (Storage → Blob) so BLOB_READ_WRITE_TOKEN is set, then try again. Alternatively, paste an image URL in the QR field.",
      },
      { status: 500 }
    );
  }
}
