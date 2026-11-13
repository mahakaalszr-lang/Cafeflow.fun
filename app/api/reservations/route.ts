import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ guestName: z.string().min(2).max(100), phone: z.string().max(20).optional(), partySize: z.number().int().min(1).max(30), startsAt: z.string().datetime(), tableId: z.string().optional(), notes: z.string().max(500).optional() });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const reservations = await prisma.reservation.findMany({ where: { table: { locationId: user.locationId } }, include: { table: true }, orderBy: { startsAt: "asc" }, take: 100 });
  return NextResponse.json({ reservations });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    if (input.tableId) {
      const table = await prisma.diningTable.findFirst({ where: { id: input.tableId, locationId: user.locationId } });
      if (!table) return NextResponse.json({ error: "Table not found" }, { status: 404 });
    }
    const reservation = await prisma.reservation.create({ data: { ...input, startsAt: new Date(input.startsAt) } });
    return NextResponse.json({ reservation }, { status: 201 });
  } catch (error) { return handleError(error); }
}
