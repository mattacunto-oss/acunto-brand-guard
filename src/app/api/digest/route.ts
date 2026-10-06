import { NextResponse } from "next/server";
import { isAuthenticated } from "@/lib/auth";
import { listAlerts, listSubjects } from "@/lib/store";

export async function GET() {
  if (!(await isAuthenticated())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const subjects = listSubjects();
  const alerts = listAlerts();
  const weekAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
  const recent = alerts.filter((a) => new Date(a.createdAt).getTime() >= weekAgo);
  const bySeverity = {
    critical: recent.filter((a) => a.severity === "critical").length,
    high: recent.filter((a) => a.severity === "high").length,
    medium: recent.filter((a) => a.severity === "medium").length,
    low: recent.filter((a) => a.severity === "low").length,
    info: recent.filter((a) => a.severity === "info").length,
  };
  const open = alerts.filter((a) => a.status === "new" || a.status === "reviewing");
  const closed = alerts.filter((a) => a.status === "closed" || a.status === "actioned");

  const lines = [
    `# Weekly Digest — Harbor Shield`,
    ``,
    `Period: last 7 days · Generated ${new Date().toLocaleString("en-US", { timeZone: "America/New_York" })} ET`,
    ``,
    `## Snapshot`,
    `- Watchlists: ${subjects.length}`,
    `- Alerts this week: ${recent.length}`,
    `- Open / in review: ${open.length}`,
    `- Actioned / closed: ${closed.length}`,
    ``,
    `## Severity mix (7d)`,
    `- Critical: ${bySeverity.critical}`,
    `- High: ${bySeverity.high}`,
    `- Medium: ${bySeverity.medium}`,
    `- Low: ${bySeverity.low}`,
    `- Info: ${bySeverity.info}`,
    ``,
    `## Top open items`,
    ...open.slice(0, 8).map(
      (a) =>
        `- [${a.severity.toUpperCase()}] ${a.title} (${a.source}) — ${a.url}`
    ),
    ``,
    `## Notes`,
    `- Monitoring covers publicly available information and subscriber-provided keywords only.`,
    `- For NIL subjects who may be minors: parent/guardian or authorized agent required.`,
    `- Recommended next steps are educational, not legal advice.`,
    `- We do not erase records or remove lawful content outside legitimate channels.`,
  ];

  return NextResponse.json({
    markdown: lines.join("\n"),
    stats: { subjects: subjects.length, recent: recent.length, open: open.length, bySeverity },
  });
}
