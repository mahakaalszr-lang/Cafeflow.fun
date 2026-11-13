import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const since = new Date(); since.setDate(since.getDate() - 7);
  const [orders, revenue, pending, customers, stock] = await Promise.all([
    prisma.order.count({ where: { locationId: user.locationId, createdAt: { gte: since } } }),
    prisma.order.aggregate({ where: { locationId: user.locationId, paymentStatus: "PAID", createdAt: { gte: since } }, _sum: { total: true } }),
    prisma.order.count({ where: { locationId: user.locationId, status: { in: ["PENDING","CONFIRMED","PREPARING","READY"] } } }),
    prisma.customer.count({ where: { locationId: user.locationId } }),
    prisma.inventoryItem.findMany({ where: { locationId: user.locationId }, select: { quantity: true, reorderLevel: true } })
  ]);
  return NextResponse.json({ orders, revenue: Number(revenue._sum.total ?? 0), pending, customers, lowStock: stock.filter(i => Number(i.quantity) <= Number(i.reorderLevel)).length });
}
