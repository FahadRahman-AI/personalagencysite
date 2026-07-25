# Studio FX Outreach Agent

Autonomous daily outreach. Wakes up at 9am UK time, finds businesses that fit the day's category in the week's region, personalises an email for each one with Claude, sends via Resend, and follows up exactly once if there's no reply after 5 days. Designed to run on Railway with zero human intervention.

The original spec is in [`BRIEF.md`](./BRIEF.md). Voice and copy rules are enforced in `src/personaliser.js`.

---

## How it works

```
       09:00 Europe/London  (node-cron)
                │
                ▼
   ┌────────────────────────────┐
   │  pickCategory(today)       │  Mon=restaurants … Sun=hospitality
   │  pickLocation(this week)   │  W1=Birmingham W2=London W3=Manchester W4=Dubai
   └────────────────────────────┘
                │
                ▼
   ┌────────────────────────────┐
   │  Google Places "Text Search" │  →  list of businesses with websites
   └────────────────────────────┘
                │
                ▼  for each business
        ┌───────────────┐
        │ dedupe (place)│──── seen? skip
        └───────────────┘
                │
                ▼
        ┌───────────────┐
        │ Hunter.io     │──── no email? skip
        └───────────────┘
                │
                ▼
        ┌───────────────┐
        │ dedupe (email)│──── seen? skip
        └───────────────┘
                │
                ▼
        ┌────────────────────────────┐
        │ scrape website (cheerio)   │
        │ → title, headings, copy    │
        └────────────────────────────┘
                │
                ▼
        ┌────────────────────────────┐
        │ Claude Opus 4.7            │
        │ → {observation, subject,   │
        │     body}  (JSON-schema)   │
        └────────────────────────────┘
                │
                ▼
        ┌───────────────┐
        │ Resend send   │
        │ save to DB    │
        └───────────────┘

  Same cycle: query leads >5 days old with no reply → send 3-sentence follow-up.
```

---

## Setup — in order

### 1. Install
```bash
cd outreach-agent
npm install
cp .env.example .env
```

### 2. Get the API keys
See the **API key checklist** below — every key has a link.

