import type { RawHit } from "./sources/types";

export async function summarizeHit(hit: RawHit, subjectName: string): Promise<string> {
  const template = () =>
    `Public mention of ${subjectName} via ${hit.source}: "${hit.title}". Severity draft: ${hit.severity}. Review snippet and source URL before acting.`;

  const openai = process.env.OPENAI_API_KEY;
  const xai = process.env.XAI_API_KEY;
  const gateway = process.env.AI_GATEWAY_API_KEY;

  if (!openai && !xai && !gateway) return template();

  try {
    if (xai || gateway) {
      const key = xai || gateway!;
      const base = xai
        ? "https://api.x.ai/v1/chat/completions"
        : "https://api.openai.com/v1/chat/completions";
      const model = xai ? "grok-beta" : "gpt-4o-mini";
      const res = await fetch(base, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${key}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: "system",
              content:
                "Summarize a public brand-monitoring hit in 1-2 sentences. No legal advice. Flag impersonation/scam risk if present.",
            },
            {
              role: "user",
              content: `Subject: ${subjectName}\nTitle: ${hit.title}\nSnippet: ${hit.snippet}\nSource: ${hit.source}`,
            },
          ],
          max_tokens: 120,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    }
    if (openai) {
      const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${openai}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            {
              role: "system",
              content:
                "Summarize a public brand-monitoring hit in 1-2 sentences. No legal advice.",
            },
            {
              role: "user",
              content: `Subject: ${subjectName}\nTitle: ${hit.title}\nSnippet: ${hit.snippet}`,
            },
          ],
          max_tokens: 120,
        }),
        signal: AbortSignal.timeout(15000),
      });
      if (res.ok) {
        const data = (await res.json()) as {
          choices?: { message?: { content?: string } }[];
        };
        const text = data.choices?.[0]?.message?.content?.trim();
        if (text) return text;
      }
    }
  } catch {
    /* template fallback */
  }
  return template();
}
