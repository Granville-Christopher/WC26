import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { StoreData } from "@/types";

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

export async function readStore(): Promise<StoreData> {
  try {
    const raw = await readFile(STORE_PATH, "utf-8");
    return applyEnvOverrides(JSON.parse(raw) as StoreData);
  } catch {
    const fallback: StoreData = {
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
    return applyEnvOverrides(fallback);
  }
}

export async function writeStore(data: StoreData): Promise<void> {
  await mkdir(path.dirname(STORE_PATH), { recursive: true });
  await writeFile(STORE_PATH, JSON.stringify(data, null, 2), "utf-8");
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
