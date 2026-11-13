import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ name: z.string().min(2).max(100), unit: z.string().min(1).max(20), quantity: z.coerce.number().min(0), reorderLevel: z.coerce.number().min(0).default(0) });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.inventoryItem.findMany({ where: { locationId: user.locationId }, orderBy: { name: "asc" } });
  return NextResponse.json({ items, lowStock: items.filter(i => Number(i.quantity) <= Number(i.reorderLevel)).length });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    const item = await prisma.inventoryItem.create({ data: { ...input, locationId: user.locationId } });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) { return handleError(error); }
}
