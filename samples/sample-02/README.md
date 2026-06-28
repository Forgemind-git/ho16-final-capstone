# Sample 02 — Sales Intelligence Platform

> **What you'll build:** An AI-powered sales intelligence hub. You give it a company name, and Claude figures out the industry, company size, likely pain points, and a lead score — then drafts a personalised outreach email. A simple pipeline dashboard tracks every deal by stage.

## Use it with your Claude.ai subscription

You do **not** need to write code, install anything, or sign up for a developer API to build this. You can create the whole sales-intelligence solution inside Claude.ai using your normal subscription. **No API key needed.**

Follow these steps:

1. **Open Claude.ai** and sign in with your normal subscription (Free, Pro, or Team — any works).
2. **Create a Project.** In the left sidebar click **Projects**, then **Create project**. Name it something like "Sales Intelligence".
3. **Ground the Project on your context.** Open the project and add your key documents to its knowledge: your **Ideal Customer Profile (ICP)** (who your best customers are), a short **product/service one-pager**, and any examples of outreach emails that have worked. This is what makes Claude's answers specific to *your* business instead of generic.
4. **Set the Project instructions.** In the project's custom instructions, paste something like: *"You are my B2B sales intelligence analyst. Use the ICP and product docs in this project. When I give you a company name, infer its industry, size, likely pain points, and how our product helps. Score the lead 1-10."*
5. **Enrich a lead.** Start a new chat in the project and type a company name, e.g. *"Enrich this lead: Acme Cloud."* Claude returns a full company profile and a lead score.
6. **Draft outreach.** In the same chat, ask: *"Now write a personalised cold email to them, under 150 words, leading with value."* Claude writes the email using everything it just inferred.
7. **Build a deal-health dashboard.** Ask Claude: *"Create an interactive dashboard Artifact that shows my deals grouped by stage (Prospect, Qualified, Proposal, Closed), with a health colour for each."* Claude builds a live, clickable **Artifact** you can use right in the chat. Paste in your real deals to populate it.
8. **Reuse it daily.** Every new chat inside the project already knows your ICP and product, so enriching the next lead is instant.

That's the complete solution — research, scoring, email drafting, and a dashboard — all from your Claude.ai subscription.

## Architecture Overview

```
┌────────────────────────────────────────────────────────┐
│               Sales Intelligence Platform               │
├────────────────────────────────────────────────────────┤
│  Frontend (index.html)                                  │
│  ┌──────────────┐ ┌───────────────┐ ┌───────────────┐ │
│  │   Pipeline   │ │ Lead Enricher │ │ Email Drafter │ │
│  │ Kanban Board │ │ + Company Data│ │ (Personalised)│ │
│  └──────────────┘ └───────────────┘ └───────────────┘ │
├────────────────────────────────────────────────────────┤
│  Backend (Express.js)                                   │
│  POST /api/leads/enrich      — Claude extracts info     │
│  POST /api/leads/email       — Claude writes email      │
│  GET  /api/leads             — list all leads           │
│  POST /api/leads             — create lead              │
│  PATCH /api/leads/:id        — update stage             │
│  GET  /api/pipeline          — pipeline summary         │
├────────────────────────────────────────────────────────┤
│  AI Layer (claude.js)                                   │
│  enrichCompany()   — infer company profile from name    │
│  draftEmail()      — write personalised outreach        │
│  scoreLead()       — rate lead quality 1-10             │
├────────────────────────────────────────────────────────┤
│  Data Layer (SQLite)                                    │
│  leads    — id, company, contact, stage, enrichment     │
│  emails   — id, lead_id, subject, body, created_at      │
│  crm_log  — id, lead_id, action, note, created_at       │
└────────────────────────────────────────────────────────┘
```

## Course Concepts Demonstrated

- **Lead Enrichment:** Claude extracts company profile (industry, size, pain points) from a company name
- **AI Drafting:** Claude writes personalised emails using enriched company data
- **Pipeline Dashboard:** Kanban view of deals by stage (Prospect/Qualified/Proposal/Closed)
- **CRM Log:** Every action (enrich, email, stage change) logged to SQLite
- **Full-Stack:** Single Express server + vanilla HTML single-page app

## Optional — connect the live API & deploy (advanced)

> **This section is completely optional.** The recommended way to build this solution is with your Claude.ai subscription (see above). Running the code below is an *advanced* path for people who want to host the app and wire it to the live API.
>
> **Important:** the live API uses a **separate, paid Anthropic developer API key** — that is **not** the same thing as your Claude.ai subscription, and it is billed separately.
>
> **You don't even need a key to try the code.** If you run it with no `ANTHROPIC_API_KEY`, the app starts in **demo mode** and returns realistic sample data so you can see everything work. Add a key only when you want real, live AI answers.

```bash
cd samples/sample-02/backend
npm install
cp ../.env.example .env
# Optional: edit .env and add your paid ANTHROPIC_API_KEY for live AI answers.
# Leave it blank to run in demo mode (sample data, no key needed).
node server.js
# Open http://localhost:3002
```

**Live URL:** http://localhost:3002 (replace with your deployed URL after deployment)

**What you can do once it's running:**

1. Enter a company name → Claude (or demo mode) enriches it with industry, size, pain points, and lead score
2. View the enriched profile → click "Draft Email" for a personalised outreach email
3. Move deals through the pipeline (Prospect → Qualified → Proposal → Closed Won/Lost)
4. View the CRM log of all actions taken on a lead
