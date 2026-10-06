import type { Subject } from "../types";
import type { RawHit, SourceRunResult } from "./types";

function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "")
    .slice(0, 24);
}

/** Simple typosquat candidates — no zone transfers, no abuse. */
function generateCandidates(subject: Subject): string[] {
  const base = slugify(subject.name);
  if (!base || base.length < 3) return [];
  const extras = subject.domains
    .map((d) => d.replace(/\..*$/, "").toLowerCase())
    .filter(Boolean);
  const seeds = Array.from(new Set([base, ...extras]));
  const tlds = ["com", "net", "org", "shop", "online"];
  const patterns = (s: string) => [
    `${s}-official`,
    `${s}-shop`,
    `${s}merch`,
    `get${s}`,
    `${s}tickets`,
    `${s}-nil`,
  ];
  const out: string[] = [];
  for (const s of seeds) {
    for (const p of patterns(s).slice(0, 3)) {
      for (const tld of tlds.slice(0, 2)) {
        out.push(`${p}.${tld}`);
      }
    }
  }
  return out.slice(0, 8);
}

async function checkReachable(host: string): Promise<boolean> {
  try {
    const res = await fetch(`https://${host}`, {
      method: "HEAD",
      redirect: "manual",
      signal: AbortSignal.timeout(4000),
    });
    return res.status > 0 && res.status < 500;
  } catch {
    try {
      const res = await fetch(`http://${host}`, {
        method: "HEAD",
        redirect: "manual",
        signal: AbortSignal.timeout(4000),
      });
      return res.status > 0 && res.status < 500;
    } catch {
      return false;
    }
  }
}

/** Optional RDAP lookup for a registered domain the subscriber listed. */
async function rdapLookup(domain: string): Promise<string | null> {
  try {
    const res = await fetch(`https://rdap.org/domain/${encodeURIComponent(domain)}`, {
      signal: AbortSignal.timeout(8000),
      headers: { Accept: "application/rdap+json, application/json" },
    });
    if (!res.ok) return null;
    const data = (await res.json()) as { ldhName?: string; status?: string[] };
    return `RDAP: ${data.ldhName ?? domain} status=${(data.status ?? []).join(",") || "unknown"}`;
  } catch {
    return null;
  }
}

export async function runDomainLookalikes(subject: Subject): Promise<SourceRunResult> {
  const candidates = generateCandidates(subject);
  const hits: RawHit[] = [];

  for (const domain of subject.domains.slice(0, 3)) {
    const info = await rdapLookup(domain.replace(/^https?:\/\//, "").split("/")[0]);
    if (info) {
      hits.push({
        source: "domain_lookalike",
        title: `RDAP record for subscriber domain ${domain}`,
        snippet: info,
        url: `https://rdap.org/domain/${domain}`,
        severity: "info",
        matchedKeyword: domain,
      });
    }
  }

  // Cap concurrent checks
  for (const host of candidates) {
    const up = await checkReachable(host);
    if (up) {
      hits.push({
        source: "domain_lookalike",
        title: `Lookalike domain reachable: ${host}`,
        snippet: `Candidate typosquat/brand domain responded to HTTP(S). Manual review recommended — may be unrelated or parked.`,
        url: `https://${host}`,
        severity: "high",
        matchedKeyword: subject.name,
      });
    }
  }

  return { sourceId: "domain_lookalike", hits };
}
