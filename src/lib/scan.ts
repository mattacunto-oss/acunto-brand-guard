import { addAlert, getSubject, listSubjects } from "./store";
import type { ScanResult } from "./types";
import { runGoogleNewsRss, runNewsApi } from "./sources/news";
import { runRedditSearch } from "./sources/reddit";
import { runTwitterSearch } from "./sources/twitter";
import { runDomainLookalikes } from "./sources/domains";
import { runHibp } from "./sources/hibp";
import { runEdgarSearch } from "./sources/edgar";
import { runOpenCorporates } from "./sources/opencorporates";
import { summarizeHit } from "./summarize";
import type { RawHit, SourceRunResult } from "./sources/types";

async function runAllSources(subjectId: string): Promise<{
  results: SourceRunResult[];
  subjectName: string;
}> {
  const subject = getSubject(subjectId);
  if (!subject) throw new Error("Subject not found");

  // Sequential-ish with small batches to respect rate limits
  const batch1 = await Promise.all([
    runGoogleNewsRss(subject),
    runRedditSearch(subject),
  ]);
  const batch2 = await Promise.all([
    runNewsApi(subject),
    runTwitterSearch(subject),
    runDomainLookalikes(subject),
  ]);
  const batch3 = await Promise.all([
    runHibp(subject),
    runEdgarSearch(subject),
    runOpenCorporates(subject),
  ]);

  return { results: [...batch1, ...batch2, ...batch3], subjectName: subject.name };
}

function dedupeKey(h: RawHit): string {
  return `${h.source}|${h.url}|${h.title}`.toLowerCase().slice(0, 240);
}

export async function scanSubject(subjectId: string): Promise<ScanResult> {
  const { results, subjectName } = await runAllSources(subjectId);
  const sourcesRun: string[] = [];
  const sourcesSkipped: { name: string; reason: string }[] = [];
  const seen = new Set<string>();
  let alertsCreated = 0;

  for (const r of results) {
    if (r.skipped) {
      sourcesSkipped.push({ name: r.sourceId, reason: r.reason ?? "skipped" });
      continue;
    }
    sourcesRun.push(r.sourceId);
    for (const hit of r.hits) {
      const key = dedupeKey(hit);
      if (seen.has(key)) continue;
      seen.add(key);
      const summary = await summarizeHit(hit, subjectName);
      addAlert({
        subjectId,
        source: hit.source,
        title: hit.title,
        snippet: hit.snippet,
        url: hit.url,
        severity: hit.severity,
        status: "new",
        summary,
        matchedKeyword: hit.matchedKeyword,
      });
      alertsCreated += 1;
    }
  }

  // Paste sites: Phase 2 — always note as skipped
  sourcesSkipped.push({
    name: "paste_sites",
    reason: "Phase 2 — no legitimate public paste search API wired",
  });

  return {
    subjectId,
    sourcesRun,
    sourcesSkipped,
    alertsCreated,
    scannedAt: new Date().toISOString(),
  };
}

export async function scanAll(): Promise<ScanResult[]> {
  const subjects = listSubjects();
  const out: ScanResult[] = [];
  for (const s of subjects) {
    out.push(await scanSubject(s.id));
  }
  return out;
}
