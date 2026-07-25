/**
 * Hunter.io Domain Search — finds the best contact email for a domain.
 * Docs: https://hunter.io/api-documentation/v2#domain-search
 */

const HUNTER_ENDPOINT = "https://api.hunter.io/v2/domain-search";

const MIN_CONFIDENCE = 50;

// Priority of seniorities and departments — most-likely decision-maker first.
const SENIORITY_RANK = { executive: 0, senior: 1, junior: 2 };
const DEPARTMENT_RANK = {
  executive: 0,
  management: 1,
  marketing: 2,
  communication: 3,
  sales: 4,
  it: 5,
  finance: 6,
  hr: 7,
  legal: 8,
  support: 9,
};

/**
 * Best-effort email lookup. Returns a single email string, or null.
 */
export async function findEmail(websiteUrl) {
  const apiKey = process.env.HUNTER_API_KEY;
  if (!apiKey) throw new Error("HUNTER_API_KEY is not set");

  const domain = extractDomain(websiteUrl);
  if (!domain) return null;

  const url = `${HUNTER_ENDPOINT}?domain=${encodeURIComponent(domain)}&api_key=${encodeURIComponent(apiKey)}&limit=10`;

  let response;
  try {
    response = await fetch(url);
  } catch (error) {
    console.warn(`Hunter network error for ${domain}: ${error.message}`);
    return null;
  }

  if (!response.ok) {
    // 404 means no emails for that domain — quiet.
    if (response.status !== 404) {
      const text = await response.text();
      console.warn(
        `Hunter ${response.status} for ${domain}: ${text.slice(0, 200)}`,
      );
    }
    return null;
  }

  const data = await response.json();
  const emails = Array.isArray(data?.data?.emails) ? data.data.emails : [];
  if (emails.length === 0) return null;

  // Sort: highest priority first (lower rank wins).
  const ranked = emails
    .filter((e) => e?.value && (e.confidence ?? 0) >= MIN_CONFIDENCE)
    .map((e) => ({
      value: e.value,
      score:
        (SENIORITY_RANK[e.seniority] ?? 5) * 100 +
        (DEPARTMENT_RANK[e.department] ?? 10) * 10 +
        (100 - (e.confidence ?? 0)),
    }))
    .sort((a, b) => a.score - b.score);

  if (ranked.length > 0) return ranked[0].value;

  // No high-confidence match — fall back to the single highest-confidence email
  // we got, even if it's below MIN_CONFIDENCE.
  const fallback = [...emails]
    .filter((e) => e?.value)
    .sort((a, b) => (b.confidence ?? 0) - (a.confidence ?? 0))[0];
  return fallback?.value ?? null;
}

export function extractDomain(websiteUrl) {
  if (!websiteUrl) return null;
  try {
    const u = new URL(
      websiteUrl.startsWith("http") ? websiteUrl : `https://${websiteUrl}`,
    );
    return u.hostname.toLowerCase().replace(/^www\./, "");
  } catch {
    return null;
  }
}
