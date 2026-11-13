import { NextResponse } from "next/server";
import Razorpay from "razorpay";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { handleError } from "@/lib/http";
const schema = z.object({ orderId: z.string() });
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser();
    if (!user?.locationId) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) return NextResponse.json({ error: "Payment gateway is not configured" }, { status: 503 });
    const { orderId } = schema.parse(await request.json());
    const order = await prisma.order.findFirst({ where: { id: orderId, locationId: user.locationId, paymentStatus: "UNPAID" } });
    if (!order) return NextResponse.json({ error: "Unpaid order not found" }, { status: 404 });
    const razorpay = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
    const paymentOrder = await razorpay.orders.create({ amount: Math.round(Number(order.total) * 100), currency: "INR", receipt: order.id });
    return NextResponse.json({ paymentOrder, keyId: process.env.RAZORPAY_KEY_ID });
  } catch (error) { return handleError(error); }
}
