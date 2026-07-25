import {
  getLeadsForFollowUp,
  saveEmail,
  updateLeadStatus,
} from "./database.js";
import { generateFollowUpEmail } from "./personaliser.js";
import { sendEmail } from "./sender.js";

const SEND_DELAY_MS = Number(process.env.SEND_DELAY_MS ?? 2_000);

/**
 * Find every lead that is past the 5-day mark with no follow-up and no reply,
 * generate a 3-sentence follow-up, send it, record the email, then move the
 * lead's status to 'follow_up_sent' so it never qualifies again.
 */
export async function processFollowUps() {
  const calendlyLink = process.env.CALENDLY_LINK;
  if (!calendlyLink) throw new Error("CALENDLY_LINK is not set");

  const leads = await getLeadsForFollowUp();
  console.log(`[follow-ups] ${leads.length} leads eligible`);

  let sent = 0;
  let failed = 0;

  for (const lead of leads) {
    try {
      const { subject, body } = await generateFollowUpEmail({
        lead,
        calendlyLink,
      });

      const sendResult = await sendEmail({ to: lead.email, subject, body });

      await saveEmail(lead.id, {
        kind: "follow_up",
        subject,
        body,
        resendId: sendResult?.id ?? null,
      });

      await updateLeadStatus(lead.id, "follow_up_sent");

      sent++;
      console.log(`[follow-up] sent to ${lead.business_name} <${lead.email}>`);
      await sleep(SEND_DELAY_MS);
    } catch (error) {
      failed++;
      console.error(
        `[follow-up] failed for lead ${lead.id} (${lead.business_name}): ${error.message}`,
      );
    }
  }

  console.log(
    `[follow-ups] done — sent: ${sent}, failed: ${failed}, total: ${leads.length}`,
  );
  return { sent, failed, total: leads.length };
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
