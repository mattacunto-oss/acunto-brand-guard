import type { SourceStatus } from "./types";

export function getSourceStatuses(): SourceStatus[] {
  return [
    {
      id: "news_rss",
      name: "Google News RSS",
      description: "Public RSS search queries for subject name mentions in news.",
      freeTier: true,
      status: "wired",
      connected: true,
      signupUrl: "https://news.google.com/",
    },
    {
      id: "newsapi",
      name: "NewsAPI.org",
      description: "Structured news search API.",
      freeTier: true,
      envVar: "NEWS_API_KEY",
      signupUrl: "https://newsapi.org/register",
      status: process.env.NEWS_API_KEY ? "wired" : "needs_key",
      connected: Boolean(process.env.NEWS_API_KEY),
    },
    {
      id: "reddit",
      name: "Reddit public JSON",
      description: "Public search.json mentions (rate-limited).",
      freeTier: true,
      status: "wired",
      connected: true,
      signupUrl: "https://www.reddit.com/dev/api",
    },
    {
      id: "twitter",
      name: "X / Twitter API v2",
      description: "Official recent search.",
      freeTier: false,
      envVar: "TWITTER_BEARER_TOKEN",
      signupUrl: "https://developer.x.com/",
      status: process.env.TWITTER_BEARER_TOKEN ? "wired" : "needs_key",
      connected: Boolean(process.env.TWITTER_BEARER_TOKEN),
    },
    {
      id: "domain_lookalike",
      name: "Domain lookalikes + RDAP",
      description: "Typosquat candidates + public RDAP for listed domains.",
      freeTier: true,
      status: "wired",
      connected: true,
      signupUrl: "https://about.rdap.org/",
    },
    {
      id: "hibp",
      name: "Have I Been Pwned",
      description: "Breach check only for subscriber-provided emails.",
      freeTier: false,
      envVar: "HIBP_API_KEY",
      signupUrl: "https://haveibeenpwned.com/API/Key",
      status: process.env.HIBP_API_KEY ? "wired" : "needs_key",
      connected: Boolean(process.env.HIBP_API_KEY),
    },
    {
      id: "edgar",
      name: "SEC EDGAR",
      description: "Public filings search for company-like subjects.",
      freeTier: true,
      status: "wired",
      connected: true,
      signupUrl: "https://www.sec.gov/edgar/search/",
    },
    {
      id: "opencorporates",
      name: "OpenCorporates",
      description: "Public company registry search.",
      freeTier: true,
      envVar: "OPENCORPORATES_API_TOKEN",
      signupUrl: "https://opencorporates.com/api_accounts/new",
      status: "wired",
      connected: Boolean(process.env.OPENCORPORATES_API_TOKEN) || true,
    },
    {
      id: "paste_sites",
      name: "Paste-site search",
      description: "Deferred until a legitimate API is available.",
      freeTier: false,
      status: "phase2",
      connected: false,
    },
    {
      id: "ai_summary",
      name: "AI summarization",
      description: "Optional LLM summaries of hits.",
      freeTier: false,
      envVar: "OPENAI_API_KEY | XAI_API_KEY | AI_GATEWAY_API_KEY",
      status:
        process.env.OPENAI_API_KEY || process.env.XAI_API_KEY || process.env.AI_GATEWAY_API_KEY
          ? "wired"
          : "needs_key",
      connected: Boolean(
        process.env.OPENAI_API_KEY || process.env.XAI_API_KEY || process.env.AI_GATEWAY_API_KEY
      ),
      signupUrl: "https://platform.openai.com/ | https://console.x.ai/",
    },
  ];
}
