import { NextResponse } from "next/server";
import { saveInquiry } from "@/lib/inquiries";
import type { PlatinumInquiry } from "@/types";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    name?: string;
    email?: string;
    company?: string;
    phone?: string;
    message?: string;
  };

  if (!body.name?.trim() || !body.email?.trim()) {
    return NextResponse.json({ error: "Name and email are required" }, { status: 400 });
  }

  const inquiry: PlatinumInquiry = {
    id: `PL-${Date.now().toString(36).toUpperCase()}`,
    createdAt: new Date().toISOString(),
    name: body.name.trim(),
    email: body.email.trim(),
    company: body.company?.trim() || undefined,
    phone: body.phone?.trim() || undefined,
    message: body.message?.trim() || undefined,
  };

  try {
    await saveInquiry(inquiry);
  } catch (error) {
    console.error("Failed to save platinum inquiry:", error);
    return NextResponse.json({ error: "Could not save your registration. Please try again." }, { status: 500 });
  }

  return NextResponse.json({ success: true, id: inquiry.id });
}
