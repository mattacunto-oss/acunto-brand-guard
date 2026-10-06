export type Tier = "NIL" | "Team" | "HNWI";
export type Severity = "critical" | "high" | "medium" | "low" | "info";
export type AlertStatus = "new" | "reviewing" | "actioned" | "closed";

export interface Subject {
  id: string;
  name: string;
  aliases: string[];
  handles: string[];
  domains: string[];
  emails: string[];
  keywords: string[];
  notes: string;
  tier: Tier;
  createdAt: string;
  updatedAt: string;
}

export interface Alert {
  id: string;
  subjectId: string;
  source: string;
  title: string;
  snippet: string;
  url: string;
  severity: Severity;
  status: AlertStatus;
  recommendedNextStep: string;
  summary: string;
  createdAt: string;
  matchedKeyword?: string;
}

export interface ScanResult {
  subjectId: string;
  sourcesRun: string[];
  sourcesSkipped: { name: string; reason: string }[];
  alertsCreated: number;
  scannedAt: string;
}

export interface SourceStatus {
  id: string;
  name: string;
  description: string;
  freeTier: boolean;
  envVar?: string;
  signupUrl?: string;
  status: "wired" | "stub" | "needs_key" | "phase2";
  connected: boolean;
}
