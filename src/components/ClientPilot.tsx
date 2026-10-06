"use client";

import { useState } from "react";

export function ClientPilot() {
  const [status, setStatus] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setStatus(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/pilot", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        email: fd.get("email"),
        org: fd.get("org"),
        tier: fd.get("tier"),
        message: fd.get("message"),
      }),
    });
    const data = await res.json();
    setPending(false);
    setStatus(res.ok ? data.message : data.error ?? "Failed");
    if (res.ok) e.currentTarget.reset();
  }

  return (
    <form onSubmit={onSubmit} className="grid-2" style={{ marginTop: "1rem" }}>
      <div>
        <label className="label">Name</label>
        <input className="input" name="name" required placeholder="Your name" />
      </div>
      <div>
        <label className="label">Email</label>
        <input className="input" name="email" type="email" required placeholder="you@org.com" />
      </div>
      <div>
        <label className="label">Organization</label>
        <input className="input" name="org" placeholder="School / team / agency / FO" />
      </div>
      <div>
        <label className="label">Interested tier</label>
        <select className="select" name="tier" defaultValue="NIL">
          <option value="NIL">NIL individual</option>
          <option value="Team">Team / department</option>
          <option value="HNWI">HNWI / family office</option>
        </select>
      </div>
      <div style={{ gridColumn: "1 / -1" }}>
        <label className="label">Message</label>
        <textarea className="textarea" name="message" rows={3} placeholder="Who would you like on a pilot watchlist?" />
      </div>
      <div style={{ gridColumn: "1 / -1", display: "flex", gap: "1rem", alignItems: "center" }}>
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Sending…" : "Request pilot"}
        </button>
        {status && <span className="muted">{status}</span>}
      </div>
    </form>
  );
}
