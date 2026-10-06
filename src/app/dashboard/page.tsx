import Link from "next/link";
import { listAlerts, listSubjects } from "@/lib/store";
import { SeverityBadge } from "@/components/SeverityBadge";
import { RunScanButton } from "@/components/RunScanButton";

export const dynamic = "force-dynamic";

export default function DashboardPage() {
  const subjects = listSubjects();
  const alerts = listAlerts();
  const open = alerts.filter((a) => a.status === "new" || a.status === "reviewing");
  const critical = alerts.filter((a) => a.severity === "critical" || a.severity === "high");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", marginBottom: "1.25rem" }}>
        <div>
          <h1 style={{ margin: 0 }}>Overview</h1>
          <p className="muted" style={{ marginTop: "0.35rem" }}>
            Seeded fictional subjects + live public scans. No secrets in client code.
          </p>
        </div>
        <RunScanButton />
      </div>

      <div className="grid-3" style={{ marginBottom: "1.25rem" }}>
        <div className="card"><div className="muted">Watchlists</div><div style={{ fontSize: "2rem", fontWeight: 800 }}>{subjects.length}</div></div>
        <div className="card"><div className="muted">Open alerts</div><div style={{ fontSize: "2rem", fontWeight: 800 }}>{open.length}</div></div>
        <div className="card"><div className="muted">High / critical</div><div style={{ fontSize: "2rem", fontWeight: 800 }}>{critical.length}</div></div>
      </div>

      <div className="grid-2">
        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h3 style={{ margin: 0 }}>Watchlists</h3>
            <Link href="/dashboard/subjects/new" style={{ color: "var(--accent)" }}>+ Add subject</Link>
          </div>
          <table className="table">
            <thead><tr><th>Name</th><th>Tier</th><th></th></tr></thead>
            <tbody>
              {subjects.map((s) => (
                <tr key={s.id}>
                  <td>{s.name}</td>
                  <td><span className="badge sev-info">{s.tier}</span></td>
                  <td><Link href={`/dashboard/subjects`} style={{ color: "var(--accent)" }}>View</Link></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card">
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.75rem" }}>
            <h3 style={{ margin: 0 }}>Alert inbox</h3>
            <Link href="/dashboard/alerts" style={{ color: "var(--accent)" }}>All alerts</Link>
          </div>
          <table className="table">
            <thead><tr><th>Severity</th><th>Title</th><th>Source</th></tr></thead>
            <tbody>
              {alerts.slice(0, 8).map((a) => (
                <tr key={a.id}>
                  <td><SeverityBadge severity={a.severity} /></td>
                  <td><Link href={`/dashboard/alerts/${a.id}`}>{a.title}</Link></td>
                  <td className="muted">{a.source}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
