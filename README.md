# Acunto Brand Guard

**Tagline:** Executive brand monitoring for NIL, pro teams, and high-net-worth clients.

MVP web app + public-source monitor pipeline for Matthew Acunto’s go-to-market.

## Legal boundaries (do not violate)

- Monitor **only** publicly available information and subscriber-provided keywords.
- **No** hacking, unauthorized access, credential stuffing, stolen data, device surveillance, private-account scraping, or paywall/ToS bypass.
- Prefer official APIs and RSS/public search. See [APIS.md](./APIS.md) for ToS/rate-limit caveats.
- **NIL / possible minors:** parent/guardian or authorized agent required. **No “erase records” claims.**
- Recommended next steps are **educational, not legal advice**.

## Demo login

- Username: `demo`
- Password: `demo`

Path to real auth: replace cookie stub in `src/lib/auth.ts` with Auth.js / magic links (e.g. Resend).

## How to run locally

```bash
cd /workspace/brand-monitoring   # or your clone path
cp .env.example .env.local       # add keys as needed
npm install
npm run dev
```

Open http://localhost:3000 → landing · http://localhost:3000/login → dashboard.

### Run a scan

1. Log in with `demo` / `demo`.
2. Open **Watchlists** or **Overview**.
3. Click **Run scan now** (per subject) or **Run scan — all subjects**.
4. Pipeline hits Google News RSS + Reddit (no keys), optional NewsAPI/X/HIBP/AI if env vars set, domain lookalikes, EDGAR/OpenCorporates.
5. New alerts appear in **Alert inbox**.

## Env vars

| Variable | Required? | Purpose |
|----------|-----------|---------|
| `NEWS_API_KEY` | No | NewsAPI.org |
| `TWITTER_BEARER_TOKEN` | No | X API v2 recent search |
| `HIBP_API_KEY` | No | HIBP for subscriber emails only |
| `OPENCORPORATES_API_TOKEN` | No | Higher OC rate limits |
| `OPENAI_API_KEY` | No | AI summaries |
| `XAI_API_KEY` | No | AI summaries via xAI |
| `AI_GATEWAY_API_KEY` | No | AI Gateway summarization |

Without keys, free public sources still run; AI falls back to templates.

## Project layout

- `src/app` — Landing, login, dashboard (watchlists, alerts, digest, sources)
- `src/lib/sources` — Pluggable monitors
- `src/lib/scan.ts` — Pipeline orchestration
- `src/lib/store.ts` — JSON/demo store (seeded fictional subjects)
- `prospects/gtm-prospects.csv` — GTM prospect list (public sources only)
- `docs/sales-one-pager.html` (+ PDF) — Sales sheet
- `APIS.md` — Source matrix
- `shots/` — Product screenshots

## Prospects

CSV: [`prospects/gtm-prospects.csv`](./prospects/gtm-prospects.csv)  
~100 rows focused on Virginia / ACC / Hampton Roads / military-adjacent + national pro teams.  
**No invented emails.** LinkedIn only as public company URLs — no login scraping.

## Next steps

1. Wire durable DB (Turso / Postgres) for Vercel.
2. Real auth + Resend for alerts/digest email.
3. Human review queue for High/Critical.
4. Pilot contracts + authorization letters.
5. Optional paste-site Phase 2 via licensed API.

## Contact placeholders

- mdveke06@gmail.com
- mattacunto@gmail.com  

Edit these in the landing footer and sales one-pager as needed.
