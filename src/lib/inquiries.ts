import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { PlatinumInquiry } from "@/types";
import { hasBlobStorage, listJsonBlobs, writeJsonBlob } from "@/lib/blob-storage";

const INQUIRIES_BLOB_PREFIX = "cupvault/inquiries/";
const INQUIRIES_LOCAL_PATH = path.join(process.cwd(), "data", "inquiries.json");

async function readLocalInquiries(): Promise<PlatinumInquiry[]> {
  try {
    const raw = await readFile(INQUIRIES_LOCAL_PATH, "utf-8");
    return JSON.parse(raw) as PlatinumInquiry[];
  } catch {
    return [];
  }
}

async function writeLocalInquiries(inquiries: PlatinumInquiry[]): Promise<void> {
  await mkdir(path.dirname(INQUIRIES_LOCAL_PATH), { recursive: true });
  await writeFile(INQUIRIES_LOCAL_PATH, JSON.stringify(inquiries, null, 2), "utf-8");
}

export async function saveInquiry(inquiry: PlatinumInquiry): Promise<void> {
  if (hasBlobStorage()) {
    await writeJsonBlob(`${INQUIRIES_BLOB_PREFIX}${inquiry.id}.json`, inquiry);
    return;
  }

  const inquiries = await readLocalInquiries();
  inquiries.unshift(inquiry);
  await writeLocalInquiries(inquiries);
}

export async function listInquiries(): Promise<PlatinumInquiry[]> {
  if (hasBlobStorage()) {
    const inquiries = await listJsonBlobs<PlatinumInquiry>(INQUIRIES_BLOB_PREFIX);
    return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const inquiries = await readLocalInquiries();
  return inquiries.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
