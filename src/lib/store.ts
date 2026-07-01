import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { StoreData } from "@/types";
import {
  STORE_BLOB_PATH,
  hasBlobStorage,
  readJsonBlob,
  writeJsonBlob,
} from "@/lib/blob-storage";

const STORE_PATH = path.join(process.cwd(), "data", "store.json");

function applyEnvOverrides(store: StoreData): StoreData {
  const adminEmail = process.env.ADMIN_EMAIL?.trim();
  if (!adminEmail) return store;

  const methods = store.payment.methods.map((method) => {
    if (method.id !== "paypal") return method;
    return {
      ...method,
      details: { ...method.details, email: adminEmail },
    };
  });

  return {
    ...store,
    payment: {
      ...store.payment,
      supportEmail: adminEmail,
      methods,
    },
  };
}

function emptyStore(): StoreData {
  return {
    payment: {
      currency: "USD",
      supportEmail: process.env.ADMIN_EMAIL ?? "support@cupvault.com",
      checkoutNote: "",
      methods: [],
    },
    tierPrices: { default: {}, byMatchSlug: {} },
    tierStock: { default: {}, byMatchSlug: {} },
    lastFixtureSync: null,
  };
}

async function readStoreFromLocal(): Promise<StoreData | null> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return JSON.parse(raw) as StoreData;
  } catch {
    return null;
  }
}

async function writeStoreToLocal(data: StoreData): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
}

async function seedBlobFromLocal(): Promise<StoreData | null> {
  const local = await readStoreFromLocal();
  if (!local || !hasBlobStorage()) return local;

  try {
    await writeJsonBlob(STORE_BLOB_PATH, local);
  } catch {
    // Blob may not be configured yet in local dev.
  }

  return local;
}

export async function readStore(): Promise<StoreData> {
  if (hasBlobStorage()) {
    const blobStore = await readJsonBlob<StoreData>(STORE_BLOB_PATH);
    if (blobStore) return applyEnvOverrides(blobStore);

    const seeded = await seedBlobFromLocal();
    if (seeded) return applyEnvOverrides(seeded);

    return applyEnvOverrides(emptyStore());
  }

  const local = await readStoreFromLocal();
  return applyEnvOverrides(local ?? emptyStore());
}

export async function writeStore(data: StoreData): Promise<void> {
  if (hasBlobStorage()) {
    await writeJsonBlob(STORE_BLOB_PATH, data);
    return;
  }

  await writeStoreToLocal(data);
}

export function getTierPrice(
  store: StoreData,
  slug: string,
  tierId: string,
  dynamicPrice: number
): number {
  return store.tierPrices.byMatchSlug[slug]?.[tierId] ?? dynamicPrice;
}

export function getTierStock(store: StoreData, slug: string, tierId: string, fallback: number): number {
  return (
    store.tierStock.byMatchSlug[slug]?.[tierId] ??
    store.tierStock.default[tierId] ??
    fallback
  );
}
