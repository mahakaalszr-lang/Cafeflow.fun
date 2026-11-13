import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ quantityDelta: z.coerce.number().refine(n => n !== 0), reason: z.string().min(2).max(120) });
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    const item = await prisma.inventoryItem.findFirst({ where: { id: params.id, locationId: user.locationId } });
    if (!item) return NextResponse.json({ error: "Inventory item not found" }, { status: 404 });
    if (Number(item.quantity) + input.quantityDelta < 0) return NextResponse.json({ error: "Stock cannot become negative" }, { status: 422 });
    const updated = await prisma.$transaction(async tx => {
      await tx.stockMovement.create({ data: { inventoryItemId: item.id, quantityDelta: input.quantityDelta, reason: input.reason } });
      return tx.inventoryItem.update({ where: { id: item.id }, data: { quantity: { increment: input.quantityDelta } } });
    });
    return NextResponse.json({ item: updated });
  } catch (error) { return handleError(error); }
}
