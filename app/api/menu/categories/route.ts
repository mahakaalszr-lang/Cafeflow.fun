import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ name: z.string().min(2).max(60) });
export async function GET() {
  const user = await getCurrentUser();
  if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ categories: await prisma.category.findMany({ where: { locationId: user.locationId }, orderBy: { sortOrder: "asc" } }) });
}
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { name } = schema.parse(await request.json());
    const category = await prisma.category.create({ data: { name, locationId: user.locationId } });
    return NextResponse.json({ category }, { status: 201 });
  } catch (error) { return handleError(error); }
}
