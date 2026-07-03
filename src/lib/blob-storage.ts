import "server-only";
import { get, list, put } from "@vercel/blob";

const STORE_BLOB_PATH = "cupvault/store.json";

export function hasBlobStorage(): boolean {
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN?.trim() || process.env.VERCEL_OIDC_TOKEN?.trim());
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

export async function uploadPublicImage(
  pathname: string,
  body: Buffer | ArrayBuffer,
  contentType: string
): Promise<string> {
  const blob = await put(pathname, body, {
    access: "public",
    contentType,
    addRandomSuffix: false,
    allowOverwrite: true,
  });
  return blob.url;
}

export async function uploadPublicFile(
  pathname: string,
  body: Buffer | ArrayBuffer,
  contentType: string
): Promise<string> {
  return uploadPublicImage(pathname, body, contentType);
}

export { STORE_BLOB_PATH };
