"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";

const links = [
  { href: "/dashboard", label: "Overview" },
  { href: "/dashboard/alerts", label: "Alert inbox" },
  { href: "/dashboard/subjects", label: "Watchlists" },
  { href: "/dashboard/digest", label: "Weekly digest" },
  { href: "/dashboard/sources", label: "Sources" },
];

export function DashboardNav() {
  const pathname = usePathname();
  const router = useRouter();

  async function logout() {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/login");
    router.refresh();
  }

  return (
    <header style={{ borderBottom: "1px solid var(--border)", marginBottom: "1.5rem" }}>
      <div className="container" style={{ padding: "1rem 0", display: "flex", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap", alignItems: "center" }}>
        <div>
          <Link href="/" style={{ fontWeight: 800, letterSpacing: "-0.02em" }}>
            Harbor Shield
          </Link>
          <div className="muted" style={{ fontSize: "0.8rem" }}>
            Demo mode · public sources only
          </div>
        </div>
        <button className="btn btn-ghost" onClick={logout} type="button">
          Log out
        </button>
      </div>
      <div className="container nav">
        {links.map((l) => (
          <Link
            key={l.href}
            href={l.href}
            className={pathname === l.href || (l.href !== "/dashboard" && pathname.startsWith(l.href)) ? "active" : ""}
          >
            {l.label}
          </Link>
        ))}
      </div>
    </header>
  );
}
