import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ label: z.string().min(1).max(20), capacity: z.number().int().min(1).max(30) });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ tables: await prisma.diningTable.findMany({ where: { locationId: user.locationId }, include: { orders: { where: { status: { in: ["PENDING","CONFIRMED","PREPARING","READY"] } }, select: { id: true, status: true } } }, orderBy: { label: "asc" } }) });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    const table = await prisma.diningTable.create({ data: { ...input, locationId: user.locationId } });
    return NextResponse.json({ table }, { status: 201 });
  } catch (error) { return handleError(error); }
}
