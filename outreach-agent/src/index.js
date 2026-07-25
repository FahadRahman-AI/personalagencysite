import "dotenv/config";
import cron from "node-cron";

import { findLeads } from "./leads.js";
import { scrapeWebsite } from "./scraper.js";
import { findEmail } from "./emailFinder.js";
import { generateInitialEmail } from "./personaliser.js";
import { sendEmail } from "./sender.js";
import {
  checkAlreadyContacted,
  saveLead,
  saveEmail,
  updateLeadStatus,
  logAgentRun,
} from "./database.js";
import { processFollowUps } from "./followUp.js";

// ── Rotation tables (from the brief) ─────────────────────────────────────

const DAILY_CATEGORIES = {
  0: ["hotels", "B&Bs", "hospitality"], //                  Sunday
  1: ["restaurants", "cafes", "food businesses"], //        Monday
  2: ["gyms", "personal trainers", "wellness studios"], //  Tuesday
  3: ["law firms", "accountants", "consultancies"], //      Wednesday
  4: ["estate agents", "property businesses"], //           Thursday
  5: ["retail shops", "boutiques", "independent brands"], //Friday
  6: ["clinics", "dentists", "medical practices"], //       Saturday
};

const WEEKLY_LOCATIONS = {
  1: ["Birmingham", "Solihull", "Coventry"],
  2: ["Shoreditch London", "Soho London", "Marylebone London", "Clapham London"],
  3: ["Manchester", "Leeds", "Sheffield"],
  4: ["Dubai", "Abu Dhabi"],
};

// ── Tunables ─────────────────────────────────────────────────────────────

const MAX_LEADS_PER_RUN = Number(process.env.MAX_LEADS_PER_RUN ?? 25);
const MAX_SENDS_PER_RUN = Number(process.env.MAX_SENDS_PER_RUN ?? 12);
const SEND_DELAY_MS = Number(process.env.SEND_DELAY_MS ?? 3_000);
const CRON_SCHEDULE = process.env.CRON_SCHEDULE ?? "0 9 * * *";
const CRON_TIMEZONE = process.env.CRON_TIMEZONE ?? "Europe/London";

// ── Rotation helpers ─────────────────────────────────────────────────────

export function pickCategory(date = new Date()) {
  const opts = DAILY_CATEGORIES[date.getDay()];
  return opts[Math.floor(Math.random() * opts.length)];
}

export function pickLocation(date = new Date()) {
  const slot = ((isoWeek(date) - 1) % 4) + 1;
  const opts = WEEKLY_LOCATIONS[slot];
  return opts[Math.floor(Math.random() * opts.length)];
}

function isoWeek(d) {
  const date = new Date(Date.UTC(d.getFullYear(), d.getMonth(), d.getDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86_400_000 + 1) / 7);
}

// ── Main outreach cycle ──────────────────────────────────────────────────

