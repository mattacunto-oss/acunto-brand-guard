import Link from "next/link";
import { ClientPilot } from "@/components/ClientPilot";

export default function LandingPage() {
  return (
    <div className="hero-glow">
      <header>
        <div className="container" style={{ padding: "1.25rem 0", display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
          <strong style={{ fontSize: "1.1rem" }}>Acunto Brand Guard</strong>
          <div style={{ display: "flex", gap: "0.6rem" }}>
            <Link className="btn btn-ghost" href="/login">Demo login</Link>
            <a className="btn btn-primary" href="#pilot">Request pilot</a>
          </div>
        </div>
      </header>

      <main className="container" style={{ paddingBottom: "4rem" }}>
        <section style={{ padding: "3.5rem 0 2.5rem", maxWidth: 780 }}>
          <div className="badge sev-info" style={{ marginBottom: "1rem" }}>MVP · Public web only</div>
          <h1 style={{ fontSize: "clamp(2rem, 5vw, 3.2rem)", lineHeight: 1.1, letterSpacing: "-0.03em", margin: "0 0 1rem" }}>
            Executive brand monitoring for NIL, pro teams, and high-net-worth clients.
          </h1>
          <p className="muted" style={{ fontSize: "1.15rem", lineHeight: 1.55, marginBottom: "1.5rem" }}>
            Catch impersonators, lookalike domains, fake merch, leaks that hit the public web, and pile-ons —
            before a sponsor, reporter, or fan finds them first. Clear severity. Clear next step.
          </p>
          <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
            <Link className="btn btn-primary" href="/login">Open demo dashboard</Link>
            <a className="btn btn-ghost" href="#how">How it works</a>
          </div>
          <p className="muted" style={{ marginTop: "1rem", fontSize: "0.85rem" }}>
            Demo credentials: <code>demo</code> / <code>demo</code>
          </p>
        </section>

        <section className="grid-3" style={{ marginBottom: "2.5rem" }}>
          {[
            ["The problem", "Athletes, teams, and principals learn about scams and impersonation too late — after money or trust is already gone."],
            ["Who it's for", "NIL athletes & agents, college athletic departments, pro teams, talent agencies, and HNWI / family offices."],
            ["The boundary", "We monitor publicly available information and subscriber-provided keywords only. No hacking. No private-account access."],
          ].map(([t, b]) => (
            <div className="card" key={t}>
              <h3 style={{ marginTop: 0 }}>{t}</h3>
              <p className="muted" style={{ marginBottom: 0, lineHeight: 1.5 }}>{b}</p>
            </div>
          ))}
        </section>

        <section id="how" style={{ marginBottom: "2.5rem" }}>
          <h2>How it works</h2>
          <div className="grid-2">
            <div className="card">
              <ol className="muted" style={{ lineHeight: 1.7, paddingLeft: "1.1rem", margin: 0 }}>
                <li>You authorize a watchlist: names, aliases, handles, domains, keywords.</li>
                <li>We scan news RSS, Reddit public search, optional NewsAPI / X / HIBP, domain lookalikes, and public filings.</li>
                <li>Hits are scored by severity and given an educational next-step playbook.</li>
                <li>You get an alert inbox plus a weekly digest. Human review path for High/Critical in production.</li>
              </ol>
            </div>
            <div className="card">
              <h3 style={{ marginTop: 0 }}>NIL & minors</h3>
              <p className="muted" style={{ lineHeight: 1.55 }}>
                For college NIL and any subject who may be a minor, a <strong style={{ color: "var(--text)" }}>parent/guardian or authorized agent</strong> is required.
                We never promise to “erase records.” Removals use only legitimate platform, trademark, copyright, and legal channels.
              </p>
            </div>
          </div>
        </section>

        <section id="pricing" style={{ marginBottom: "2.5rem" }}>
          <h2>Pricing tiers <span className="muted" style={{ fontSize: "0.9rem", fontWeight: 400 }}>(estimates to test)</span></h2>
          <div className="grid-3">
            {[
              ["NIL individual", "$50–$250 / mo", "Self-serve dashboard + alerts. Higher tiers add human review and weekly digest."],
              ["Team / department", "$1,500–$7,500 / mo", "Roster coverage by sport or full department, plus onboarding fee."],
              ["HNWI / family office", "$2,000–$10,000+ / mo", "Principal + family, white-glove analyst access, incident support."],
            ].map(([name, price, desc]) => (
              <div className="card" key={name}>
                <div className="muted" style={{ fontSize: "0.85rem" }}>{name}</div>
                <div style={{ fontSize: "1.4rem", fontWeight: 800, margin: "0.35rem 0" }}>{price}</div>
                <p className="muted" style={{ margin: 0, lineHeight: 1.5 }}>{desc}</p>
              </div>
            ))}
          </div>
        </section>

        <section id="pilot" className="card">
          <h2 style={{ marginTop: 0 }}>Request a pilot</h2>
          <p className="muted">
            Looking for 5 pilot watchlists. Signed authorization and scope letter required.
          </p>
          <ClientPilot />
        </section>

        <footer className="muted" style={{ marginTop: "3rem", fontSize: "0.8rem", lineHeight: 1.6 }}>
          <p>
            Scope: publicly available information + subscriber keywords only. Not legal advice.
            Contact: <a href="mailto:mdveke06@gmail.com" style={{ color: "var(--accent)" }}>mdveke06@gmail.com</a>
            {" · "}
            <a href="mailto:mattacunto@gmail.com" style={{ color: "var(--accent)" }}>mattacunto@gmail.com</a>
          </p>
          <p>© {new Date().getFullYear()} Acunto Brand Guard · Matthew Acunto</p>
        </footer>
      </main>
    </div>
  );
}
