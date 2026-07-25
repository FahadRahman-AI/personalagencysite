# Studio FX Outreach Agent — Build Brief

The original spec this project was built from. Kept here for reference.

## What this is
An autonomous outreach agent that runs daily on Railway.
It finds businesses, personalises emails, sends them, and follows up — all
without human intervention.

## The goal
Book calls for Studio FX with businesses that need websites, automation, and
digital systems.

## Critical rules
1. Never mention "AI" or "artificial intelligence". Use "smart systems",
   "automated processes", "background workflows".
2. Every email must reference something specific about that exact business —
   never send generic copy.
3. Never contact the same business twice.
4. Only one follow-up per lead, after 5 days.
5. Always include Calendly link for booking.
6. Always sound human — never robotic or templated.

## Tech stack
- Runtime: Node.js
- Database: Supabase
- Email: Resend
- Lead finding: Google Maps Places API
- Email finding: Hunter.io API
- Personalisation: Anthropic Claude API
- Hosting: Railway (cron job, runs daily 9am UK time)
- Scheduling: node-cron

## Business categories to target (rotate daily)
| Day       | Categories |
|-----------|-----------|
| Monday    | restaurants, cafes, food businesses |
| Tuesday   | gyms, personal trainers, wellness studios |
| Wednesday | law firms, accountants, consultancies |
| Thursday  | estate agents, property businesses |
| Friday    | retail shops, boutiques, independent brands |
| Saturday  | clinics, dentists, medical practices |
| Sunday    | hotels, B&Bs, hospitality |

## Target locations (rotate weekly)
| Week | Locations |
|------|-----------|
| 1    | Birmingham, Solihull, Coventry |
| 2    | London (various boroughs) |
| 3    | Manchester, Leeds, Sheffield |
| 4    | Dubai (UAE), international English-speaking |

## Email personalisation
When generating an email, Claude receives the business name, the scraped
website content, the Google reviews summary, and the category. Claude must:

1. Identify ONE specific pain point visible from their data (e.g.,
   "no online booking despite reviews complaining about phone availability",
   "great food photography, ten-year-old site", "praised in reviews but no
   way to collect or showcase testimonials online").
2. Write an email referencing that specific pain point.
3. Never use the word AI.
4. Keep it under 120 words total.
5. End with a specific ask and the Calendly link.

## Follow-up rules
Send exactly 5 days after the initial email if no reply.
- Subject: `Re: [original subject]`
- Body: 3 sentences maximum.
  - Sentence 1: acknowledge they're busy.
  - Sentence 2: restate the one thing we noticed.
  - Sentence 3: Calendly link with "happy to keep it to 15 mins".
- Never follow up a third time.

## File structure
```
outreach-agent/
  src/
    index.js          — main entry, cron scheduler
    leads.js          — Google Maps lead finding
    scraper.js        — website content fetcher
    emailFinder.js    — Hunter.io integration
    personaliser.js   — Claude API email writer
    sender.js         — Resend email sender
    followUp.js       — follow-up checker and sender
    database.js       — Supabase operations
  .env.example
  package.json
  railway.toml        — Railway deployment config
  README.md           — setup instructions
```
