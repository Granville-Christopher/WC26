import "server-only";
import { readFile, writeFile, mkdir } from "fs/promises";
import path from "path";
import type { SavedOrder } from "@/types";
import { hasBlobStorage, listJsonBlobs, readJsonBlob, writeJsonBlob } from "@/lib/blob-storage";

const ORDERS_BLOB_PREFIX = "cupvault/orders/";
const ORDERS_LOCAL_PATH = path.join(process.cwd(), "data", "orders.json");

async function readLocalOrders(): Promise<SavedOrder[]> {
  try {
    const raw = await readFile(ORDERS_LOCAL_PATH, "utf-8");
    return JSON.parse(raw) as SavedOrder[];
  } catch {
    return [];
  }
}

async function writeLocalOrders(orders: SavedOrder[]): Promise<void> {
  await mkdir(path.dirname(ORDERS_LOCAL_PATH), { recursive: true });
  await writeFile(ORDERS_LOCAL_PATH, JSON.stringify(orders, null, 2), "utf-8");
}

export async function saveOrder(order: SavedOrder): Promise<void> {
  if (hasBlobStorage()) {
    await writeJsonBlob(`${ORDERS_BLOB_PREFIX}${order.orderRef}.json`, order);
    return;
  }

  const orders = await readLocalOrders();
  orders.unshift(order);
  await writeLocalOrders(orders);
}

export async function getOrderByRef(orderRef: string): Promise<SavedOrder | null> {
  if (hasBlobStorage()) {
    return readJsonBlob<SavedOrder>(`${ORDERS_BLOB_PREFIX}${orderRef}.json`);
  }

  const orders = await readLocalOrders();
  return orders.find((o) => o.orderRef === orderRef) ?? null;
}

export async function updateOrder(order: SavedOrder): Promise<void> {
  if (hasBlobStorage()) {
    await writeJsonBlob(`${ORDERS_BLOB_PREFIX}${order.orderRef}.json`, order);
    return;
  }

  const orders = await readLocalOrders();
  const index = orders.findIndex((o) => o.orderRef === order.orderRef);
  if (index >= 0) {
    orders[index] = order;
    await writeLocalOrders(orders);
  }
}

export async function listOrders(): Promise<SavedOrder[]> {
  if (hasBlobStorage()) {
    const orders = await listJsonBlobs<SavedOrder>(ORDERS_BLOB_PREFIX);
    return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  const orders = await readLocalOrders();
  return orders.sort((a, b) => b.createdAt.localeCompare(a.createdAt));
}
