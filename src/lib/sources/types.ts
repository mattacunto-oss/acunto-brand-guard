import type { Subject, Severity } from "../types";

export interface RawHit {
  source: string;
  title: string;
  snippet: string;
  url: string;
  severity: Severity;
  matchedKeyword?: string;
  publishedAt?: string;
}

export interface SourceRunResult {
  sourceId: string;
  hits: RawHit[];
  skipped?: boolean;
  reason?: string;
}

export type SourceRunner = (subject: Subject) => Promise<SourceRunResult>;
