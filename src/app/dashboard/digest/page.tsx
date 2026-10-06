"use client";

import { useEffect, useState } from "react";

export default function DigestPage() {
  const [markdown, setMarkdown] = useState("Loading…");
  const [stats, setStats] = useState<Record<string, unknown> | null>(null);

  useEffect(() => {
    fetch("/api/digest")
      .then((r) => r.json())
      .then((d) => {
        setMarkdown(d.markdown ?? "No digest");
        setStats(d.stats ?? null);
      })
      .catch((e) => setMarkdown(String(e)));
  }, []);

  return (
    <div>
      <h1>Weekly digest preview</h1>
      <p className="muted">One-page summary of trends, open risks, and closed items.</p>
      {stats && (
        <div className="grid-3" style={{ marginBottom: "1rem" }}>
          <div className="card"><div className="muted">Watchlists</div><strong>{String((stats as { subjects?: number }).subjects ?? "")}</strong></div>
          <div className="card"><div className="muted">Alerts (7d)</div><strong>{String((stats as { recent?: number }).recent ?? "")}</strong></div>
          <div className="card"><div className="muted">Open</div><strong>{String((stats as { open?: number }).open ?? "")}</strong></div>
        </div>
      )}
      <pre className="card" style={{ whiteSpace: "pre-wrap", lineHeight: 1.5, fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace", fontSize: "0.9rem" }}>
        {markdown}
      </pre>
    </div>
  );
}
