import { NextResponse } from "next/server";
import { ZodError } from "zod";

export function jsonError(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}
export function handleError(error: unknown) {
  if (error instanceof ZodError) return NextResponse.json({ error: "Validation failed", issues: error.flatten() }, { status: 422 });
  console.error(error);
  return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
}
