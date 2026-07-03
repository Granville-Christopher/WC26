import "server-only";
import { get, list, put } from "@vercel/blob";

const STORE_BLOB_PATH = "cupvault/store.json";

/**
 * A Blob store's access mode (public/private) is fixed when the store is
 * created and cannot be mixed. Set BLOB_ACCESS to match the store you linked
 * in Vercel. Defaults to "public".
 *   - public:  files are served via their direct Blob URL (no proxy).
 *   - private: files are streamed through our /api/blob proxy route.
 */
function blobAccess(): "public" | "private" {
  return process.env.BLOB_ACCESS?.trim() === "private" ? "private" : "public";
}

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim());
}

export async function readJsonBlob<T>(pathname: string): Promise<T | null> {
  if (!hasBlobStorage()) return null;

  const result = await get(pathname, { access: blobAccess() });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  const text = await new Response(result.stream).text();
  return JSON.parse(text) as T;
}

export async function writeJsonBlob(pathname: string, data: unknown): Promise<void> {
  await put(pathname, JSON.stringify(data, null, 2), {
    access: blobAccess(),
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
 * Uploads a file (image/PDF) to the Blob store. For public stores it returns
 * the direct Blob URL; for private stores it returns a proxy URL served by our
 * /api/blob route.
 */
export async function uploadBlobFile(
  pathname: string,
  body: Buffer | ArrayBuffer,
  contentType: string
): Promise<string> {
  const blob = await put(pathname, body, {
    access: blobAccess(),
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });

  return blobAccess() === "public" ? blob.url : `/api/blob/${pathname}`;
}

/** Streams a blob's contents. Returns null if not found. */
export async function readBlobStream(
  pathname: string
): Promise<{ stream: ReadableStream; contentType: string } | null> {
  if (!hasBlobStorage()) return null;

  const result = await get(pathname, { access: blobAccess() });
  if (!result || result.statusCode !== 200 || !result.stream) return null;

  return {
    stream: result.stream,
    contentType: result.blob?.contentType ?? "application/octet-stream",
  };
}

export { STORE_BLOB_PATH };
