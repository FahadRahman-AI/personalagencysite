import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();
const MODEL = "claude-opus-4-7";

/**
 * Initial cold email — strict rules: no "AI" mention, ≤120 words,
 * specific personalised observation in sentence one, end with Calendly link.
 */
const INITIAL_SYSTEM = `You are a copywriter for Studio FX, a Visual Elevation Studio in Birmingham, UK that builds websites, smart systems, and cinematic content for ambitious businesses worldwide.

Your job: write ONE personalised cold outreach email to the business described below.

ABSOLUTE RULES — violating any of these is a complete failure:
1. NEVER use the words "AI", "artificial intelligence", "machine learning", "ML", "neural", "GPT", or "LLM". When you mean automation, say "smart systems", "automated workflows", or "background processes".
2. NEVER use these words: synergy, optimize, transform, leverage, innovative, solution, empower, end-to-end, holistic, seamless, cutting-edge, revolutionary, next-level.
3. NEVER use a generic opener like "I hope this email finds you well", "I came across your website", "Just reaching out", "Quick question".
4. NEVER praise the business in generic terms. Be specific.
5. NEVER invent facts. Only reference what is actually visible in the data provided. If the website was unreachable, work from the business name, category, and review pattern only — do not pretend you read the site.
6. The FIRST SENTENCE must reference ONE specific, concrete observation about THIS exact business — not a general industry comment.
7. The email body must be UNDER 120 WORDS. Count them.
8. End with one clear, low-friction ask and the Calendly link verbatim on its own line.
9. Sound like a real person writing to one real person. Confident, direct, never robotic.
10. NO emoji. NO exclamation marks. NO "Best regards" / "Sincerely" / "Warm wishes".

STRUCTURE (4 short paragraphs, ~25–30 words each):
- Para 1: state the specific observation about their business.
- Para 2: name what we'd do about it — frame as outcomes, not features.
- Para 3: low-friction ask + Calendly link on its own line.
- Para 4: sign-off — exactly "Fahad — Studio FX"

SUBJECT LINE:
- Under 8 words.
- Reference the specific observation (their business name, a missing feature, a competitor advantage).
- Lowercase or sentence case — never Title Case.
- Never clickbait, never hype.

OBSERVATION field (for our internal records):
- One sentence naming the specific gap or opportunity you spotted.
- This is what the follow-up email will reference if they don't reply.

Return ONLY valid JSON that matches the schema. No prose outside the JSON.`;

/**
 * Follow-up — exactly 3 sentences, references the original observation.
 */
const FOLLOWUP_SYSTEM = `You are writing a single follow-up email for Studio FX. The original email got no reply after 5 days. This is the LAST email — there will be no third contact.

ABSOLUTE RULES:
1. NEVER use the words "AI", "artificial intelligence", "machine learning", "ML", "synergy", "optimize", "transform", "leverage", "innovative", "solution".
2. The body must be EXACTLY 3 SENTENCES — not 2, not 4.
3. Sentence 1: acknowledge they're busy, in a human way — no apology, no "sorry to bother".
4. Sentence 2: restate the ONE specific thing we originally noticed about their business (provided to you below) — don't paraphrase it generically.
5. Sentence 3: offer a 15-minute call with the Calendly link verbatim.
6. Subject MUST start with "Re: " followed by the original subject, exactly.
7. Sign off on its own line below the 3 sentences: "Fahad — Studio FX"
8. No emoji. No exclamation marks.

Return ONLY valid JSON matching the schema. No prose outside the JSON.`;

const INITIAL_SCHEMA = {
  type: "object",
  properties: {
    observation: {
      type: "string",
      description:
        "One-sentence description of the specific pain point or gap spotted. Used internally and referenced in the follow-up.",
    },
    subject: {
      type: "string",
      description: "Email subject, under 8 words, sentence case.",
    },
    body: {
      type: "string",
      description:
        "Email body, under 120 words, plain text with line breaks between paragraphs.",
    },
  },
  required: ["observation", "subject", "body"],
  additionalProperties: false,
};

const FOLLOWUP_SCHEMA = {
  type: "object",
  properties: {
    subject: {
      type: "string",
      description: "Original subject prefixed with 'Re: '.",
    },
    body: {
      type: "string",
      description:
        "Body, exactly 3 sentences, plain text with line breaks, signed 'Fahad — Studio FX'.",
    },
  },
  required: ["subject", "body"],
  additionalProperties: false,
};

/**
 * Generate the initial cold email for a freshly discovered business.
 */
export async function generateInitialEmail({
  business,
  website,
  category,
  location,
  calendlyLink,
}) {
  const reviewSummary =
    business.reviewCount && business.reviewCount > 0
      ? `${business.reviewCount} Google reviews, average rating ${business.rating ?? "n/a"}`
      : "Few or no Google reviews";

  const websiteBlock =
    website?.content?.trim().length > 0
      ? website.content
      : `Website could not be accessed (${website?.error ?? "unknown error"}). Work from business name, category, and review pattern only — do NOT invent details about the site.`;

  const userPrompt = `BUSINESS: ${business.businessName}
CATEGORY: ${category}
LOCATION (target): ${location}
ADDRESS: ${business.address ?? "(not provided)"}
REVIEWS: ${reviewSummary}

WEBSITE CONTENT (raw):
---
${websiteBlock}
---

CALENDLY LINK to include verbatim on its own line in the body:
${calendlyLink}

Now: identify ONE specific pain point or gap visible in their site / reviews / category combination. Name it concretely. Then write the email per the rules.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 16_000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "high",
      format: { type: "json_schema", schema: INITIAL_SCHEMA },
    },
    system: [
      {
        type: "text",
        text: INITIAL_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  return parseJsonResponse(response);
}

/**
 * Generate a 3-sentence follow-up referencing the original observation.
 */
export async function generateFollowUpEmail({ lead, calendlyLink }) {
  const observation =
    lead.observation?.trim() ||
    "the specific gap we mentioned in the first email";

  const userPrompt = `ORIGINAL SUBJECT: ${lead.initial_subject ?? "(unknown)"}
ORIGINAL OBSERVATION we made about ${lead.business_name}:
${observation}

CALENDLY LINK to include verbatim:
${calendlyLink}

Now write the 3-sentence follow-up per the rules. Subject starts with "Re: " + original subject.`;

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 8_000,
    thinking: { type: "adaptive" },
    output_config: {
      effort: "medium",
      format: { type: "json_schema", schema: FOLLOWUP_SCHEMA },
    },
    system: [
      {
        type: "text",
        text: FOLLOWUP_SYSTEM,
        cache_control: { type: "ephemeral" },
      },
    ],
    messages: [{ role: "user", content: userPrompt }],
  });

  return parseJsonResponse(response);
}

/**
 * Structured outputs guarantee valid JSON in the first text block.
 * We still defend against partial / mid-stream parses just in case.
 */
function parseJsonResponse(response) {
  const textBlock = response.content.find((b) => b.type === "text");
  if (!textBlock) throw new Error("Claude response had no text block");

  const raw = textBlock.text.trim();
  try {
    return JSON.parse(raw);
  } catch {
    const match = raw.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch (inner) {
        throw new Error(`Could not parse Claude JSON: ${inner.message}`);
      }
    }
    throw new Error(
      `Claude returned non-JSON: ${raw.slice(0, 200)}`,
    );
  }
}
