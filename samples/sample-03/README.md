# Sample 03 — Content Production Engine

> **Problem Statement:** Content teams spend days researching topics, writing long-form posts, and then manually reformatting the same content for LinkedIn, email, and Twitter. This project automates the entire content pipeline — from research brief to published draft to three social variants — tracked on a performance dashboard.

## What you'll build

A simple "content engine" that takes one topic and turns it into:
1. A research brief (angles, key insights, an outline)
2. A full long-form draft (blog, LinkedIn, or email)
3. Three ready-to-post social variants (LinkedIn teaser, email snippet, Twitter thread)

You can build the whole thing inside your Claude.ai subscription — no coding and no API key required. The optional advanced section at the bottom shows how to run it as a deployed web app.

## Use it with your Claude.ai subscription

This is the main, recommended way to build your Content Production Engine. **No API key needed.** You only need a normal Claude.ai account (Free, Pro, or Team). Follow these steps in order:

1. **Open Claude.ai** in your browser and sign in.
2. **Create a research agent in Cowork.** Start a new Cowork space and tell Claude: "You are my content research assistant. When I give you a topic, produce a research brief with a hook, the target audience, 3 fresh angles, 4 key insights, a 4-section outline, a call to action, and 5 keywords." This becomes your reusable researcher — paste any topic and get a brief back.
3. **Save a drafting prompt in your Prompt Library.** Open the Prompt Library, create a new prompt, and paste something like: "Using the research brief I give you, write a {blog / LinkedIn / email} post. Keep it clear, friendly, and free of jargon." Save it so you can reuse it for every new topic.
4. **Save a repurposing prompt in your Prompt Library.** Create a second saved prompt: "Take the long post I give you and turn it into three things: a 150–200 word LinkedIn teaser, a 100–150 word email snippet, and a 5-tweet Twitter thread." Now one click reformats any draft.
5. **Create a Skill for multi-format publishing.** Make a Skill that bundles the steps above so a single instruction ("run my content engine on this topic") produces the brief, the draft, and all three social variants in one go.
6. **Track everything in a content-calendar Artifact.** Ask Claude to build an Artifact — a simple table or board — that lists each topic with its status (Draft / Review / Published) and the date. Update it as you publish so you always see your pipeline at a glance.

That's the full engine, running entirely inside your subscription. Everything below is optional.

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

## Optional — connect the live API & deploy (advanced)

Everything in this section is **optional** and meant for learners who want to see the same engine running as a deployed web app. You do **not** need any of this to complete the course — the subscription steps above are the real build.

A few honest notes before you start:

- The live API uses a **separate, paid Anthropic API key**. This is **not** the same as your Claude.ai subscription, and it is billed separately based on usage.
- **You don't even need the key to run the app.** With no key set, the app starts in **demo mode** and returns realistic sample content so you can click through the whole flow for free.

### Run it locally

```bash
cd samples/sample-03/backend
npm install
cp ../.env.example .env
# Optional: edit .env and add an ANTHROPIC_API_KEY to use the live API.
# Leave it blank to run in demo mode (sample content, no key, no cost).
node server.js
# Open http://localhost:3003
```

### What you can do in the app

1. Enter a topic → Claude (or demo mode) produces a research brief with angles, key insights, and an outline
2. Click "Draft Post" → a full LinkedIn/blog-style post is written from the brief
3. Click "Repurpose" → 3 social variants are produced (LinkedIn teaser, email, Twitter thread)
4. Track all posts on the dashboard by status

### Live URL

http://localhost:3003 (replace with your deployed URL after deployment)

### Deploying

A `Dockerfile` is included so you can build a container and deploy it to any host that runs Docker. Deployment is an advanced, optional step — if you only want to learn the course material, stick with the subscription steps above.
