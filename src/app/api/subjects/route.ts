import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { createSubject, listSubjects } from "@/lib/store";
import type { Tier } from "@/lib/types";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ subjects: listSubjects() });
}

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json()) as {
    name?: string;
    aliases?: string;
    handles?: string;
    domains?: string;
    emails?: string;
    keywords?: string;
    notes?: string;
    tier?: Tier;
  };
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name required" }, { status: 400 });
  }
  const split = (s?: string) =>
    (s ?? "")
      .split(/[,;\n]/)
      .map((x) => x.trim())
      .filter(Boolean);

  const subject = createSubject({
    name: body.name,
    aliases: split(body.aliases),
    handles: split(body.handles),
    domains: split(body.domains),
    emails: split(body.emails),
    keywords: split(body.keywords),
    notes: body.notes,
    tier: body.tier ?? "NIL",
  });
  return NextResponse.json({ subject }, { status: 201 });
}
