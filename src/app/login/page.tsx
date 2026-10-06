"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPending(true);
    setError(null);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: fd.get("username"),
        password: fd.get("password"),
      }),
    });
    setPending(false);
    if (!res.ok) {
      setError("Invalid credentials. Use demo / demo.");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="hero-glow" style={{ minHeight: "100vh", display: "grid", placeItems: "center" }}>
      <div className="card" style={{ width: "min(420px, calc(100% - 2rem))" }}>
        <Link href="/" className="muted" style={{ fontSize: "0.85rem" }}>← Back</Link>
        <h1 style={{ marginBottom: "0.25rem" }}>Demo login</h1>
        <p className="muted" style={{ marginTop: 0 }}>
          MVP stub auth. Production path: magic links via Resend / Auth.js.
        </p>
        <form onSubmit={onSubmit} style={{ display: "grid", gap: "0.85rem" }}>
          <div>
            <label className="label">Username</label>
            <input className="input" name="username" defaultValue="demo" required />
          </div>
          <div>
            <label className="label">Password</label>
            <input className="input" name="password" type="password" defaultValue="demo" required />
          </div>
          {error && <div style={{ color: "var(--danger)" }}>{error}</div>}
          <button className="btn btn-primary" type="submit" disabled={pending}>
            {pending ? "Signing in…" : "Enter dashboard"}
          </button>
        </form>
      </div>
    </div>
  );
}
