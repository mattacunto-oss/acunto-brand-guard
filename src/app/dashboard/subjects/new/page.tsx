"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NewSubjectPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/subjects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: fd.get("name"),
        aliases: fd.get("aliases"),
        handles: fd.get("handles"),
        domains: fd.get("domains"),
        emails: fd.get("emails"),
        keywords: fd.get("keywords"),
        notes: fd.get("notes"),
        tier: fd.get("tier"),
      }),
    });
    const data = await res.json();
    setPending(false);
    if (!res.ok) {
      setError(data.error ?? "Failed");
      return;
    }
    router.push("/dashboard/subjects");
    router.refresh();
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <Link href="/dashboard/subjects" className="muted">← Watchlists</Link>
      <h1>Add subject</h1>
      <p className="muted">
        Only monitor people/orgs the subscriber is authorized to cover. For NIL minors: parent/guardian or authorized agent required.
        Emails are used only for optional HIBP checks when a key is configured — never invent emails.
      </p>
      <form onSubmit={onSubmit} className="card" style={{ display: "grid", gap: "0.85rem" }}>
        <div>
          <label className="label">Name *</label>
          <input className="input" name="name" required placeholder="Full name or org" />
        </div>
        <div>
          <label className="label">Tier</label>
          <select className="select" name="tier" defaultValue="NIL">
            <option value="NIL">NIL</option>
            <option value="Team">Team</option>
            <option value="HNWI">HNWI</option>
          </select>
        </div>
        <div>
          <label className="label">Aliases (comma-separated)</label>
          <input className="input" name="aliases" placeholder="JR7, J. Rivera" />
        </div>
        <div>
          <label className="label">Handles</label>
          <input className="input" name="handles" placeholder="@handle" />
        </div>
        <div>
          <label className="label">Domains</label>
          <input className="input" name="domains" placeholder="brand.com" />
        </div>
        <div>
          <label className="label">Emails (subscriber-provided only)</label>
          <input className="input" name="emails" placeholder="only if explicitly authorized" />
        </div>
        <div>
          <label className="label">Keywords</label>
          <input className="input" name="keywords" placeholder="name + scam, merch, deepfake…" />
        </div>
        <div>
          <label className="label">Notes</label>
          <textarea className="textarea" name="notes" rows={3} />
        </div>
        {error && <div style={{ color: "var(--danger)" }}>{error}</div>}
        <button className="btn btn-primary" type="submit" disabled={pending}>
          {pending ? "Saving…" : "Save subject"}
        </button>
      </form>
    </div>
  );
}
