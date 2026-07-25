import { createClient } from "@supabase/supabase-js";

/*
 * ── Supabase schema ─────────────────────────────────────────────────────
 * Run this once in the Supabase SQL editor before starting the agent.
 *
 *   create table if not exists leads (
 *     id            bigserial primary key,
 *     place_id      text unique,
 *     business_name text not null,
 *     website       text,
 *     email         text,
 *     category      text,
 *     location      text,
 *     address       text,
 *     rating        numeric,
 *     review_count  integer,
 *     observation   text,
 *     status        text not null default 'discovered',
 *     created_at    timestamptz default now(),
 *     updated_at    timestamptz default now()
 *   );
 *
 *   create unique index if not exists leads_email_unique
 *     on leads (lower(email)) where email is not null;
 *
 *   create table if not exists emails (
 *     id        bigserial primary key,
 *     lead_id   bigint not null references leads(id) on delete cascade,
 *     kind      text not null check (kind in ('initial', 'follow_up')),
 *     subject   text,
 *     body      text,
 *     resend_id text,
 *     sent_at   timestamptz default now()
 *   );
 *
 *   create index if not exists emails_lead_id_idx on emails (lead_id);
 *   create index if not exists emails_kind_sent_idx on emails (kind, sent_at);
 *
 *   create table if not exists agent_runs (
 *     id                bigserial primary key,
 *     ran_at            timestamptz default now(),
 *     category          text,
 *     location          text,
 *     candidates_found  integer,
 *     sent              integer default 0,
 *     skipped           integer default 0,
 *     failed            integer default 0,
 *     follow_ups_sent   integer default 0,
 *     follow_ups_failed integer default 0,
 *     duration_ms       integer,
 *     error             text
 *   );
 *
 *   create index if not exists agent_runs_ran_at_idx on agent_runs (ran_at desc);
 * ──────────────────────────────────────────────────────────────────────
 *
 * Status values used by updateLeadStatus:
 *   discovered     — saved by saveLead, no email sent yet
 *   contacted      — initial email sent
 *   follow_up_sent — single follow-up has gone out
 *   replied        — manually marked when a reply lands in the inbox
 *   bounced        — Resend reported the address as undeliverable
 */

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error(
    "SUPABASE_URL and SUPABASE_ANON_KEY must be set — see .env.example",
  );
}

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
});

const FOLLOW_UP_AGE_MS = 5 * 24 * 60 * 60 * 1000;

/**
 * Insert a discovered business as a lead. Status defaults to 'discovered'
 * (no email sent yet). Returns the saved row including its new `id`.
 */
export async function saveLead(lead) {
  const row = {
    place_id: lead.placeId ?? null,
    business_name: lead.businessName,
    website: lead.website ?? null,
    email: lead.email ? lead.email.toLowerCase().trim() : null,
    category: lead.category ?? null,
    location: lead.location ?? null,
    address: lead.address ?? null,
    rating: lead.rating ?? null,
    review_count: lead.reviewCount ?? null,
    observation: lead.observation ?? null,
    status: lead.status ?? "discovered",
  };

  const { data, error } = await supabase
    .from("leads")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`saveLead failed: ${error.message}`);
  return data;
}

/**
 * Update a lead's status and bump its updated_at timestamp.
 * Valid statuses: 'discovered', 'contacted', 'follow_up_sent', 'replied',
 * 'bounced'.
 */
export async function updateLeadStatus(leadId, status) {
  const { error } = await supabase
    .from("leads")
    .update({ status, updated_at: new Date().toISOString() })
    .eq("id", leadId);

  if (error) throw new Error(`updateLeadStatus failed: ${error.message}`);
}

/**
 * Record an outbound email tied to a lead.
 * `kind` must be 'initial' or 'follow_up'. `resendId` is optional and lets
 * you trace back to the Resend message ID.
 */
export async function saveEmail(leadId, { kind, subject, body, resendId }) {
  if (kind !== "initial" && kind !== "follow_up") {
    throw new Error(`saveEmail: kind must be 'initial' or 'follow_up', got '${kind}'`);
  }

  const { data, error } = await supabase
    .from("emails")
    .insert({
      lead_id: leadId,
      kind,
      subject: subject ?? null,
      body: body ?? null,
      resend_id: resendId ?? null,
    })
    .select()
    .single();

  if (error) throw new Error(`saveEmail failed: ${error.message}`);
  return data;
}

/**
 * Has this business already been contacted? Matches by place_id OR email.
 * Either argument may be omitted; if both are absent, returns false.
 */
export async function checkAlreadyContacted({ placeId, email } = {}) {
  if (placeId) {
    const { data, error } = await supabase
      .from("leads")
      .select("id")
      .eq("place_id", placeId)
      .maybeSingle();
    if (error && error.code !== "PGRST116") {
      throw new Error(`checkAlreadyContacted failed: ${error.message}`);
    }
    if (data) return true;
  }

  if (email) {
    const normalised = email.toLowerCase().trim();
    const { data, error } = await supabase
      .from("leads")
      .select("id")
      .eq("email", normalised)
      .maybeSingle();
    if (error && error.code !== "PGRST116") {
      throw new Error(`checkAlreadyContacted failed: ${error.message}`);
    }
    if (data) return true;
  }

  return false;
}

/**
 * Leads that need a follow-up: status = 'contacted', they have an initial
 * email sent more than 5 days ago, no follow-up has been sent.
 *
 * Returns rows shaped like the lead, with `initial_subject` and
 * `initial_sent_at` flattened on for the personaliser to reference.
 */
export async function getLeadsForFollowUp() {
  const cutoff = new Date(Date.now() - FOLLOW_UP_AGE_MS).toISOString();

  // Inner join with the emails table, filtered to initial emails older
  // than the cutoff. status='contacted' already excludes leads that have
  // had a follow-up sent ('follow_up_sent') or replied ('replied').
  const { data, error } = await supabase
    .from("leads")
    .select(`
      id,
      place_id,
      business_name,
      website,
      email,
      category,
      location,
      address,
      rating,
      review_count,
      observation,
      status,
      created_at,
      emails!inner ( id, kind, subject, sent_at )
    `)
    .eq("status", "contacted")
    .eq("emails.kind", "initial")
    .lt("emails.sent_at", cutoff)
    .not("email", "is", null)
    .order("created_at", { ascending: true })
    .limit(50);

  if (error) throw new Error(`getLeadsForFollowUp failed: ${error.message}`);

  return (data ?? []).map((lead) => {
    const initial = Array.isArray(lead.emails) ? lead.emails[0] : null;
    const { emails: _emails, ...rest } = lead;
    return {
      ...rest,
      initial_subject: initial?.subject ?? null,
      initial_sent_at: initial?.sent_at ?? null,
    };
  });
}

/**
 * Record one agent cron run for observability. Pass whatever you have —
 * everything is optional except that something useful should be filled in.
 */
export async function logAgentRun(run = {}) {
  const row = {
    ran_at: run.ranAt ?? new Date().toISOString(),
    category: run.category ?? null,
    location: run.location ?? null,
    candidates_found: run.candidatesFound ?? null,
    sent: run.sent ?? 0,
    skipped: run.skipped ?? 0,
    failed: run.failed ?? 0,
    follow_ups_sent: run.followUpsSent ?? 0,
    follow_ups_failed: run.followUpsFailed ?? 0,
    duration_ms: run.durationMs ?? null,
    error: run.error ?? null,
  };

  const { data, error } = await supabase
    .from("agent_runs")
    .insert(row)
    .select()
    .single();

  if (error) throw new Error(`logAgentRun failed: ${error.message}`);
  return data;
}
