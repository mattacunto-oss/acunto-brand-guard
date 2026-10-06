import Parser from "rss-parser";
import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

const parser = new Parser({
  timeout: 12000,
  headers: {
    "User-Agent": "HarborShield/0.1 (+public-rss; demo monitoring)",
  },
});

function scoreNews(title: string, snippet: string): RawHit["severity"] {
  const t = `${title} ${snippet}`.toLowerCase();
  if (/(doxx|threat|leak|hacked|impersonat|scam|phishing|deepfake)/.test(t))
    return "high";
  if (/(lawsuit|arrest|scandal|controversy|boycott)/.test(t)) return "medium";
  if (/(merch|giveaway|crypto|endorsement|nil deal)/.test(t)) return "medium";
  return "info";
}

/** Google News RSS (unofficial query URL — fragile; respect ToS/availability). */
export async function runGoogleNewsRss(subject: Subject): Promise<SourceRunResult> {
  const query = encodeURIComponent(`"${subject.name}"`);
  const url = `https://news.google.com/rss/search?q=${query}&hl=en-US&gl=US&ceid=US:en`;
  try {
    const feed = await parser.parseURL(url);
    const hits: RawHit[] = (feed.items ?? []).slice(0, 8).map((item) => {
      const title = item.title ?? "Untitled";
      const snippet = item.contentSnippet ?? item.content ?? "";
      return {
        source: "news_rss",
        title,
        snippet: snippet.slice(0, 400),
        url: item.link ?? url,
        severity: scoreNews(title, snippet),
        matchedKeyword: subject.name,
        publishedAt: item.pubDate,
      };
    });
    return { sourceId: "news_rss", hits };
  } catch (e) {
    return {
      sourceId: "news_rss",
      hits: [],
      skipped: true,
      reason: `Google News RSS failed: ${e instanceof Error ? e.message : String(e)}`,
    };
  }
}

/** NewsAPI.org — only when NEWS_API_KEY is set. */
export async function runNewsApi(subject: Subject): Promise<SourceRunResult> {
  const key = process.env.NEWS_API_KEY;
  if (!key) {
    return {
      sourceId: "newsapi",
      hits: [],
      skipped: true,
      reason: "NEWS_API_KEY not set",
    };
  }
  const q = encodeURIComponent(subject.name);
  const endpoint = `https://newsapi.org/v2/everything?q=${q}&language=en&pageSize=10&sortBy=publishedAt`;
  try {
    const res = await fetch(endpoint, {
      headers: { "X-Api-Key": key },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return {
        sourceId: "newsapi",
        hits: [],
        skipped: true,
        reason: `NewsAPI HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      articles?: { title?: string; description?: string; url?: string; publishedAt?: string }[];
    };
    const hits: RawHit[] = (data.articles ?? []).map((a) => ({
      source: "newsapi",
      title: a.title ?? "Untitled",
      snippet: (a.description ?? "").slice(0, 400),
      url: a.url ?? "",
      severity: scoreNews(a.title ?? "", a.description ?? ""),
      matchedKeyword: subject.name,
      publishedAt: a.publishedAt,
    }));
    return { sourceId: "newsapi", hits };
  } catch (e) {
    return {
      sourceId: "newsapi",
      hits: [],
      skipped: true,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
