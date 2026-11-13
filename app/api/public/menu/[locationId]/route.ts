import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
export async function GET(_: Request, { params }: { params: { locationId: string } }) {
  const location = await prisma.location.findUnique({ where: { id: params.locationId }, select: { id: true, name: true, currency: true } });
  if (!location) return NextResponse.json({ error: "Menu not found" }, { status: 404 });
  const categories = await prisma.category.findMany({ where: { locationId: location.id }, include: { items: { where: { isAvailable: true }, select: { id: true, name: true, description: true, price: true } } }, orderBy: { sortOrder: "asc" } });
  return NextResponse.json({ location, categories });
}
