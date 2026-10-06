import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

/** Official X/Twitter API v2 recent search — requires TWITTER_BEARER_TOKEN. */
export async function runTwitterSearch(subject: Subject): Promise<SourceRunResult> {
  const token = process.env.TWITTER_BEARER_TOKEN;
  if (!token) {
    return {
      sourceId: "twitter",
      hits: [],
      skipped: true,
      reason: "TWITTER_BEARER_TOKEN not set — connect token in Sources",
    };
  }
  const query = encodeURIComponent(`"${subject.name}" -is:retweet`);
  const url = `https://api.twitter.com/2/tweets/search/recent?query=${query}&max_results=10&tweet.fields=created_at,text`;
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${token}` },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return {
        sourceId: "twitter",
        hits: [],
        skipped: true,
        reason: `Twitter API HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      data?: { id: string; text: string; created_at?: string }[];
    };
    const hits: RawHit[] = (data.data ?? []).map((t) => ({
      source: "twitter",
      title: t.text.slice(0, 80),
      snippet: t.text.slice(0, 400),
      url: `https://x.com/i/web/status/${t.id}`,
      severity: /scam|impersonat|threat|leak/i.test(t.text) ? "high" : "low",
      matchedKeyword: subject.name,
      publishedAt: t.created_at,
    }));
    return { sourceId: "twitter", hits };
  } catch (e) {
    return {
      sourceId: "twitter",
      hits: [],
      skipped: true,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
