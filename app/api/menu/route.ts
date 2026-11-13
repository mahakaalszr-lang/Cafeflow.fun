import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";

const schema = z.object({ name: z.string().min(2).max(100), description: z.string().max(500).optional(), price: z.coerce.number().positive(), categoryId: z.string().min(1), isAvailable: z.boolean().optional() });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const items = await prisma.menuItem.findMany({ where: { category: { locationId: user.locationId } }, include: { category: true }, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ items });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    const category = await prisma.category.findFirst({ where: { id: input.categoryId, locationId: user.locationId } });
    if (!category) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    const item = await prisma.menuItem.create({ data: { ...input, price: input.price } });
    return NextResponse.json({ item }, { status: 201 });
  } catch (error) { return handleError(error); }
}
