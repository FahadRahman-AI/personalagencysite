import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Send a single email via Resend. Always sets a reply-to so direct replies
 * land in the inbox of whoever owns FROM_EMAIL.
 */
export async function sendEmail({ to, subject, body, replyTo }) {
  const fromEmail = process.env.FROM_EMAIL;
  const fromName = process.env.FROM_NAME;

  if (!process.env.RESEND_API_KEY) throw new Error("RESEND_API_KEY is not set");
  if (!fromEmail) throw new Error("FROM_EMAIL is not set");

  const from = fromName ? `${fromName} <${fromEmail}>` : fromEmail;
  const html = textToHtml(body);

  const result = await resend.emails.send({
    from,
    to,
    subject,
    text: body,
    html,
    replyTo: replyTo ?? fromEmail,
  });

  if (result.error) {
    throw new Error(`Resend failed: ${JSON.stringify(result.error)}`);
  }
  return result.data;
}

/**
 * Plain text → simple, neutral HTML. Preserves paragraphs and line breaks
 * without injecting any visual style that screams "marketing template".
 */
function textToHtml(text) {
  const escaped = escapeHtml(text);
  const paragraphs = escaped
    .split(/\n{2,}/)
    .map((p) => p.replace(/\n/g, "<br>"))
    .map(
      (p) =>
        `<p style="margin:0 0 16px;font:15px/1.6 -apple-system,BlinkMacSystemFont,Helvetica,Arial,sans-serif;color:#0a0a0a;">${p}</p>`,
    )
    .join("");
  return `<div style="max-width:560px;">${paragraphs}</div>`;
}

function escapeHtml(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}
