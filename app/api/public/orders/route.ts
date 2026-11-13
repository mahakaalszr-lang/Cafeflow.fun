import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { handleError } from "@/lib/http";
const schema = z.object({ qrCode: z.string().uuid(), customerName: z.string().min(2).max(80).optional(), items: z.array(z.object({ menuItemId: z.string(), quantity: z.number().int().min(1).max(20) })).min(1).max(30), notes: z.string().max(300).optional() });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const table = await prisma.diningTable.findUnique({ where: { qrCode: input.qrCode }, include: { location: true } });
    if (!table) return NextResponse.json({ error: "Invalid table QR code" }, { status: 404 });
    const ids = input.items.map(i => i.menuItemId);
    const menu = await prisma.menuItem.findMany({ where: { id: { in: ids }, isAvailable: true, category: { locationId: table.locationId } } });
    if (menu.length !== new Set(ids).size) return NextResponse.json({ error: "Some menu items are unavailable" }, { status: 422 });
    const map = new Map(menu.map(m => [m.id, m]));
    const subtotal = input.items.reduce((sum, i) => sum + Number(map.get(i.menuItemId)!.price) * i.quantity, 0);
    const tax = Math.round(subtotal * 0.05 * 100) / 100;
    const order = await prisma.$transaction(async tx => {
      const latest = await tx.order.findFirst({ where: { locationId: table.locationId }, orderBy: { orderNumber: "desc" }, select: { orderNumber: true } });
      let customerId: string | undefined;
      if (input.customerName) {
        const customer = await tx.customer.create({ data: { name: input.customerName, locationId: table.locationId } });
        customerId = customer.id;
      }
      return tx.order.create({ data: { orderNumber: (latest?.orderNumber ?? 0) + 1, locationId: table.locationId, tableId: table.id, customerId, type: "DINE_IN", subtotal, tax, total: subtotal + tax, notes: input.notes, items: { create: input.items.map(i => ({ menuItemId: i.menuItemId, quantity: i.quantity, unitPrice: map.get(i.menuItemId)!.price })) } }, select: { id: true, orderNumber: true, status: true, total: true } });
    });
    return NextResponse.json({ order }, { status: 201 });
  } catch (error) { return handleError(error); }
}
