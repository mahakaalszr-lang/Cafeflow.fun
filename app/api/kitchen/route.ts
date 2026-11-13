import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId || !["OWNER","MANAGER","KITCHEN","STAFF"].includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  const orders = await prisma.order.findMany({ where: { locationId: user.locationId, status: { in: ["PENDING","CONFIRMED","PREPARING","READY"] } }, include: { items: { include: { menuItem: true } }, table: true }, orderBy: { createdAt: "asc" }, take: 100 });
  return NextResponse.json({ orders, refreshedAt: new Date().toISOString() });
}
