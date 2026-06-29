import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const COOKIE_NAME = "cupvault_admin";

function signToken(password: string): string {
  const secret = process.env.ADMIN_SECRET ?? "cupvault-dev-secret";
  return createHmac("sha256", secret).update(password).digest("hex");
}

export function verifyAdminPassword(password: string): boolean {
  const expected = process.env.ADMIN_PASSWORD ?? "admin123";
  if (password.length !== expected.length) return false;
  try {
    return timingSafeEqual(Buffer.from(password), Buffer.from(expected));
  } catch {
    return false;
  }
}

export async function setAdminSession(): Promise<void> {
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  const token = signToken(password);
  const jar = await cookies();
  jar.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

export async function isAdminAuthenticated(): Promise<boolean> {
  const jar = await cookies();
  const token = jar.get(COOKIE_NAME)?.value;
  if (!token) return false;
  const password = process.env.ADMIN_PASSWORD ?? "admin123";
  return token === signToken(password);
}

export async function requireAdmin(): Promise<boolean> {
  return isAdminAuthenticated();
}
