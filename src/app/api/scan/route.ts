import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { scanSubject, scanAll } from "@/lib/scan";

export const maxDuration = 60;

export async function POST(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = (await req.json().catch(() => ({}))) as { subjectId?: string };
  try {
    if (body.subjectId) {
      const result = await scanSubject(body.subjectId);
      return NextResponse.json({ result });
    }
    const results = await scanAll();
    return NextResponse.json({ results });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : String(e) },
      { status: 500 }
    );
  }
}
