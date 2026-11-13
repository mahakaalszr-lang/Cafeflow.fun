import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const url = new URL(request.url);
  const days = Math.min(90, Math.max(1, Number(url.searchParams.get("days") || 7)));
  const from = new Date(); from.setDate(from.getDate() - days);
  const [orders, products, payments] = await Promise.all([
    prisma.order.findMany({ where: { locationId: user.locationId, createdAt: { gte: from } }, select: { total: true, status: true, paymentStatus: true, createdAt: true } }),
    prisma.orderItem.groupBy({ by: ["menuItemId"], where: { order: { locationId: user.locationId, createdAt: { gte: from } } }, _sum: { quantity: true }, orderBy: { _sum: { quantity: "desc" } }, take: 10 }),
    prisma.order.aggregate({ where: { locationId: user.locationId, createdAt: { gte: from }, paymentStatus: "PAID" }, _sum: { total: true } })
  ]);
  const ids = products.map(p => p.menuItemId);
  const names = await prisma.menuItem.findMany({ where: { id: { in: ids } }, select: { id: true, name: true } });
  return NextResponse.json({ days, totalOrders: orders.length, paidRevenue: Number(payments._sum.total ?? 0), ordersByStatus: orders.reduce((a, o) => ({ ...a, [o.status]: (a[o.status] || 0) + 1 }), {} as Record<string, number>), daily: orders.reduce((a, o) => { const day = o.createdAt.toISOString().slice(0,10); a[day] = (a[day] || 0) + Number(o.total); return a; }, {} as Record<string, number>), topItems: products.map(p => ({ name: names.find(n => n.id === p.menuItemId)?.name || "Menu item", quantity: p._sum.quantity || 0 })) });
}
