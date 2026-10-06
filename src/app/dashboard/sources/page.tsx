"use client";

import { useEffect, useState } from "react";
import type { SourceStatus } from "@/lib/types";

export default function SourcesPage() {
  const [sources, setSources] = useState<SourceStatus[]>([]);

  useEffect(() => {
    fetch("/api/sources")
      .then((r) => r.json())
      .then((d) => setSources(d.sources ?? []));
  }, []);

  return (
    <div>
      <h1>Data sources</h1>
      <p className="muted">
        Prefer official APIs and public RSS. Paste-site search is Phase 2. Connect tokens via env vars — never in client code.
      </p>
      <div style={{ display: "grid", gap: "0.75rem" }}>
        {sources.map((s) => (
          <div className="card" key={s.id}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
              <div>
                <h3 style={{ margin: "0 0 0.35rem" }}>{s.name}</h3>
                <p className="muted" style={{ margin: 0 }}>{s.description}</p>
                {s.envVar && <p className="muted" style={{ fontSize: "0.85rem" }}>Env: <code>{s.envVar}</code></p>}
                {s.signupUrl && (
                  <a href={s.signupUrl} target="_blank" rel="noreferrer" style={{ color: "var(--accent)", fontSize: "0.85rem" }}>
                    Signup / docs
                  </a>
                )}
              </div>
              <div style={{ textAlign: "right" }}>
                <div className={`badge ${s.connected ? "sev-low" : "sev-medium"}`}>
                  {s.status.replace("_", " ")}
                </div>
                <div className="muted" style={{ fontSize: "0.8rem", marginTop: "0.35rem" }}>
                  {s.connected ? "Connected" : s.status === "phase2" ? "Phase 2" : "Connect token"}
                </div>
                <div className="muted" style={{ fontSize: "0.8rem" }}>
                  {s.freeTier ? "Free tier available" : "Paid / key required"}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
