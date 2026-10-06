import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

/** OpenCorporates public search — free tier rate-limited; optional API token. */
export async function runOpenCorporates(subject: Subject): Promise<SourceRunResult> {
  if (!/inc|llc|corp|partners|agency|office|fc|team/i.test(subject.name) && subject.tier === "NIL") {
    return {
      sourceId: "opencorporates",
      hits: [],
      skipped: true,
      reason: "Skipped for individual NIL subject",
    };
  }
  const q = encodeURIComponent(subject.name);
  const token = process.env.OPENCORPORATES_API_TOKEN;
  const url = `https://api.opencorporates.com/v0.4/companies/search?q=${q}&per_page=5${
    token ? `&api_token=${token}` : ""
  }`;
  try {
    const res = await fetch(url, {
      headers: { Accept: "application/json", "User-Agent": "AcuntoBrandGuard/0.1" },
      signal: AbortSignal.timeout(12000),
    });
    if (!res.ok) {
      return {
        sourceId: "opencorporates",
        hits: [],
        skipped: true,
        reason: `OpenCorporates HTTP ${res.status}`,
      };
    }
    const data = (await res.json()) as {
      results?: {
        companies?: {
          company?: {
            name?: string;
            company_number?: string;
            jurisdiction_code?: string;
            opencorporates_url?: string;
            current_status?: string;
          };
        }[];
      };
    };
    const hits: RawHit[] = (data.results?.companies ?? []).map((c) => {
      const co = c.company ?? {};
      return {
        source: "opencorporates",
        title: `Company record: ${co.name ?? "unknown"}`,
        snippet: `Jurisdiction ${co.jurisdiction_code ?? "n/a"}, status ${co.current_status ?? "n/a"}, number ${co.company_number ?? "n/a"}.`,
        url: co.opencorporates_url ?? "https://opencorporates.com/",
        severity: "info",
        matchedKeyword: subject.name,
      };
    });
    return { sourceId: "opencorporates", hits };
  } catch (e) {
    return {
      sourceId: "opencorporates",
      hits: [],
      skipped: true,
      reason: e instanceof Error ? e.message : String(e),
    };
  }
}
