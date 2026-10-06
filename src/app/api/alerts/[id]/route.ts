import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { getAlert, updateAlertStatus, getSubject } from "@/lib/store";
import type { AlertStatus } from "@/lib/types";

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const alert = getAlert(id);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  const subject = getSubject(alert.subjectId);
  return NextResponse.json({ alert, subject });
}

export async function PATCH(
  req: Request,
  ctx: { params: Promise<{ id: string }> }
) {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await req.json()) as { status?: AlertStatus };
  if (!body.status) {
    return NextResponse.json({ error: "status required" }, { status: 400 });
  }
  const alert = updateAlertStatus(id, body.status);
  if (!alert) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ alert });
}
