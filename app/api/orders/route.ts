import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({
  type: z.enum(["DINE_IN", "TAKEAWAY", "DELIVERY"]).default("DINE_IN"),
  tableId: z.string().optional(), customerId: z.string().optional(), notes: z.string().max(500).optional(),
  discount: z.coerce.number().min(0).default(0),
  items: z.array(z.object({ menuItemId: z.string(), quantity: z.number().int().min(1).max(100), notes: z.string().max(200).optional() })).min(1)
});
export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const { searchParams } = new URL(request.url);
  const status = searchParams.get("status");
  const orders = await prisma.order.findMany({ where: { locationId: user.locationId, ...(status ? { status: status as never } : {}) }, include: { items: { include: { menuItem: true } }, customer: true, table: true }, orderBy: { createdAt: "desc" }, take: 100 });
  return NextResponse.json({ orders });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    if (input.tableId) { const table = await prisma.diningTable.findFirst({ where: { id: input.tableId, locationId: user.locationId } }); if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 }); }
    if (input.customerId) { const customer = await prisma.customer.findFirst({ where: { id: input.customerId, locationId: user.locationId } }); if (!customer) return NextResponse.json({ error: "Customer not found" }, { status: 404 }); }
    const ids = input.items.map(i => i.menuItemId);
    const menuItems = await prisma.menuItem.findMany({ where: { id: { in: ids }, isAvailable: true, category: { locationId: user.locationId } } });
    if (menuItems.length !== new Set(ids).size) return NextResponse.json({ error: "One or more menu items are unavailable" }, { status: 422 });
    const byId = new Map(menuItems.map(i => [i.id, i]));
    const subtotal = input.items.reduce((sum, i) => sum + Number(byId.get(i.menuItemId)!.price) * i.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const discount = Math.min(input.discount, subtotal + tax);
    const total = Math.max(0, subtotal + tax - discount);
    const order = await prisma.$transaction(async tx => {
      const latest = await tx.order.findFirst({ where: { locationId: user.locationId! }, orderBy: { orderNumber: "desc" }, select: { orderNumber: true } });
      return tx.order.create({ data: { orderNumber: (latest?.orderNumber ?? 0) + 1, type: input.type, notes: input.notes, subtotal, tax, discount, total, locationId: user.locationId!, tableId: input.tableId, customerId: input.customerId, items: { create: input.items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity, unitPrice: byId.get(i.menuItemId)!.price, notes: i.notes })) } }, include: { items: { include: { menuItem: true } } } });
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) { return handleError(error); }
}
