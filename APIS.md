# Acunto Brand Guard — Data Sources & APIs

All monitoring is limited to **publicly available information** and **subscriber-provided keywords**.  
No hacking, no private/authenticated scraping, no paywall bypass, no stolen data.

| Name | What it monitors | Free tier? | Env var | Signup URL | Status |
|------|------------------|------------|---------|------------|--------|
| Google News RSS | News/blog headlines matching subject name | Yes (unofficial RSS URL) | — | https://news.google.com/ | **wired** |
| NewsAPI.org | Structured news articles | Yes (dev; production paid) | `NEWS_API_KEY` | https://newsapi.org/register | **needs key** (wired when set) |
| Reddit public JSON | Public post/search mentions | Yes (strict rate limits) | — | https://www.reddit.com/dev/api | **wired** |
| X / Twitter API v2 | Recent public tweets | No (paid/basic tiers) | `TWITTER_BEARER_TOKEN` | https://developer.x.com/ | **needs key** |
| Domain lookalikes + RDAP | Typosquat candidates HTTP reachability; RDAP for listed domains | Yes | — | https://about.rdap.org/ | **wired** |
| Have I Been Pwned | Breach exposure for **subscriber-added emails only** | No (API key) | `HIBP_API_KEY` | https://haveibeenpwned.com/API/Key | **needs key** |
| SEC EDGAR | Public filings for company-like subjects | Yes | — | https://www.sec.gov/edgar/search/ | **wired** |
| OpenCorporates | Public company registry search | Yes (rate-limited; token optional) | `OPENCORPORATES_API_TOKEN` | https://opencorporates.com/api_accounts/new | **wired** |
| Paste-site search | Public paste leaks | n/a | — | — | **phase2** (no legitimate API wired) |
| AI summarization | Summaries of hits | Paid | `OPENAI_API_KEY` / `XAI_API_KEY` / `AI_GATEWAY_API_KEY` | https://platform.openai.com/ · https://console.x.ai/ | **needs key** (template fallback) |

## ToS / rate-limit caveats

1. **Google News RSS** — Unofficial query URLs (`news.google.com/rss/search?q=…`) are commonly used but **fragile** and may change or block automated clients. Prefer NewsAPI for production. Cache results; do not hammer.
2. **Reddit** — Use a descriptive `User-Agent`, keep concurrency low, honor HTTP 429. Do not scrape logged-in or private content. Prefer official API for higher volume.
3. **NewsAPI** — Free tier is for development; check commercial license before selling access to data.
4. **Twitter/X** — Official API only; never scrape after login or bypass ToS.
5. **HIBP** — Only check emails the subscriber explicitly added and authorized. Never bulk-dump breaches or sell breach data.
6. **RDAP / domain checks** — HEAD/GET to candidate hosts only; **no zone transfers**, no registrar abuse, no DNS amplification.
7. **EDGAR / OpenCorporates** — Public data; identify your client in `User-Agent` / comply with fair-use and API terms.
8. **Paste sites** — Deferred to Phase 2 until a licensed/legitimate API exists.

## Production storage note

MVP uses a JSON store (`data/store.json` locally; `/tmp` on Vercel — ephemeral). For production, migrate to **Turso/libSQL**, **Vercel Postgres**, or similar durable storage.
