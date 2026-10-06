import type { Severity } from "./types";

/** Educational playbook text — not legal advice. */
export function recommendedNextStep(severity: Severity, source: string): string {
  const base =
    "This is educational guidance, not legal advice. Consult qualified counsel before sending notices or escalating.";

  switch (severity) {
    case "critical":
      return `${base} Priority: preserve evidence (screenshots + URLs + timestamps), notify the subscriber’s authorized contact, and use the platform’s official report flow for threats, doxxing, or active scams. Consider counsel for emergency relief if there is a credible safety risk. Do not confront the poster personally.`;
    case "high":
      return `${base} For impersonation or lookalike domains: report via the platform’s impersonation/abuse form and the registrar’s abuse contact (RDAP/WHOIS). For deepfakes or fake merch: use copyright/trademark reporting tools where applicable. Document chain of custody.`;
    case "medium":
      return `${base} Monitor for escalation. If harassment or coordinated pile-on continues, use platform report tools and consider a measured public statement drafted by the subscriber’s PR/agent — never engage trolls directly.`;
    case "low":
      return `${base} Log and trend. No immediate action unless volume spikes or severity rises. Include in weekly digest.`;
    default:
      return `${base} Informational mention from ${source}. No action required unless context changes.`;
  }
}
