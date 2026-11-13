import { NextResponse } from "next/server";
export async function GET() {
  return NextResponse.json({ ok: true, service: "cafeflow", timestamp: new Date().toISOString(), databaseConfigured: Boolean(process.env.DATABASE_URL) });
}
