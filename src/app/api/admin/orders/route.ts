import { NextResponse } from "next/server";
import { requireAdmin } from "@/lib/auth";
import { listOrders } from "@/lib/orders";
import { listInquiries } from "@/lib/inquiries";

export async function GET() {
  if (!(await requireAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const [orders, inquiries] = await Promise.all([listOrders(), listInquiries()]);
  return NextResponse.json({ orders, inquiries });
}
