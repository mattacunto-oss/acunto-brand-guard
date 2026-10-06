import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listAlerts } from "@/lib/store";
import type { AlertStatus, Severity } from "@/lib/types";

export async function GET(req: Request) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(req.url);
  const subjectId = searchParams.get("subjectId") ?? undefined;
  const severity = (searchParams.get("severity") as Severity | null) ?? undefined;
  const status = (searchParams.get("status") as AlertStatus | null) ?? undefined;
  return NextResponse.json({
    alerts: listAlerts({ subjectId, severity, status }),
  });
}
