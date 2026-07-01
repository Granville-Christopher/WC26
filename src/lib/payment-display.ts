import type { PaymentMethod } from "@/types";

export function getPaymentQrUrl(method: PaymentMethod): string | null {
  if (method.details.qrCodeUrl?.trim()) {
    return method.details.qrCodeUrl.trim();
  }
  const wallet = method.details.walletAddress?.trim();
  if (wallet && (method.id === "crypto" || method.details.network)) {
    return `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${encodeURIComponent(wallet)}`;
  }
  return null;
}

export function isCryptoMethod(method: PaymentMethod): boolean {
  return method.id === "crypto" || Boolean(method.details.walletAddress?.trim());
}

export function isBankMethod(method: PaymentMethod): boolean {
  return method.id === "bank_transfer" || Boolean(method.details.bankName?.trim());
}
