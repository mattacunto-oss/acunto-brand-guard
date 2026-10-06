import fs from "fs";
import path from "path";
import { randomUUID } from "crypto";
import type { Alert, Subject, AlertStatus, Severity, Tier } from "./types";
import { recommendedNextStep } from "./playbook";

interface DbShape {
  subjects: Subject[];
  alerts: Alert[];
  seeded: boolean;
}

const globalForStore = globalThis as unknown as { __abgStore?: DbShape };

function defaultDb(): DbShape {
  return { subjects: [], alerts: [], seeded: false };
}

function dataPath(): string | null {
  // Writable local path; on Vercel serverless /tmp is writable but ephemeral
  if (process.env.VERCEL) {
    return path.join("/tmp", "abg-store.json");
  }
  return path.join(process.cwd(), "data", "store.json");
}

function load(): DbShape {
  if (globalForStore.__abgStore) return globalForStore.__abgStore;
  const p = dataPath();
  try {
    if (p && fs.existsSync(p)) {
      const raw = fs.readFileSync(p, "utf8");
      const parsed = JSON.parse(raw) as DbShape;
      globalForStore.__abgStore = parsed;
      return parsed;
    }
  } catch {
    /* fall through */
  }
  const db = defaultDb();
  globalForStore.__abgStore = db;
  return db;
}

function save(db: DbShape) {
  globalForStore.__abgStore = db;
  const p = dataPath();
  if (!p) return;
  try {
    fs.mkdirSync(path.dirname(p), { recursive: true });
    fs.writeFileSync(p, JSON.stringify(db, null, 2));
  } catch {
    /* memory-only fallback */
  }
}

function seedIfNeeded() {
  const db = load();
  if (db.seeded && db.subjects.length > 0) return db;

  const now = new Date().toISOString();
  const subjects: Subject[] = [
    {
      id: "sub-demo-rivera",
      name: "Jordan Rivera",
      aliases: ["J. Rivera", "JR7"],
      handles: ["@jordanrivera_demo", "jordanrivera"],
      domains: ["jordanrivera-demo.example"],
      emails: [],
      keywords: ["Jordan Rivera", "JR7 NIL", "Rivera deepfake", "Rivera merch scam"],
      notes: "Fictional ACC basketball NIL demo athlete. Parent/guardian or authorized agent required for real NIL minors.",
      tier: "NIL",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "sub-demo-harbor",
      name: "Harbor City FC",
      aliases: ["HCFC", "Harbor City Football"],
      handles: ["@HarborCityFC_demo"],
      domains: ["harborcityfc-demo.example"],
      emails: ["press@harborcityfc-demo.example"],
      keywords: ["Harbor City FC", "HCFC tickets scam", "Harbor City fake merch"],
      notes: "Fictional pro soccer club for team-tier demos.",
      tier: "Team",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "sub-demo-chen",
      name: "Alexandra Chen Family Office",
      aliases: ["A. Chen FO", "Chen Family Office"],
      handles: [],
      domains: ["chenfo-demo.example"],
      emails: ["ops@chenfo-demo.example"],
      keywords: ["Alexandra Chen", "Chen Family Office", "Chen phishing"],
      notes: "Fictional HNWI / family office principal for discreet monitoring demos.",
      tier: "HNWI",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "sub-demo-tide",
      name: "Maya Okonkwo",
      aliases: ["M. Okonkwo", "Maya O"],
      handles: ["@mayaokonkwo_demo"],
      domains: [],
      emails: [],
      keywords: ["Maya Okonkwo", "Okonkwo NIL", "Maya O endorsement"],
      notes: "Fictional track & field NIL athlete (Virginia / ACC adjacent demo).",
      tier: "NIL",
      createdAt: now,
      updatedAt: now,
    },
    {
      id: "sub-demo-agency",
      name: "Atlantic Talent Partners",
      aliases: ["ATP Agency"],
      handles: ["@AtlanticTalent_demo"],
      domains: ["atlantictalent-demo.example"],
      emails: ["hello@atlantictalent-demo.example"],
      keywords: ["Atlantic Talent Partners", "ATP Agency roster"],
      notes: "Fictional talent agency covering a multi-athlete roster.",
      tier: "Team",
      createdAt: now,
      updatedAt: now,
    },
  ];

  const alerts: Alert[] = [
    {
      id: "alert-1",
      subjectId: "sub-demo-rivera",
      source: "news_rss",
      title: "[DEMO] Blog post claims exclusive Jordan Rivera NIL deal",
      snippet:
        "A sports blog republished an unverified claim that Jordan Rivera signed with a crypto sponsor. No official confirmation found.",
      url: "https://example.com/demo/rivera-nil-claim",
      severity: "medium",
      status: "new",
      recommendedNextStep: recommendedNextStep("medium", "news_rss"),
      summary: "Unverified NIL sponsorship claim circulating in public blogs.",
      createdAt: now,
      matchedKeyword: "Jordan Rivera",
    },
    {
      id: "alert-2",
      subjectId: "sub-demo-rivera",
      source: "domain_lookalike",
      title: "[DEMO] Lookalike domain resolving: jordanrivera-official-shop.example",
      snippet:
        "Typosquat generator flagged a candidate domain that returned HTTP 200 with a storefront template mentioning Rivera merch.",
      url: "https://jordanrivera-official-shop.example",
      severity: "high",
      status: "new",
      recommendedNextStep: recommendedNextStep("high", "domain_lookalike"),
      summary: "Possible fake merch storefront on a lookalike domain.",
      createdAt: now,
      matchedKeyword: "jordanrivera",
    },
    {
      id: "alert-3",
      subjectId: "sub-demo-harbor",
      source: "reddit",
      title: "[DEMO] r/soccer thread: Harbor City FC ticket phishing warning",
      snippet:
        "Fans report DMs offering 'VIP tickets' via a shortened link. Thread is public discussion of a scam pattern.",
      url: "https://www.reddit.com/r/soccer/comments/demo_harbor_tickets",
      severity: "high",
      status: "reviewing",
      recommendedNextStep: recommendedNextStep("high", "reddit"),
      summary: "Public reports of ticket phishing targeting Harbor City FC fans.",
      createdAt: now,
      matchedKeyword: "Harbor City FC",
    },
    {
      id: "alert-4",
      subjectId: "sub-demo-chen",
      source: "news_rss",
      title: "[DEMO] Local society page mentions Chen Family Office real-estate bid",
      snippet:
        "Public society column references a family office interest in a waterfront parcel. Low risk reputation mention.",
      url: "https://example.com/demo/chen-society",
      severity: "info",
      status: "closed",
      recommendedNextStep: recommendedNextStep("info", "news_rss"),
      summary: "Benign public mention; logged for trend awareness.",
      createdAt: now,
      matchedKeyword: "Chen Family Office",
    },
    {
      id: "alert-5",
      subjectId: "sub-demo-tide",
      source: "reddit",
      title: "[DEMO] Impersonation handle discussed in NIL subreddit",
      snippet:
        "Users note an account using Maya Okonkwo’s name promoting giveaways. Discussion is public; account not verified here.",
      url: "https://www.reddit.com/r/CollegeBasketball/comments/demo_maya",
      severity: "critical",
      status: "new",
      recommendedNextStep: recommendedNextStep("critical", "reddit"),
      summary: "Possible impersonation / giveaway scam using athlete name.",
      createdAt: now,
      matchedKeyword: "Maya Okonkwo",
    },
  ];

  db.subjects = subjects;
  db.alerts = alerts;
  db.seeded = true;
  save(db);
  return db;
}

