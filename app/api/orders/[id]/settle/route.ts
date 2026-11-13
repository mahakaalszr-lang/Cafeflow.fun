import { NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ method: z.enum(["CASH","CARD","UPI"]) });
export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    const { method } = schema.parse(await request.json());
    const order = await prisma.order.findFirst({ where: { id: params.id, locationId: user.locationId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    if (order.paymentStatus === "PAID") return NextResponse.json({ error: "Order is already paid" }, { status: 409 });
    await prisma.$transaction([
      prisma.payment.create({ data: { orderId: order.id, provider: method, amount: order.total, currency: "INR", status: "CAPTURED" } }),
      prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "PAID" } })
    ]);
    return NextResponse.json({ ok: true, orderId: order.id, paymentStatus: "PAID" });
  } catch (error) { return handleError(error); }
}
