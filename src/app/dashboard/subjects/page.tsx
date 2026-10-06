import Link from "next/link";
import { listSubjects, listAlerts } from "@/lib/store";
import { RunScanButton } from "@/components/RunScanButton";

export const dynamic = "force-dynamic";

export default function SubjectsPage() {
  const subjects = listSubjects();
  const alerts = listAlerts();

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <div>
          <h1 style={{ marginBottom: "0.25rem" }}>Watchlists</h1>
          <p className="muted">Subjects authorized by the subscriber. Fictional demos included.</p>
        </div>
        <Link className="btn btn-primary" href="/dashboard/subjects/new">Add subject</Link>
      </div>

      <div style={{ display: "grid", gap: "1rem", marginTop: "1rem" }}>
        {subjects.map((s) => {
          const count = alerts.filter((a) => a.subjectId === s.id).length;
          return (
            <div className="card" key={s.id}>
              <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
                <div>
                  <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                    <h3 style={{ margin: 0 }}>{s.name}</h3>
                    <span className="badge sev-info">{s.tier}</span>
                  </div>
                  <p className="muted" style={{ margin: "0.4rem 0" }}>{s.notes || "No notes"}</p>
                  <div className="muted" style={{ fontSize: "0.85rem" }}>
                    Aliases: {s.aliases.join(", ") || "—"} · Handles: {s.handles.join(", ") || "—"} · Domains: {s.domains.join(", ") || "—"}
                  </div>
                  <div className="muted" style={{ fontSize: "0.85rem", marginTop: "0.25rem" }}>
                    Keywords: {s.keywords.join(", ")} · Alerts: {count}
                  </div>
                  {s.tier === "NIL" && (
                    <p style={{ fontSize: "0.8rem", color: "var(--warn)", marginBottom: 0 }}>
                      NIL / possible minors: parent/guardian or authorized agent required for real coverage.
                    </p>
                  )}
                </div>
                <RunScanButton subjectId={s.id} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
