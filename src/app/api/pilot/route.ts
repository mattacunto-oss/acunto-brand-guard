import { NextResponse } from "next/server";

/** Pilot signup stub — stores nothing sensitive; logs to response for MVP. */
export async function POST(req: Request) {
  const body = (await req.json()) as {
    name?: string;
    email?: string;
    org?: string;
    tier?: string;
    message?: string;
  };
  if (!body.email || !body.name) {
    return NextResponse.json({ error: "Name and email required" }, { status: 400 });
  }
  // In production: write to CRM / Resend / Sheet. MVP acknowledges only.
  return NextResponse.json({
    ok: true,
    message:
      "Thanks — pilot request received. Matthew will follow up. (MVP stub; wire Resend/CRM next.)",
    received: {
      name: body.name,
      email: body.email,
      org: body.org ?? "",
      tier: body.tier ?? "NIL",
    },
  });
}