export function listSubjects(): Subject[] {
  return seedIfNeeded().subjects;
}

export function getSubject(id: string): Subject | undefined {
  return seedIfNeeded().subjects.find((s) => s.id === id);
}

export function createSubject(input: {
  name: string;
  aliases?: string[];
  handles?: string[];
  domains?: string[];
  emails?: string[];
  keywords?: string[];
  notes?: string;
  tier: Tier;
}): Subject {
  const db = seedIfNeeded();
  const now = new Date().toISOString();
  const subject: Subject = {
    id: randomUUID(),
    name: input.name.trim(),
    aliases: input.aliases ?? [],
    handles: input.handles ?? [],
    domains: input.domains ?? [],
    emails: input.emails ?? [],
    keywords: input.keywords?.length
      ? input.keywords
      : [input.name.trim(), ...(input.aliases ?? [])],
    notes: input.notes ?? "",
    tier: input.tier,
    createdAt: now,
    updatedAt: now,
  };
  db.subjects.unshift(subject);
  save(db);
  return subject;
}

export function listAlerts(opts?: {
  subjectId?: string;
  severity?: Severity;
  status?: AlertStatus;
}): Alert[] {
  let alerts = seedIfNeeded().alerts;
  if (opts?.subjectId) alerts = alerts.filter((a) => a.subjectId === opts.subjectId);
  if (opts?.severity) alerts = alerts.filter((a) => a.severity === opts.severity);
  if (opts?.status) alerts = alerts.filter((a) => a.status === opts.status);
  return [...alerts].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

export function getAlert(id: string): Alert | undefined {
  return seedIfNeeded().alerts.find((a) => a.id === id);
}

export function updateAlertStatus(id: string, status: AlertStatus): Alert | undefined {
  const db = seedIfNeeded();
  const alert = db.alerts.find((a) => a.id === id);
  if (!alert) return undefined;
  alert.status = status;
  save(db);
  return alert;
}

export function addAlert(
  partial: Omit<Alert, "id" | "createdAt" | "recommendedNextStep"> & {
    recommendedNextStep?: string;
  }
): Alert {
  const db = seedIfNeeded();
  const alert: Alert = {
    ...partial,
    id: randomUUID(),
    createdAt: new Date().toISOString(),
    recommendedNextStep:
      partial.recommendedNextStep ??
      recommendedNextStep(partial.severity, partial.source),
  };
  db.alerts.unshift(alert);
  save(db);
  return alert;
}

export function resetDemoData() {
  const db = defaultDb();
  globalForStore.__abgStore = db;
  save(db);
  return seedIfNeeded();
}
