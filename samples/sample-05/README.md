# Sample 05 — Customer Support Co-Pilot

> **Problem Statement:** Support agents spend hours writing replies from scratch, often missing knowledge base articles, and managers have no visibility into ticket trends or volume by category. This project builds an AI-powered support hub where Claude drafts replies grounded in your product knowledge base, triages and prioritises tickets, and a trends dashboard shows ticket volume by category.

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

## Setup Instructions

```bash
cd samples/sample-05/backend
npm install
cp ../.env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
node server.js
# Open http://localhost:3005
```

## Live URL

http://localhost:3005 (replace with your deployed URL after deployment)

## What You Can Do

1. Add knowledge base articles (product docs, FAQs, policies)
2. Submit a support ticket → Claude triages it (category + priority) instantly
3. Open any ticket → Claude drafts a grounded reply citing KB articles
4. View the trends dashboard — ticket volume by category over time
