import { NextResponse } from "next/server";
import { createHmac, timingSafeEqual } from "crypto";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ orderId: z.string(), razorpay_order_id: z.string(), razorpay_payment_id: z.string(), razorpay_signature: z.string() });
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 503 });
    const input = schema.parse(await request.json());
    const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET).update(input.razorpay_order_id + "|" + input.razorpay_payment_id).digest("hex");
    const a = Buffer.from(expected); const b = Buffer.from(input.razorpay_signature);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    const order = await prisma.order.findFirst({ where: { id: input.orderId, locationId: user.locationId } });
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });
    const updated = await prisma.order.update({ where: { id: order.id }, data: { paymentStatus: "PAID" } });
    return NextResponse.json({ order: updated });
  } catch (error) { return handleError(error); }
}
