import "server-only";
import { get, list, put } from "@vercel/blob";

const STORE_BLOB_PATH = "cupvault/store.json";

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!hasBlobStorage()) return null;

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: "private",
    contentType: "application/json",
    addRandomSuffix: false,
    allowOverwrite: true,
  });
}

export async function listJsonBlobs<T>(prefix: string): Promise<T[]> {
  if (!hasBlobStorage()) return [];

  const { blobs } = await list({ prefix });
  const items: T[] = [];
  for (const blob of blobs) {
    const item = await readJsonBlob<T>(blob.pathname);
    if (item) items.push(item);
  }
  return items;
}

/**
 * Uploads a file (image/PDF) to the private Blob store and returns a relative
 * proxy URL that streams it back through our own API route. We use private
 * access everywhere because a Blob store's access mode is fixed at creation —
 * mixing public and private on one store is not possible.
 */
export async function uploadBlobFile(
  pathname: string,
  body: Buffer | ArrayBuffer,
  contentType: string
): Promise<string> {
  await put(pathname, body, {
    access: "private",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return `/api/blob/${pathname}`;
}

/** Streams a private blob's contents. Returns null if not found. */
export async function readBlobStream(
  pathname: string
): Promise<{ stream: ReadableStream; contentType: string } | null> {
  if (!hasBlobStorage()) return null;

  const result = await get(pathname, { access: "private" });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  return {
    stream: result.stream,
    contentType: result.blob?.contentType ?? "application/octet-stream",
  };
}

export { STORE_BLOB_PATH };
