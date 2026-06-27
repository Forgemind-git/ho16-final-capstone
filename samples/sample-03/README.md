# Sample 03 — Content Production Engine

> **Problem Statement:** Content teams spend days researching topics, writing long-form posts, and then manually reformatting the same content for LinkedIn, email, and Twitter. This project automates the entire content pipeline — from research brief to published draft to three social variants — tracked on a performance dashboard.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                Content Production Engine                  │
├──────────────────────────────────────────────────────────┤
│  Frontend (index.html)                                    │
│  ┌──────────────┐ ┌─────────────┐ ┌──────────────────┐  │
│  │  Dashboard   │ │  Research + │ │  Repurpose Tool  │  │
│  │  (Posts by   │ │  Draft Post │ │  (3 variants)    │  │
│  │   status)    │ │             │ │                  │  │
│  └──────────────┘ └─────────────┘ └──────────────────┘  │
├──────────────────────────────────────────────────────────┤
│  Backend (Express.js)                                     │
│  POST /api/research      — Claude generates brief         │
│  POST /api/posts/draft   — Claude writes post from brief  │
│  POST /api/posts/:id/repurpose — Claude produces variants │
│  GET  /api/posts         — list all posts                 │
│  PATCH /api/posts/:id    — update status                  │
│  GET  /api/dashboard     — stats by status                │
├──────────────────────────────────────────────────────────┤
│  AI Layer (claude.js)                                     │
│  generateBrief()    — research + outline from topic       │
│  draftPost()        — long-form content from brief        │
│  repurposePost()    — 3 social variants from long post    │
├──────────────────────────────────────────────────────────┤
│  Data Layer (SQLite)                                      │
│  posts    — id, topic, brief, content, status, variants   │
│  metrics  — key/value store for dashboard stats           │
└──────────────────────────────────────────────────────────┘
```

## Course Concepts Demonstrated

- **Research Automation:** Claude generates a structured research brief with angles and key insights
- **Content Drafting:** Claude writes a full LinkedIn/blog post from the research brief
- **Repurposing:** Claude produces LinkedIn teaser, email snippet, and Twitter thread from one long post
- **Performance Dashboard:** Posts tracked by status (Draft/Review/Published) with chart
- **Full-Stack:** Single Express server + vanilla HTML single-page app

## Setup Instructions

```bash
cd samples/sample-03/backend
npm install
cp ../.env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
node server.js
# Open http://localhost:3003
```

## Live URL

http://localhost:3003 (replace with your deployed URL after deployment)

## What You Can Do

1. Enter a topic → Claude produces a research brief with angles, key insights, and an outline
2. Click "Draft Post" → Claude writes a full LinkedIn/blog-style post from the brief
3. Click "Repurpose" → Claude produces 3 social variants (LinkedIn teaser, email, Twitter thread)
4. Track all posts on the dashboard by status
