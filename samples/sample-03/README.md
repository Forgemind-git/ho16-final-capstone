# Sample 03 — Content Production Engine

> **Problem Statement:** You want to produce content at scale but research, drafting and tracking are disconnected. Build and deploy a content engine.

**▶ [See the finished dashboard (demo data)](preview.html)** — an interactive, front-end preview of what this engine looks like once built (runs on demo data; the real full-stack + AI backend is your build).

This is a **worked example** for the FINAL CAPSTONE. Everything below is real and copy-paste ready. Read it, then copy and adapt it for your own team and topic. Nothing here needs code, a terminal, an API key, or git — it all lives inside your normal Claude.ai subscription.

## The Worked Scenario

We are the content team at **FieldPro**, a SaaS that helps field-service and trades businesses (plumbers, electricians, HVAC, landscapers) schedule jobs, dispatch crews, and get paid faster.

Our content topic for this walkthrough is:

> **"How small trades businesses can cut no-show appointments"**

Every prompt, agent instruction, Skill, and Artifact in this sample is written around that exact topic so you can see the whole pipeline end to end: **topic → research brief → long-form draft → 3 channel-ready variants → logged in a calendar tracker.**

## Components in This Engine

Four pieces, each built entirely inside Claude.ai. Each has its own file with the full, copy-paste content.

- [x] **Cowork agent: research + brief** — `components/cowork-agent/agent-instructions.md`
  - Takes a topic and produces a structured research brief: 3 angles, 5 insights, audience + pain, an outline, and keywords.

- [x] **Prompt Library: draft + repurpose** — `components/prompt-library/prompts.md`
  - Four reusable, named prompts saved in a Claude Project: Long-Form Draft, LinkedIn Repurpose, Email Snippet, Short-Form / Thread.

- [x] **Skill: one-click multi-format publish** — `components/skill/skill-instructions.md`
  - One draft in, three channel-ready variants out (LinkedIn / email / X thread) with concrete limits.

- [x] **Artifact: content calendar tracker** — `components/artifact/calendar-prompt.md`
  - A single-prompt HTML tracker with sample data for 10 pieces, status filters, and a status summary.

## Architecture Plan

```
┌──────────────────────────────────────────────────────────────┐
│                  FieldPro Content Production Engine            │
├──────────────────────────────────────────────────────────────┤
│  Cowork research agent: paste a topic, get back a structured  │
│  brief (3 angles, 5 insights, audience+pain, outline, keywords)│
├──────────────────────────────────────────────────────────────┤
│  Prompt Library (in a Claude Project): 4 saved prompts that    │
│  turn the brief into a long-form draft, then repurpose it into │
│  LinkedIn / email / thread on demand                           │
├──────────────────────────────────────────────────────────────┤
│  "Publish Pack" Skill: one click turns the approved draft into │
│  3 channel-ready variants (LinkedIn ≤1,300 chars, email ≤200   │
│  words, X thread 5 tweets ≤280 chars each)                     │
├──────────────────────────────────────────────────────────────┤
│  Content Calendar Artifact: an HTML tracker (topic, format,    │
│  status, publish date, channel, owner) with filters + counts   │
└──────────────────────────────────────────────────────────────┘
        topic ─► brief ─► draft ─► 3 variants ─► logged in calendar
```

## Use it with your Claude.ai subscription

No API key needed. Just your normal Claude.ai login.

1. Open Claude.ai and create a new Project called **"FieldPro Content Engine"** (click **Projects** in the left sidebar, then **Create project**). A Project keeps all your content work, files, and saved prompts in one place.
2. In that Project, open **Project knowledge** (or **Add content**) and paste a short note about your brand: who FieldPro serves (small trades businesses), the tone (plain, practical, no jargon), and the topic you're working on ("How small trades businesses can cut no-show appointments"). Claude will use this context in every chat inside the Project.
3. Build the **research agent**. Open Cowork (or start a new chat in the Project), copy the full instructions from `components/cowork-agent/agent-instructions.md`, and paste them in. Then type your topic. You'll get back a structured brief. Save that brief — you'll paste it into the next step.
4. Save your **reusable prompts**. Open `components/prompt-library/prompts.md`, and for each of the four prompts, start a new chat in the Project, paste the prompt, and use it. To reuse a prompt later, keep this file handy and paste it again, or pin the chat. (If your plan shows a "Save prompt" / starred-prompt option in the Project, use that — otherwise this file is your library.)
5. Generate the **long-form draft**. Use Prompt 1 (Long-Form Draft), pasting the brief from step 3 where it says `[PASTE BRIEF HERE]`. Review and lightly edit the result.
6. Run the **one-click publish Skill**. Copy the Skill instructions from `components/skill/skill-instructions.md`, paste your approved draft where it says `[PASTE CONTENT HERE]`, and send. You'll get three labeled, channel-ready variants in one reply.
7. Build the **calendar tracker**. Start a new chat, paste the prompt from `components/artifact/calendar-prompt.md`, and Claude will render an HTML content calendar as an Artifact on the right. Edit it by chatting ("add a column for Owner", "mark piece #4 as Published").
8. Log your piece. In the calendar Artifact, add a row for the no-show article with its status and publish date. That's the full loop, all inside Claude.ai.

## Deployment Checklist

- [x] Cowork agent produces useful research briefs
- [x] Prompt Library contains 4 reusable prompts
- [x] Skill outputs 3 channel variants from one input
- [x] Content calendar Artifact renders and is usable
- [x] End-to-end: topic → brief → draft → 3 variants → logged in calendar

## Where This "Lives"

There is no server to deploy and no public URL. This engine "ships" as a **Claude Project** in your own Claude.ai account: the Project holds your brand context and saved prompts, the Skill is triggered in chat, and the calendar is an Artifact you keep open and update. To hand it to a teammate, share the Project (if your plan supports sharing) or send them this folder so they can rebuild it in their own account in a few minutes.

## Reflection

1. **What problem does this solve?** Research, drafting, repurposing, and tracking used to live in four different tools and four people's heads. Now one topic flows through one Project: brief → draft → three variants → a calendar, with consistent FieldPro voice throughout.
2. **Which Claude.ai feature was most useful and why?** The Project plus the "Publish Pack" Skill — the Project keeps brand context so every draft sounds like FieldPro, and the Skill collapses an hour of manual reformatting into one click that produces all three channel variants at once.
3. **What would you add next?** A second Skill that drafts the email's full HTML, and a "performance review" prompt that takes last month's published pieces from the calendar and suggests next month's topics.
