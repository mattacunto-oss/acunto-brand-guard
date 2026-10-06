import Link from "next/link";
import { notFound } from "next/navigation";
import { getAlert, getSubject } from "@/lib/store";
import { SeverityBadge } from "@/components/SeverityBadge";
import { AlertStatusControls } from "@/components/AlertStatusControls";

export const dynamic = "force-dynamic";

export default async function AlertDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const alert = getAlert(id);
  if (!alert) notFound();
  const subject = getSubject(alert.subjectId);

  return (
    <div style={{ maxWidth: 800 }}>
      <Link href="/dashboard/alerts" className="muted">← Inbox</Link>
      <div style={{ display: "flex", gap: "0.6rem", alignItems: "center", marginTop: "0.75rem" }}>
        <SeverityBadge severity={alert.severity} />
        <span className="badge sev-info">{alert.status}</span>
        <span className="muted">{alert.source}</span>
      </div>
      <h1 style={{ marginBottom: "0.5rem" }}>{alert.title}</h1>
      <p className="muted">Subject: {subject?.name ?? alert.subjectId}</p>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Summary</h3>
        <p style={{ lineHeight: 1.55 }}>{alert.summary}</p>
        <h3>Snippet</h3>
        <p className="muted" style={{ lineHeight: 1.55 }}>{alert.snippet}</p>
        <p>
          Source URL:{" "}
          <a href={alert.url} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", wordBreak: "break-all" }}>
            {alert.url}
          </a>
        </p>
      </div>

      <div className="card" style={{ marginBottom: "1rem" }}>
        <h3 style={{ marginTop: 0 }}>Recommended next step</h3>
        <p className="muted" style={{ lineHeight: 1.6 }}>{alert.recommendedNextStep}</p>
        <p style={{ fontSize: "0.8rem", color: "var(--warn)" }}>
          Educational playbook only — not legal advice. We do not erase records or remove lawful content outside legitimate channels.
        </p>
      </div>

      <AlertStatusControls id={alert.id} status={alert.status} />
    </div>
  );
}
