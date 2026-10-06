import Link from "next/link";
import { listAlerts, listSubjects } from "@/lib/store";
import { SeverityBadge } from "@/components/SeverityBadge";

export const dynamic = "force-dynamic";

export default async function AlertsPage({
  searchParams,
}: {
  searchParams: Promise<{ severity?: string; status?: string }>;
}) {
  const sp = await searchParams;
  const subjects = listSubjects();
  const nameById = Object.fromEntries(subjects.map((s) => [s.id, s.name]));
  let alerts = listAlerts();
  if (sp.severity) alerts = alerts.filter((a) => a.severity === sp.severity);
  if (sp.status) alerts = alerts.filter((a) => a.status === sp.status);

  return (
    <div>
      <h1>Alert inbox</h1>
      <p className="muted">Filter by severity or status via query string, e.g. ?severity=high</p>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "1rem" }}>
        {["", "critical", "high", "medium", "low", "info"].map((s) => (
          <Link key={s || "all"} className="btn btn-ghost" href={s ? `/dashboard/alerts?severity=${s}` : "/dashboard/alerts"} style={{ padding: "0.35rem 0.8rem" }}>
            {s || "all"}
          </Link>
        ))}
      </div>
      <div className="card">
        <table className="table">
          <thead>
            <tr>
              <th>Severity</th>
              <th>Subject</th>
              <th>Title</th>
              <th>Status</th>
              <th>Source</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map((a) => (
              <tr key={a.id}>
                <td><SeverityBadge severity={a.severity} /></td>
                <td className="muted">{nameById[a.subjectId] ?? a.subjectId}</td>
                <td><Link href={`/dashboard/alerts/${a.id}`}>{a.title}</Link></td>
                <td>{a.status}</td>
                <td className="muted">{a.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
