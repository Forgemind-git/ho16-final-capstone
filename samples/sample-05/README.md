# Sample 05 — Customer Support Co-Pilot

> **What you'll build:** An AI-powered support hub where Claude drafts replies grounded in your product knowledge base, triages and prioritises incoming tickets, and a trends dashboard shows ticket volume by category. Support agents stop writing replies from scratch, and managers finally get visibility into what people are asking about.

## Use it with your Claude.ai subscription

You do **not** need to write any code or pay for an API to build this support co-pilot. You can build the whole thing inside Claude.ai with the subscription you already have. `No API key needed.`

Follow these steps:

1. **Open Claude.ai** and sign in with your normal account (a Pro or Team subscription works great; the free plan works too with smaller limits).
2. **Create a Project.** In the left sidebar, click **Projects**, then **Create project**. Name it something like "Support Co-Pilot". A Project is a private workspace where Claude remembers your instructions and documents.
3. **Add your product knowledge to the Project.** Click **Add content** (project knowledge) and paste or upload your product docs, FAQs, return/refund policy, and troubleshooting guides. This is what Claude will use as its source of truth when drafting replies — the same idea as the "knowledge base" in the app version.
4. **Write the Project's custom instructions.** In the Project settings, paste something like: *"You are an empathetic customer support agent. Always ground your replies in the project knowledge. Cite which document you used. Never make up information. If the knowledge doesn't cover the question, ask the customer for more detail."*
5. **Save a triage prompt.** Start a chat and paste a reusable prompt you can run on any new ticket, for example: *"Triage this support ticket. Give me (a) a category, (b) a priority of low / medium / high / critical, and (c) one sentence explaining why."* Then paste a ticket below it. Save this chat so you can reuse the prompt.
6. **Save a reply-drafting prompt.** In another chat, paste: *"Draft a friendly, solution-focused reply to this ticket using only our project knowledge. Cite the document you relied on."* Paste the ticket and let Claude write the reply, grounded in the docs you added in step 3.
7. **Make a weekly-summary Skill.** If your plan offers **Skills**, create one that says: *"Given a list of this week's tickets, summarise the trends in 2–3 sentences and give one actionable recommendation for the support team."* Now you can paste a week of tickets and get a manager-ready summary on demand. (No Skills on your plan? Just save this as a reusable prompt instead.)
8. **Build a ticket-status heatmap Artifact.** Ask Claude: *"Make an Artifact: a simple ticket-status heatmap (category down the side, priority across the top, coloured by how many tickets fall in each cell) from this data,"* then paste your ticket counts. Claude builds an interactive chart you can view and tweak right in the conversation.

That's the entire product — grounded replies, triage, a weekly summary, and a visual dashboard — all inside your Claude.ai subscription.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│               Customer Support Co-Pilot                   │
├──────────────────────────────────────────────────────────┤
│  Frontend (index.html)                                    │
│  ┌──────────────┐ ┌──────────────────┐ ┌─────────────┐  │
│  │  Dashboard   │ │  Ticket Inbox    │ │  Knowledge  │  │
│  │  (Trends +   │ │  + AI Triage +   │ │  Base Mgmt  │  │
│  │   Volume)    │ │  Grounded Reply  │ │             │  │
│  └──────────────┘ └──────────────────┘ └─────────────┘  │
├──────────────────────────────────────────────────────────┤
│  Backend (Express.js)                                     │
│  POST /api/kb                  — add knowledge base doc   │
│  GET  /api/kb                  — list KB articles         │
│  POST /api/tickets             — create ticket + triage   │
│  GET  /api/tickets             — list tickets             │
│  POST /api/tickets/:id/reply   — Claude drafts reply      │
│  GET  /api/dashboard           — trends + volume stats    │
├──────────────────────────────────────────────────────────┤
│  AI Layer (claude.js)                                     │
│  triageTicket()   — classify category + priority          │
│  draftReply()     — grounded reply using KB               │
│  trendSummary()   — summarise ticket trends for manager   │
├──────────────────────────────────────────────────────────┤
│  Data Layer (SQLite)                                      │
│  knowledge_base — id, title, content, created_at          │
│  tickets        — id, subject, body, category, priority   │
│  replies        — id, ticket_id, draft, source_articles   │
└──────────────────────────────────────────────────────────┘
```

## Course Concepts Demonstrated

- **Knowledge Base:** Upload product docs as plain text articles
- **Grounded Reply Drafting:** Claude writes support replies citing specific KB articles
- **Ticket Triage:** Claude classifies tickets by category and assigns priority (Low/Medium/High/Critical)
- **Trends Dashboard:** Ticket volume by category + priority distribution chart
- **Full-Stack:** Single Express server + vanilla HTML single-page app

## Optional — connect the live API & deploy (advanced)

> **This section is optional.** The main build above runs entirely inside your Claude.ai subscription. This part is for learners who also want to run the bundled full-stack app, and (optionally) connect it to the live Claude API.
>
> **Two important notes:**
> - The live API needs a **separate, paid Anthropic API key** — that is **not** the same thing as your Claude.ai subscription, and it is billed separately.
> - **You do not need a key to run the app.** With no key, the app starts in **demo mode**: triage, reply drafting, and the trends summary all return realistic sample content (clearly marked as samples) so you can click through the whole product. Add a key later only if you want real AI output.

### Run the app locally (demo mode — no key)

```bash
cd samples/sample-05/backend
npm install
cp ../.env.example .env        # the default .env works as-is — no key required
node server.js
# Open http://localhost:3005
```

### Connect the live API (optional)

1. Create a paid API key at the Anthropic Console (separate from your Claude.ai subscription).
2. Edit `.env` and set `ANTHROPIC_API_KEY` to that key.
3. Restart the server (`node server.js`). The app now uses real Claude responses instead of demo samples.

### Deploy with Docker (optional)

A `Dockerfile` is included. Deploying makes the app reachable on a public URL; if you want live AI there, set `ANTHROPIC_API_KEY` in the deployment environment (otherwise it runs in demo mode).

### What you can do in the app

1. Add knowledge base articles (product docs, FAQs, policies)
2. Submit a support ticket → Claude triages it (category + priority) instantly
3. Open any ticket → Claude drafts a grounded reply citing KB articles
4. View the trends dashboard — ticket volume by category over time
