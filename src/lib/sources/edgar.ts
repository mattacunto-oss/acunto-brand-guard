import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

/**
 * SEC EDGAR full-text search (public) — useful for company-name / Team subjects.
 * Fair use: polite UA, limited results.
 */
export async function runEdgarSearch(subject: Subject): Promise<SourceRunResult> {
  if (subject.tier === "NIL" || subject.tier === "HNWI") {
    // Still allow if name looks corporate; skip pure person by default for noise
    if (!/inc|llc|corp|fc|fc\.|team|partners|agency|office/i.test(subject.name)) {
      return {
        sourceId: "edgar",
        hits: [],
        skipped: true,
        reason: "EDGAR skipped for individual-style subject (noise control)",
      };
    }
  }
  const q = encodeURIComponent(`"${subject.name}"`);
  const url = `https://efts.sec.gov/LATEST/search-index?q=${q}&dateRange=custom&startdt=2024-01-01&forms=8-K%2C10-K%2C10-Q`;
  try {
    const res = await fetch(url, {
      headers: {
        "User-Agent": "AcuntoBrandGuard contact@example.com",
        Accept: "application/json",
      },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return {
        sourceId: "edgar",
        hits: [],
        skipped: true,
        reason: `EDGAR HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      hits?: {
        hits?: {
          _source?: {
            entity_name?: string;
            file_date?: string;
            form?: string;
            display_names?: string[];
            adsh?: string;
          };
        }[];
      };
    };
    const items = data.hits?.hits ?? [];
    const hits: RawHit[] = items.slice(0, 5).map((h) => {
      const s = h._source ?? {};
      const name = s.display_names?.[0] ?? s.entity_name ?? subject.name;
      return {
        source: "edgar",
        title: `SEC ${s.form ?? "filing"} — ${name}`,
        snippet: `Filed ${s.file_date ?? "n/a"}. Accession ${s.adsh ?? "n/a"}.`,
        url: s.adsh
          ? `https://www.sec.gov/cgi-bin/browse-edgar?action=getcompany&CIK=&type=&dateb=&owner=include&count=40&search_text=${encodeURIComponent(subject.name)}`
          : "https://www.sec.gov/edgar/search/",
        severity: "info",
        matchedKeyword: subject.name,
        publishedAt: s.file_date,
      };
    });
    return { sourceId: "edgar", hits };
  } catch (e) {
    return {
      sourceId: "edgar",
      hits: [],
      skipped: true,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
