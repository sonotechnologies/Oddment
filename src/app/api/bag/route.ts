import { NextResponse } from "next/server";

import { bagSchema } from "@/lib/bag";
import { resolveBag } from "@/lib/bagPricing";

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const parsed = bagSchema.safeParse(body);

  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid bag" }, { status: 400 });
  }

  return NextResponse.json(await resolveBag(parsed.data));
}
