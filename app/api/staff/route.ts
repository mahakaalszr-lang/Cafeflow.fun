import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(8), role: z.enum(["MANAGER","CASHIER","KITCHEN","STAFF"]) });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId || !["OWNER","MANAGER"].includes(user.role)) return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  return NextResponse.json({ staff: await prisma.user.findMany({ where: { locationId: user.locationId }, select: { id: true, name: true, email: true, role: true, createdAt: true }, orderBy: { createdAt: "desc" } }) });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId || user.role !== "OWNER") return NextResponse.json({ error: "Only owners can add staff" }, { status: 403 });
    const input = schema.parse(await request.json());
    const staff = await prisma.user.create({ data: { ...input, email: input.email.toLowerCase(), passwordHash: await hash(input.password, 12), locationId: user.locationId }, select: { id: true, name: true, email: true, role: true } });
    return NextResponse.json({ staff }, { status: 201 });
  } catch (error) { return handleError(error); }
}
