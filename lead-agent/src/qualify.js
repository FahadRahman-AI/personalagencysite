import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

/**
 * Uses Claude to generate a personalised response and 3 qualifying questions
 * for an inbound lead enquiry.
 *
 * @param {Object} lead - Lead data
 * @param {string} lead.name        - Lead's name
 * @param {string} lead.email       - Lead's email address
 * @param {string} lead.enquiryText - Raw enquiry text submitted by the lead
 * @returns {Promise<{ personalizedResponse: string, qualifyingQuestions: string[] }>}
 */
export async function qualifyLead(lead) {
  const { name, email, enquiryText } = lead;

  const systemPrompt = `You are a friendly, professional business development representative for a high-end digital agency.
Your job is to qualify inbound leads by responding warmly, acknowledging their specific enquiry, and asking smart questions that help determine:
1. Budget range
2. Timeline / urgency
3. Decision-making authority and readiness to proceed

Always write in first person as the agency rep. Never mention that you are an AI.
Respond with valid JSON only — no markdown fences, no extra keys.`;

  const userPrompt = `A new lead has submitted an enquiry. Here are the details:

Name: ${name}
Email: ${email}
Enquiry: ${enquiryText}

Generate:
1. A personalised, warm opening response (2–3 sentences) that directly acknowledges what they said and builds rapport.
2. Exactly 3 qualifying questions tailored to their specific enquiry that will help us understand their budget, timeline, and decision-making process.

Return ONLY a JSON object with this exact shape:
{
  "personalizedResponse": "<string>",
  "qualifyingQuestions": ["<question1>", "<question2>", "<question3>"]
}`;

  const message = await client.messages.create({
    model: "claude-opus-4-8",
    max_tokens: 1024,
    messages: [{ role: "user", content: userPrompt }],
    system: systemPrompt,
  });

  const raw = message.content[0].text.trim();
  const parsed = JSON.parse(raw);

  if (
    typeof parsed.personalizedResponse !== "string" ||
    !Array.isArray(parsed.qualifyingQuestions) ||
    parsed.qualifyingQuestions.length !== 3
  ) {
    throw new Error("Claude returned an unexpected response shape");
  }

  return {
    personalizedResponse: parsed.personalizedResponse,
    qualifyingQuestions: parsed.qualifyingQuestions,
  };
}

/**
 * Builds the full HTML email body combining the personalised response,
 * the 3 qualifying questions, and the Calendly booking link.
 */
export function buildQualificationEmail(lead, qualification) {
  const { name } = lead;
  const { personalizedResponse, qualifyingQuestions } = qualification;
  const calendlyLink = process.env.CALENDLY_LINK;
  const fromName = process.env.FROM_NAME;

  const questionsHtml = qualifyingQuestions
    .map((q, i) => `<li style="margin-bottom:8px;">${i + 1}. ${q}</li>`)
    .join("");

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:auto;padding:24px;">
  <p>Hi ${name},</p>

  <p>${personalizedResponse}</p>

  <p>To make sure I can point you in the right direction, I'd love to understand a bit more about your project. Could you help me with the following?</p>

  <ul style="padding-left:20px;line-height:1.8;">
    ${questionsHtml}
  </ul>

  <p>Feel free to reply here, or if it's easier, you can <a href="${calendlyLink}" style="color:#4f46e5;">grab a quick 30-minute call</a> and we can run through everything live.</p>

  <p>Looking forward to hearing from you!</p>

  <p>Warm regards,<br /><strong>${fromName}</strong></p>
</body>
</html>`;
}
