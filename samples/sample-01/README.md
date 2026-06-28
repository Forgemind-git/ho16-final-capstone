# Sample 01 — AI Ops Command Center

> **Problem Statement:** Operations teams waste hours manually reviewing documents, status updates, and scattered data sources. This project builds an intelligent ops hub where Claude summarises uploaded documents, answers grounded questions about them, and a dashboard tracks key metrics.

## What you'll build

An "ops command center" where you drop in your operational documents (status updates, runbooks, meeting notes), get clean summaries with key points and action items, ask grounded questions across everything, and see it all on a simple dashboard.

You can build the whole thing **inside your Claude.ai subscription** — no code, no servers, no API key. The optional advanced section at the bottom shows how to run it as a deployed web app.

## Use it with your Claude.ai subscription

This is the main path for the course. You build the ops command center directly inside Claude.ai using a Project and Artifacts. **No API key needed.**

1. **Go to Claude.ai** and sign in with your normal subscription (Pro or Team).
2. **Create a new Project.** In the left sidebar click **Projects**, then **Create project**. Name it something like "Ops Command Center".
3. **Add your ops documents as knowledge.** Open the project and use **Add content** / project knowledge to upload or paste your operations documents — status reports, runbooks, meeting notes, anything your team reviews. This is what grounds Claude's answers.
4. **Give the project instructions.** In the project's custom instructions box, paste something like: *"You are my operations analyst. Use only the documents in this project. When I share a document, reply with a 2-3 sentence summary, up to 5 key points, and up to 3 action items. When I ask a question, answer using only the project documents and tell me which document you used."*
5. **Summarise a document.** Start a chat in the project and say *"Summarise the latest status report"* — Claude returns the summary, key points, and action items, grounded in your uploaded files.
6. **Ask grounded questions.** Ask things like *"What are the open blockers across all docs?"* or *"Who owns the migration task?"* Claude answers from your project knowledge and cites the source document.
7. **Generate a dashboard Artifact.** Ask *"Build me a single-page HTML dashboard that shows the document count, the top action items, and a daily ops digest."* Claude produces an **Artifact** — a live, interactive dashboard you can view right in the chat and re-generate any time your documents change.

That's the full command center, with no setup. Re-upload or update the project documents whenever things change and re-run steps 5-7.

## Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                  AI Ops Command Center               │
├─────────────────────────────────────────────────────┤
│  Frontend (index.html)                               │
│  ┌──────────┐ ┌────────────┐ ┌──────────────────┐  │
│  │ Dashboard│ │ Doc Upload │ │  Q&A Assistant   │  │
│  │ Metrics  │ │ + Summaries│ │  (Grounded Chat) │  │
│  └──────────┘ └────────────┘ └──────────────────┘  │
├─────────────────────────────────────────────────────┤
│  Backend (Express.js)                                │
│  POST /api/docs/upload     — ingest + Claude summary │
│  GET  /api/docs            — list documents          │
│  POST /api/chat            — grounded Q&A via Claude │
│  GET  /api/metrics         — dashboard stats         │
│  POST /api/refresh         — manual data refresh     │
├─────────────────────────────────────────────────────┤
│  AI Layer (claude.js)                                │
│  summariseDocument()  — extract key points + actions │
│  groundedAnswer()     — answer using doc context     │
│  generateDigest()     — daily ops digest             │
├─────────────────────────────────────────────────────┤
│  Data Layer (SQLite)                                 │
│  documents  — id, title, content, summary, created   │
│  chat_logs  — id, question, answer, doc_refs, ts     │
│  metrics    — id, key, value, refreshed_at           │
└─────────────────────────────────────────────────────┘
```

## Course Concepts Demonstrated

- **Research + Grounding:** Claude summarises real document content; Q&A is grounded in stored docs
- **Claude AI Integration:** Anthropic SDK with claude-3-5-haiku-20241022 for speed + cost
- **Dashboard:** Live metrics panel with document count, query count, last refresh time
- **Automation:** /api/refresh endpoint simulates a scheduled data refresh (pair with cron)
- **Persistent Storage:** SQLite stores all documents, summaries, and conversation logs
- **Full-Stack:** Single Express server + vanilla HTML single-page app

## Optional — connect the live API & deploy (advanced)

Everything below is **optional and for advanced users**. It runs the project as a deployed web app instead of inside Claude.ai. To get *live* Claude responses it needs a separate **Anthropic API key** (a developer key that is billed per use and costs money — it is **not** the same thing as your Claude.ai subscription). You can get one at the [Anthropic Console](https://console.anthropic.com/).

You don't have to add a key at all: with **no key set, the app runs in demo mode** and every feature still works, returning clearly-marked sample responses so you can see the whole thing end-to-end.

### Run it locally

```bash
cd samples/sample-01/backend
npm install
cp ../.env.example .env
# Optional: edit .env and add ANTHROPIC_API_KEY for live responses.
# Leave it blank to run in demo mode.
node server.js
# Open http://localhost:3001
```

### Live URL

http://localhost:3001 (replace with your deployed URL after deployment)

### Scheduled Refresh

Add this to your crontab to auto-refresh metrics every hour:

```
0 * * * * curl -X POST http://localhost:3001/api/refresh
```

### What you can do in the deployed app

1. Upload a document (paste text) — Claude produces a structured summary with key points and action items
2. Ask questions — the assistant answers using all uploaded documents as context
3. View dashboard — see total docs, queries, and last refresh timestamp
4. Trigger refresh — simulates fetching fresh data from external sources