### 3. Set up Supabase
1. Create a free project at [supabase.com](https://supabase.com).
2. Copy the project URL and the **anon** public key into `.env`.
3. Get the schema SQL and paste it into the Supabase SQL editor:
   ```bash
   npm run print-schema
   ```
4. Run it. You should now have a `leads` table.

### 4. Verify your sending domain in Resend
Resend will refuse to send from `hello@studiofx.co` until the domain is verified. In the Resend dashboard:
1. Add domain `studiofx.co`.
2. Add the DNS records they show you (SPF + DKIM + DMARC) to your domain registrar.
3. Wait for verification (usually 5–15 minutes).

### 5. Test locally with a single run
```bash
npm run once          # one full cycle (outreach + follow-ups), then exit
npm run outreach      # only the outreach half
npm run followups     # only the follow-ups half
```

Watch the console — it prints every lead it considers and why it skipped (or sent).

### 6. Deploy to Railway
1. Create a new project from this folder (`outreach-agent`).
2. Add **every** env var from `.env.example` in the Railway dashboard. Railway does **not** read `.env` files in production.
3. Push — Railway will run `npm install` then `npm start`, which schedules the daily 9am UK job.
4. Open the Railway logs to confirm: `[boot] scheduled — pattern "0 9 * * *" timezone "Europe/London"`

---

## API key checklist

| # | Key                  | Where to get it                                              | Cost / plan                                     |
|---|----------------------|--------------------------------------------------------------|-------------------------------------------------|
| 1 | `ANTHROPIC_API_KEY`  | [console.anthropic.com](https://console.anthropic.com) → API Keys | Pay-as-you-go. ~$0.10–0.30 per personalised email at Opus 4.7. |
| 2 | `RESEND_API_KEY`     | [resend.com/api-keys](https://resend.com/api-keys)            | Free tier: 100 emails/day, 3k/month. Domain verification required. |
| 3 | `SUPABASE_URL` + `SUPABASE_ANON_KEY` | [supabase.com](https://supabase.com) → project → Settings → API | Free tier is more than enough. |
| 4 | `GOOGLE_MAPS_API_KEY` | [console.cloud.google.com](https://console.cloud.google.com) → enable **Places API (New)** → Credentials → API key | $200/month free credit. Text Search costs ~$0.032/call → ~$1/month at this volume. |
| 5 | `HUNTER_API_KEY`     | [hunter.io/api-keys](https://hunter.io/api-keys)              | Free: 25 searches/month. Starter: $34/mo for 500. |
| 6 | `CALENDLY_LINK`      | Your booking page URL                                         | Free Calendly works. |
| 7 | `FROM_EMAIL` + `FROM_NAME` | The verified Resend sender                              | Domain must be verified in Resend. |

---

## Tuning knobs (optional env vars)

| Env var              | Default            | What it does |
|----------------------|--------------------|--------------|
| `MAX_LEADS_PER_RUN`  | `25`               | How many Places-API results to evaluate per cycle. |
| `MAX_SENDS_PER_RUN`  | `12`               | Hard cap on emails sent per cycle. Stops once reached. |
| `SEND_DELAY_MS`      | `3000`             | Pause between sends. Keeps you out of spam folders. |
| `CRON_SCHEDULE`      | `0 9 * * *`        | Standard cron. Change to e.g. `0 8 * * 1-5` for weekdays-only at 8am. |
| `CRON_TIMEZONE`      | `Europe/London`    | IANA timezone. |

---

## How rotation works

- **Daily category** is picked from `DAILY_CATEGORIES[date.getDay()]` in `src/index.js`. Each day has 2–3 sub-categories — one is chosen at random so consecutive Mondays don't all hammer "restaurants".
- **Weekly location** is picked from `WEEKLY_LOCATIONS[((isoWeek - 1) % 4) + 1]` — same idea: ISO week number mod 4 rotates the region, then a random sub-region inside it.

Edit the two constants at the top of `src/index.js` to expand or rebalance.

---

## Marking replies

The cron job has no way to know when someone replies — Resend is outbound only. Until you wire up an inbox webhook (Resend supports `email.delivered` / `email.bounced`, not replies), mark replies manually so the follow-up doesn't go out:

In Supabase Studio: open `leads`, find the row, set `replied_at` to `now()`.

Anything with `replied_at` set is permanently skipped by the follow-up job.

---

## Cost expectations (rough)

At 12 sends/day, daily:
- Claude Opus 4.7: ~$1.20–3.60 (depends on website length + thinking)
- Resend: free (under daily limit)
- Google Places: ~$0.40
- Hunter.io: depends on tier — free tier exhausted in ~2 days

Monthly: roughly **$50–120** for ~360 emails sent, dominated by Claude. To cut Claude cost roughly 3× swap `MODEL = "claude-opus-4-7"` → `"claude-sonnet-4-6"` in `src/personaliser.js`. Quality drop is small for this task; intelligence-per-dollar is much better.

---

## File map

```
outreach-agent/
  src/
    index.js          — node-cron scheduler, rotation, full cycle orchestrator
    leads.js          — Google Places (New) Text Search wrapper
    scraper.js        — fetch + cheerio, returns {title, headings, body excerpt}
    emailFinder.js    — Hunter.io Domain Search with seniority ranking
    personaliser.js   — Claude Opus 4.7 + adaptive thinking + json_schema
    sender.js         — Resend wrapper, plain-text + minimal HTML
    followUp.js       — finds 5-day-old leads, generates + sends 3-sentence follow-up
    database.js       — Supabase client, schema SQL, lead CRUD
  .env.example
  package.json
  railway.toml        — Railway service config
  BRIEF.md            — original spec
  README.md           — this file
```

---

## Troubleshooting

| Symptom                                          | Likely cause                                       |
|--------------------------------------------------|----------------------------------------------------|
| `Missing required env vars: ...`                 | One of the 9 required env vars is unset.           |
| `Places API 400`                                 | `Places API (New)` is not enabled on the Google project, or the API key is restricted. |
| `Places API 403`                                 | Billing is not enabled on the Google project.      |
| `Hunter 401`                                     | `HUNTER_API_KEY` is wrong or revoked.              |
| `Resend failed: ... not_verified`                | Domain isn't verified in Resend yet.               |
| `saveLead failed: duplicate key`                 | Race condition — you ran two outreach cycles in parallel for the same business. Harmless. |
| Same business contacted twice                    | Should not happen — both `place_id` and `email` are deduped. If it does, check Supabase Studio for orphan rows. |
| Follow-ups never send                            | Leads have `replied_at` set, or `initial_sent_at` is less than 5 days ago. |
| Opus 4.7 cost feels high                         | Swap `MODEL` in `src/personaliser.js` to `claude-sonnet-4-6`. |
