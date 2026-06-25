import nodemailer from "nodemailer";
import { createClient } from "@supabase/supabase-js";

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

function getTransporter() {
  return nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
}

const FROM_NAME = "Fahad — Studio FX";

/**
 * Checks leads that have not replied within 24 hours and sends a follow-up email.
 * Expects a `leads` table in Supabase with columns:
 *   id, name, email, enquiry_text, created_at, replied_at (nullable),
 *   followup_sent_at (nullable), qualification_email_sent_at (nullable)
 */
export async function sendPendingFollowUps() {
  const supabase = getSupabase();

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();

  const { data: leads, error } = await supabase
    .from("leads")
    .select("*")
    .is("replied_at", null)
    .is("followup_sent_at", null)
    .not("qualification_email_sent_at", "is", null)
    .lt("qualification_email_sent_at", cutoff);

  if (error) {
    throw new Error(`Supabase query failed: ${error.message}`);
  }

  if (!leads || leads.length === 0) {
    return { sent: 0, skipped: 0 };
  }

  let sent = 0;
  let skipped = 0;

  for (const lead of leads) {
    try {
      await sendFollowUpEmail(lead);

      const { error: updateError } = await supabase
        .from("leads")
        .update({ followup_sent_at: new Date().toISOString() })
        .eq("id", lead.id);

      if (updateError) {
        console.error(
          `Failed to mark follow-up sent for lead ${lead.id}: ${updateError.message}`
        );
      }

      sent++;
    } catch (err) {
      console.error(`Failed to send follow-up to ${lead.email}: ${err.message}`);
      skipped++;
    }
  }

  return { sent, skipped };
}

async function sendFollowUpEmail(lead) {
  const calendlyLink = process.env.CALENDLY_LINK;
  const html = buildFollowUpHtml(lead, { calendlyLink });

  const transporter = getTransporter();
  await transporter.sendMail({
    from: `"${FROM_NAME}" <${process.env.GMAIL_USER}>`,
    to: lead.email,
    subject: `Just checking in, ${lead.name.split(" ")[0]} 👋`,
    html,
  });
}

function buildFollowUpHtml(lead, { calendlyLink }) {
  const firstName = lead.name.split(" ")[0];

  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8" /><meta name="viewport" content="width=device-width,initial-scale=1" /></head>
<body style="font-family:sans-serif;color:#111;max-width:600px;margin:auto;padding:24px;">
  <p>Hi ${firstName},</p>

  <p>I just wanted to follow up on the enquiry you sent over about <em>${lead.enquiry_text.slice(0, 120)}${lead.enquiry_text.length > 120 ? "…" : ""}</em></p>

  <p>I know inboxes get busy — no worries at all. I just wanted to make sure my previous email didn't get buried, and to let you know I'm still very much keen to help.</p>

  <p>If you'd prefer to talk things through rather than back-and-forth by email, feel free to <a href="${calendlyLink}" style="color:#4f46e5;">grab a quick 30-minute slot here</a> — completely no pressure.</p>

  <p>If now isn't the right time, just let me know and I'll check back in whenever suits you.</p>

  <p>Either way, hope to connect soon!</p>

  <p>Best,<br /><strong>${FROM_NAME}</strong></p>
</body>
</html>`;
}

/**
 * Records a lead reply so they are excluded from future follow-ups.
 * Call this from your inbound email webhook or reply handler.
 */
export async function markLeadReplied(leadId) {
  const supabase = getSupabase();

  const { error } = await supabase
    .from("leads")
    .update({ replied_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) {
    throw new Error(`Failed to mark lead replied: ${error.message}`);
  }
}
