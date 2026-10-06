import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

function scoreReddit(title: string, body: string): RawHit["severity"] {
  const t = `${title} ${body}`.toLowerCase();
  if (/(impersonat|scam|phishing|doxx|threat|leak|fake account)/.test(t))
    return "high";
  if (/(hate|harass|cancel|boycott)/.test(t)) return "medium";
  return "low";
}

/**
 * Reddit public JSON search — no OAuth for basic search.
 * Respect rate limits: one query per subject, short timeout, polite UA.
 * Do not scrape authenticated or private content.
 */
export async function runRedditSearch(subject: Subject): Promise<SourceRunResult> {
  const q = encodeURIComponent(subject.name);
  const endpoints = [
    `https://www.reddit.com/search.json?q=${q}&sort=new&limit=10&type=link`,
    `https://old.reddit.com/search.json?q=${q}&sort=new&limit=10&type=link`,
  ];
  try {
    let res: Response | null = null;
    let url = endpoints[0];
    for (const ep of endpoints) {
      url = ep;
      res = await fetch(ep, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (compatible; HarborShield/0.1; +https://acunto-brand-guard.vercel.app; public-search)",
          Accept: "application/json,text/plain,*/*",
        },
        signal: AbortSignal.timeout(12000),
      });
      if (res.ok || res.status === 429) break;
    }
    if (!res) {
      return { sourceId: "reddit", hits: [], skipped: true, reason: "Reddit fetch failed" };
    }
    if (res.status === 429) {
      return {
        sourceId: "reddit",
        hits: [],
        skipped: true,
        reason: "Reddit rate limited (429) — backoff and retry later",
      };
    }
    if (!res.ok) {
      return {
        sourceId: "reddit",
        hits: [],
        skipped: true,
        reason: `Reddit HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      data?: {
        children?: {
          data?: {
            title?: string;
            selftext?: string;
            permalink?: string;
            url?: string;
            created_utc?: number;
          };
        }[];
      };
    };
    const hits: RawHit[] = (data.data?.children ?? []).map((c) => {
      const d = c.data ?? {};
      const title = d.title ?? "Reddit post";
      const snippet = (d.selftext ?? "").slice(0, 400);
      const permalink = d.permalink
        ? `https://www.reddit.com${d.permalink}`
        : d.url ?? "";
      return {
        source: "reddit",
        title,
        snippet,
        url: permalink,
        severity: scoreReddit(title, snippet),
        matchedKeyword: subject.name,
        publishedAt: d.created_utc
          ? new Date(d.created_utc * 1000).toISOString()
          : undefined,
      };
    });
    return { sourceId: "reddit", hits };
  } catch (e) {
    return {
      sourceId: "reddit",
      hits: [],
      skipped: true,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
