# Sample 01 — AI Ops Command Center

> **Problem Statement:** Operations teams waste hours manually reviewing documents, status updates, and scattered data sources. This project builds an intelligent ops hub where Claude summarises uploaded documents, answers grounded questions about them, and a dashboard tracks key metrics — all backed by a scheduled data refresh.

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

## Setup Instructions

```bash
cd samples/sample-01/backend
npm install
cp ../.env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
node server.js
# Open http://localhost:3001
```

## Live URL

http://localhost:3001 (replace with your deployed URL after deployment)

## Scheduled Refresh

Add this to your crontab to auto-refresh metrics every hour:

```
0 * * * * curl -X POST http://localhost:3001/api/refresh
```

## What You Can Do

1. Upload a document (paste text) — Claude produces a structured summary with key points and action items
2. Ask questions — the assistant answers using all uploaded documents as context
3. View dashboard — see total docs, queries, and last refresh timestamp
4. Trigger refresh — simulates fetching fresh data from external sources
