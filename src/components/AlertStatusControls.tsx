"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { AlertStatus } from "@/lib/types";

const statuses: AlertStatus[] = ["new", "reviewing", "actioned", "closed"];

export function AlertStatusControls({ id, status }: { id: string; status: AlertStatus }) {
  const [current, setCurrent] = useState(status);
  const [msg, setMsg] = useState<string | null>(null);
  const router = useRouter();

  async function setStatus(next: AlertStatus) {
    const res = await fetch(`/api/alerts/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: next }),
    });
    if (res.ok) {
      setCurrent(next);
      setMsg(`Marked ${next}`);
      router.refresh();
    } else {
      setMsg("Update failed");
    }
  }

  return (
    <div className="card">
      <h3 style={{ marginTop: 0 }}>Triage</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        {statuses.map((s) => (
          <button
            key={s}
            type="button"
            className={s === current ? "btn btn-primary" : "btn btn-ghost"}
            onClick={() => setStatus(s)}
          >
            {s}
          </button>
        ))}
      </div>
      {msg && <p className="muted">{msg}</p>}
    </div>
  );
}
