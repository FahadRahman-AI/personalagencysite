import "dotenv/config";
import express from "express";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { qualifyLead, buildQualificationEmail } from "./qualify.js";
import { sendPendingFollowUps, markLeadReplied } from "./followup.js";

const app = express();
app.use(express.json());

const PORT = process.env.PORT || 3001;

function getSupabase() {
  return createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
}

function validateEnv() {
  const required = [
    "ANTHROPIC_API_KEY",
    "RESEND_API_KEY",
    "SUPABASE_URL",
    "SUPABASE_ANON_KEY",
    "CALENDLY_LINK",
    "FROM_EMAIL",
    "FROM_NAME",
  ];
  const missing = required.filter((k) => !process.env[k]);
  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(", ")}`);
  }
}

// ---------------------------------------------------------------------------
// POST /leads  — Ingest a new lead, qualify it with Claude, send first email
// ---------------------------------------------------------------------------
app.post("/leads", async (req, res) => {
  const { name, email, enquiryText } = req.body;

  if (!name || !email || !enquiryText) {
    return res.status(400).json({ error: "name, email, and enquiryText are required" });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  try {
    const supabase = getSupabase();

    // Persist the lead before sending anything
    const { data: lead, error: insertError } = await supabase
      .from("leads")
      .insert({
        name,
        email,
        enquiry_text: enquiryText,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (insertError) {
      console.error("Supabase insert error:", insertError);
      return res.status(500).json({ error: "Failed to store lead" });
    }

    // Generate personalised response + qualifying questions via Claude
    const qualification = await qualifyLead({ name, email, enquiryText });

    // Build and send the qualification email via Resend
    const html = buildQualificationEmail({ name, email, enquiryText }, qualification);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error: emailError } = await resend.emails.send({
      from: `${process.env.FROM_NAME} <${process.env.FROM_EMAIL}>`,
      to: email,
      subject: `Re: your enquiry — let's talk, ${name.split(" ")[0]}!`,
      html,
    });

    if (emailError) {
      console.error("Resend error:", emailError);
      // Don't block — lead is stored; flag for manual review
      await supabase
        .from("leads")
        .update({ email_error: JSON.stringify(emailError) })
        .eq("id", lead.id);

      return res.status(207).json({
        message: "Lead stored but qualification email failed to send",
        leadId: lead.id,
        qualification,
      });
    }

    // Mark qualification email as sent
    await supabase
      .from("leads")
      .update({ qualification_email_sent_at: new Date().toISOString() })
      .eq("id", lead.id);

    return res.status(201).json({
      message: "Lead qualified and email sent",
      leadId: lead.id,
      qualification,
    });
  } catch (err) {
    console.error("Error processing lead:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /leads/:id/reply  — Mark a lead as having replied (stops follow-ups)
// ---------------------------------------------------------------------------
app.post("/leads/:id/reply", async (req, res) => {
  const { id } = req.params;

  try {
    await markLeadReplied(id);
    return res.json({ message: "Lead marked as replied" });
  } catch (err) {
    console.error("Error marking lead replied:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// POST /followups/run  — Trigger follow-up sweep (call via cron or scheduler)
// ---------------------------------------------------------------------------
app.post("/followups/run", async (req, res) => {
  try {
    const result = await sendPendingFollowUps();
    return res.json({
      message: "Follow-up sweep complete",
      sent: result.sent,
      skipped: result.skipped,
    });
  } catch (err) {
    console.error("Error running follow-ups:", err);
    return res.status(500).json({ error: err.message });
  }
});

// ---------------------------------------------------------------------------
// GET /health
// ---------------------------------------------------------------------------
app.get("/health", (_req, res) => {
  res.json({ status: "ok", service: "lead-agent", timestamp: new Date().toISOString() });
});

// ---------------------------------------------------------------------------
// Start
// ---------------------------------------------------------------------------
try {
  validateEnv();
} catch (err) {
  console.error("Environment validation failed:", err.message);
  process.exit(1);
}

app.listen(PORT, () => {
  console.log(`lead-agent running on port ${PORT}`);
});