export async function runOutreachCycle() {
  const now = new Date();
  const category = pickCategory(now);
  const location = pickLocation(now);
  console.log(
    `[${now.toISOString()}] outreach cycle — "${category}" in "${location}"`,
  );

  let businesses;
  try {
    businesses = await findLeads(category, location, MAX_LEADS_PER_RUN);
  } catch (error) {
    console.error(`[leads] discovery failed: ${error.message}`);
    return {
      category,
      location,
      sent: 0,
      skipped: 0,
      failed: 0,
      total: 0,
      error: error.message,
    };
  }

  console.log(`[leads] ${businesses.length} candidate businesses with websites`);

  let sent = 0;
  let skipped = 0;
  let failed = 0;

  for (const business of businesses) {
    if (sent >= MAX_SENDS_PER_RUN) {
      console.log(`[cap] reached MAX_SENDS_PER_RUN (${MAX_SENDS_PER_RUN}) — stopping`);
      break;
    }

    try {
      // 1. Dedupe by place_id BEFORE we burn Hunter credits / Claude tokens.
      if (await checkAlreadyContacted({ placeId: business.placeId })) {
        skipped++;
        continue;
      }

      // 2. Find an email — skip silently if none available.
      const email = await findEmail(business.website);
      if (!email) {
        skipped++;
        console.log(`[skip] no email for ${business.businessName}`);
        continue;
      }

      // 3. Dedupe by email too (different place_id, same operator).
      if (await checkAlreadyContacted({ email })) {
        skipped++;
        continue;
      }

      // 4. Scrape the website (best-effort, never throws).
      const website = await scrapeWebsite(business.website);

      // 5. Personalise via Claude.
      const { observation, subject, body } = await generateInitialEmail({
        business,
        website,
        category,
        location,
        calendlyLink: process.env.CALENDLY_LINK,
      });

      console.log(
        `[send] → ${business.businessName} <${email}>\n        observation: ${observation}`,
      );

      // 6. Save lead FIRST as 'discovered' — claims the row so we never
      //    double-contact even if send fails partway through.
      const lead = await saveLead({
        ...business,
        email,
        category,
        location,
        observation,
        status: "discovered",
      });

      // 7. Send.
      const sendResult = await sendEmail({ to: email, subject, body });

      // 8. Record the email and transition status to 'contacted'.
      await saveEmail(lead.id, {
        kind: "initial",
        subject,
        body,
        resendId: sendResult?.id ?? null,
      });
      await updateLeadStatus(lead.id, "contacted");

      sent++;
      await sleep(SEND_DELAY_MS);
    } catch (error) {
      failed++;
      console.error(`[fail] ${business.businessName}: ${error.message}`);
    }
  }

  console.log(
    `[outreach] done — sent: ${sent}, skipped: ${skipped}, failed: ${failed}`,
  );
  return { category, location, sent, skipped, failed, total: businesses.length };
}

// ── Composite runs ───────────────────────────────────────────────────────

async function runFollowUpsCycle() {
  try {
    return await processFollowUps();
  } catch (error) {
    console.error(`[follow-ups] cycle failed: ${error.message}`);
    return { sent: 0, failed: 0, total: 0, error: error.message };
  }
}

async function runAll() {
  const startedAt = Date.now();
  console.log(`\n────── ${new Date().toISOString()} ──────`);

  const outreach = await runOutreachCycle();
  const followUps = await runFollowUpsCycle();

  try {
    await logAgentRun({
      category: outreach.category ?? null,
      location: outreach.location ?? null,
      candidatesFound: outreach.total ?? 0,
      sent: outreach.sent ?? 0,
      skipped: outreach.skipped ?? 0,
      failed: outreach.failed ?? 0,
      followUpsSent: followUps.sent ?? 0,
      followUpsFailed: followUps.failed ?? 0,
      durationMs: Date.now() - startedAt,
      error: outreach.error ?? followUps.error ?? null,
    });
  } catch (error) {
    console.error(`[log] logAgentRun failed: ${error.message}`);
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// ── Required env validation ──────────────────────────────────────────────

function assertEnv() {
  const required = [
    "ANTHROPIC_API_KEY",
    "RESEND_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "GOOGLE_MAPS_API_KEY",
    "HUNTER_API_KEY",
    "CALENDLY_LINK",
    "FROM_EMAIL",
    "FROM_NAME",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    console.error(`Missing required env vars: ${missing.join(", ")}`);
    process.exit(1);
  }
}

// ── CLI entry ────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
const isOnce = args.includes("--once");
const isOutreachOnly = args.includes("--outreach-only");
const isFollowupsOnly = args.includes("--followups-only");

assertEnv();

if (isOutreachOnly) {
  runOutreachCycle().then(() => process.exit(0));
} else if (isFollowupsOnly) {
  runFollowUpsCycle().then(() => process.exit(0));
} else if (isOnce) {
  runAll().then(() => process.exit(0));
} else {
  cron.schedule(CRON_SCHEDULE, runAll, { timezone: CRON_TIMEZONE });
  console.log(
    `[boot] scheduled — pattern "${CRON_SCHEDULE}" timezone "${CRON_TIMEZONE}"`,
  );
  console.log(
    `[boot] caps — leads/run: ${MAX_LEADS_PER_RUN}, sends/run: ${MAX_SENDS_PER_RUN}, delay: ${SEND_DELAY_MS}ms`,
  );
}
