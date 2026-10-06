import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

/**
 * Have I Been Pwned — ONLY for emails the subscriber explicitly added.
 * Requires HIBP_API_KEY. Never dumps full breach corpora.
 */
export async function runHibp(subject: Subject): Promise<SourceRunResult> {
  const key = process.env.HIBP_API_KEY;
  if (!key) {
    return {
      sourceId: "hibp",
      hits: [],
      skipped: true,
      reason: "HIBP_API_KEY not set",
    };
  }
  if (!subject.emails.length) {
    return {
      sourceId: "hibp",
      hits: [],
      skipped: true,
      reason: "No subscriber-provided emails on this subject",
    };
  }
  const hits: RawHit[] = [];
  for (const email of subject.emails.slice(0, 5)) {
    try {
      const res = await fetch(
        `https://haveibeenpwned.com/api/v3/breachedaccount/${encodeURIComponent(email)}?truncateResponse=false`,
        {
          headers: {
            "hibp-api-key": key,
            "user-agent": "AcuntoBrandGuard",
          },
          signal: AbortSignal.timeout(10000),
        }
      );
      if (res.status === 404) continue;
      if (!res.ok) {
        return {
          sourceId: "hibp",
          hits,
          skipped: true,
          reason: `HIBP HTTP ${res.status}`,
        };
      }
      const breaches = (await res.json()) as { Name?: string; BreachDate?: string; Description?: string }[];
      for (const b of breaches.slice(0, 5)) {
        hits.push({
          source: "hibp",
          title: `Breach exposure: ${b.Name ?? "unknown"} for subscriber email`,
          snippet: `Breach date ${b.BreachDate ?? "n/a"}. ${(b.Description ?? "").replace(/<[^>]+>/g, "").slice(0, 300)}`,
          url: `https://haveibeenpwned.com/account/${encodeURIComponent(email)}`,
          severity: "high",
          matchedKeyword: email,
        });
      }
    } catch (e) {
      return {
        sourceId: "hibp",
        hits,
        skipped: true,
        reason: e instanceof Error ? e.message : String(e),
      };
    }
  }
  return { sourceId: "hibp", hits };
}
