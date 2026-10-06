"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function RunScanButton({ subjectId }: { subjectId?: string }) {
  const [msg, setMsg] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const router = useRouter();

  async function run() {
    setPending(true);
    setMsg("Scanning public sources…");
    try {
      const res = await fetch("/api/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(subjectId ? { subjectId } : {}),
      });
      const data = await res.json();
      if (!res.ok) {
        setMsg(data.error ?? "Scan failed");
      } else if (data.result) {
        setMsg(
          `Done: ${data.result.alertsCreated} alerts · sources ${data.result.sourcesRun.join(", ") || "none"} · skipped ${data.result.sourcesSkipped.length}`
        );
      } else if (data.results) {
        const n = data.results.reduce((a: number, r: { alertsCreated: number }) => a + r.alertsCreated, 0);
        setMsg(`Scanned ${data.results.length} subjects · ${n} alerts created`);
      }
      router.refresh();
    } catch (e) {
      setMsg(e instanceof Error ? e.message : "Scan failed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", alignItems: "flex-start" }}>
      <button className="btn btn-primary" type="button" onClick={run} disabled={pending}>
        {pending ? "Running scan…" : subjectId ? "Run scan now" : "Run scan — all subjects"}
      </button>
      {msg && <span className="muted" style={{ fontSize: "0.85rem", maxWidth: 520 }}>{msg}</span>}
    </div>
  );
}
