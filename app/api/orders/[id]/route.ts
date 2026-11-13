import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ status: z.enum(["PENDING","CONFIRMED","PREPARING","READY","COMPLETED","CANCELLED"]).optional(), paymentStatus: z.enum(["UNPAID","PAID","PARTIALLY_REFUNDED","REFUNDED"]).optional() }).refine(v => v.status || v.paymentStatus);
export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const input = schema.parse(await request.json());
    const existing = await prisma.order.findFirst({ where: { id: params.id, locationId: user.locationId } });
    if (!existing) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const order = await prisma.order.update({ where: { id: params.id }, data: input });
    return NextResponse.json({ order });
  } catch (error) { return handleError(error); }
}
