import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getSourceStatuses } from "@/lib/sources-status";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ sources: getSourceStatuses() });
}
