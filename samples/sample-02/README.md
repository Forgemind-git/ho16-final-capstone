# Sample 02 — Sales Intelligence Platform

> **Problem Statement:** Sales teams waste hours manually researching companies before outreach and writing personalised emails from scratch. This project builds an AI-powered sales intelligence hub where Claude enriches company data, drafts personalised outreach emails, and a pipeline dashboard tracks every deal by stage — all logged to SQLite.

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

## Setup Instructions

```bash
cd samples/sample-02/backend
npm install
cp ../.env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
node server.js
# Open http://localhost:3002
```

## Live URL

http://localhost:3002 (replace with your deployed URL after deployment)

## What You Can Do

1. Enter a company name → Claude enriches it with industry, size, pain points, and lead score
2. View enriched profile → Click "Draft Email" for a personalised outreach email
3. Move deals through the pipeline (Prospect → Qualified → Proposal → Closed Won/Lost)
4. View CRM log of all actions taken on a lead
