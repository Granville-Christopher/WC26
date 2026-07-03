import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getOrderByRef, updateOrder } from "@/lib/orders";
import { hasBlobStorage, uploadBlobFile } from "@/lib/blob-storage";

const MAX_BYTES = 10 * 1024 * 1024;
const ALLOWED_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
  "application/pdf",
]);

export async function POST(request: Request) {
  const form = await request.formData();
  const orderRef = form.get("orderRef");
  const file = form.get("file");

  if (typeof orderRef !== "string" || !orderRef.trim()) {
    return NextResponse.json({ error: "Missing order reference" }, { status: 400 });
  }

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "Missing proof file" }, { status: 400 });
  }

  if (!ALLOWED_TYPES.has(file.type)) {
    return NextResponse.json(
      { error: "File must be an image (JPG, PNG, WebP, GIF) or PDF" },
      { status: 400 }
    );
  }

  if (file.size > MAX_BYTES) {
    return NextResponse.json({ error: "File must be 10 MB or smaller" }, { status: 400 });
  }

  const order = await getOrderByRef(orderRef.trim());
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "bin";
  const safeRef = orderRef.replace(/[^a-zA-Z0-9_-]/g, "");
  const buffer = Buffer.from(await file.arrayBuffer());

  let url: string;
  try {
    if (hasBlobStorage()) {
      url = await uploadBlobFile(`payment-proofs/${safeRef}.${ext}`, buffer, file.type);
    } else {
      const filename = `${safeRef}.${ext}`;
      const dir = path.join(process.cwd(), "public", "payment-proofs");
      await mkdir(dir, { recursive: true });
      await writeFile(path.join(dir, filename), buffer);
      url = `/payment-proofs/${filename}`;
    }
  } catch (error) {
    console.error("Proof upload failed:", error);
    return NextResponse.json({ error: "Could not upload proof of payment" }, { status: 500 });
  }

  const updated = {
    ...order,
    proofOfPayment: {
      url,
      filename: file.name,
      contentType: file.type,
      uploadedAt: new Date().toISOString(),
    },
  };

  try {
    await updateOrder(updated);
  } catch (error) {
    console.error("Failed to attach proof to order:", error);
    return NextResponse.json({ error: "Proof uploaded but order could not be updated" }, { status: 500 });
  }

  return NextResponse.json({ success: true, proof: updated.proofOfPayment });
}
