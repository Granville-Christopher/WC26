import { NextResponse } from "next/server";
import { verifyAdminPassword, setAdminSession, clearAdminSession } from "@/lib/auth";

export async function POST(request: Request) {
  const body = (await request.json()) as { password?: string; action?: string };

  if (body.action === "logout") {
    await clearAdminSession();
    return NextResponse.json({ success: true });
  }

  if (!body.password || !verifyAdminPassword(body.password)) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }

  await setAdminSession();
  return NextResponse.json({ success: true });
}
