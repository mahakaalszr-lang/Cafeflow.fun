import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ name: z.string().min(2).max(100), phone: z.string().min(8).max(20).optional(), email: z.string().email().optional() });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const customers = await prisma.customer.findMany({ where: { orders: { some: { locationId: user.locationId } } }, include: { _count: { select: { orders: true } } }, orderBy: { createdAt: "desc" }, take: 200 });
  return NextResponse.json({ customers });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    const customer = await prisma.customer.create({ data: input });
    return NextResponse.json({ customer }, { status: 201 });
  } catch (error) { return handleError(error); }
}
