import { NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { createSession } from "@/lib/auth";
import { handleError } from "@/lib/http";

const schema = z.object({ name: z.string().min(2).max(80), email: z.string().email(), password: z.string().min(8).max(100), storeName: z.string().min(2).max(100) });
export async function POST(request: Request) {
  try {
    const input = schema.parse(await request.json());
    const email = input.email.toLowerCase();
    if (await prisma.user.findUnique({ where: { email } })) return NextResponse.json({ error: "An account with this email already exists" }, { status: 409 });
    const passwordHash = await hash(input.password, 12);
    const result = await prisma.$transaction(async tx => {
      const location = await tx.location.create({ data: { name: input.storeName } });
      const user = await tx.user.create({ data: { name: input.name, email, passwordHash, role: "OWNER", locationId: location.id }, select: { id: true, name: true, email: true, role: true } });
      return { user, location };
    });
    await createSession(result.user.id);
    return NextResponse.json({ user: result.user, location: { id: result.location.id, name: result.location.name } }, { status: 201 });
  } catch (error) { return handleError(error); }
}
