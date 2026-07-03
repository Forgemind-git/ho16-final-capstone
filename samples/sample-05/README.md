# Sample 05 — Customer Support Co-Pilot (Brightcart)

> **Problem Statement:** Support at Brightcart is slow and reactive. Agents re-read the
> same policies for every ticket, replies are inconsistent, and managers have no clear
> view of what is going wrong each week. Build a customer-support co-pilot using only
> your Claude.ai subscription — no code, no API key.

**▶ [See the finished dashboard (demo data)](preview.html)** — a self-contained, interactive front-end preview of what the co-pilot looks like once built. The real full-stack + AI backend is your build.

**Brightcart** is a fictional e-commerce SaaS: it gives small online stores a hosted
storefront, a checkout, and a subscriptions/billing engine. Its support team handles
billing questions, login problems, checkout bugs, and refund requests all day. We use
Brightcart so every document, policy, and ticket below is concrete. Swap in your own
product name and docs to adapt this for real.

This is a **copy-and-use** worked example. Everything below is filled in and ready to
paste into Claude.ai. Read it, then build the same thing in your own account.

## What you are building

Four pieces, all inside Claude.ai:

1. **A Claude Project** grounded on Brightcart's product docs + policies, so Claude
   answers support questions accurately and cites the source.
2. **A Prompt Library** (two saved prompts): one to *triage* a ticket, one to *draft a
   reply*.
3. **A Skill** that turns a week of tickets into a manager summary.
4. **An Artifact** — a ticket-status heatmap your team can glance at.

## Use it with your Claude.ai subscription

No API key needed. Just your normal Claude.ai login.

1. Open Claude.ai and click **Projects** in the left sidebar, then **Create Project**.
   Name it **"Brightcart Support Co-Pilot"**.
2. Open the project, find **Project knowledge** (right side), and click **Add content**.
   Upload these four documents (create them as plain text/Markdown files first — sample
   contents are in `architecture.md`):
   - `brightcart-faq.md` — top product/how-to answers
   - `brightcart-refund-policy.md` — refund and returns rules
   - `brightcart-sla-escalation.md` — response targets and who to escalate to
   - `brightcart-known-issues.md` — current bugs and workarounds
3. In the same project, click **Set instructions** (or **Edit** next to the project
   name) and paste the system prompt from
   `components/claude-project/system-prompt.md`. Save.
4. Save your two reusable prompts. Claude.ai does not have a separate "prompt library"
   product, so you save prompts **as their own page inside the project**: start a new
   chat in the project titled **"PROMPTS — copy from here"**, paste both prompts from
   `components/prompt-library/prompts.md` into the first message, and pin that chat (the
   "…" menu on the chat → **Star/Pin**). To triage or reply later, copy the prompt out
   of that pinned chat into a fresh chat and paste the real ticket where it says
   `[PASTE TICKET HERE]`.
5. Test the grounding: start a new chat **inside the project** and paste Test Ticket 1
   from `components/claude-project/system-prompt.md`. Confirm Claude assigns a category,
   a priority, and **names the document** it used (for example "per
   brightcart-refund-policy.md").
6. Build the weekly summary as a **Skill**. In Claude.ai go to **Settings → Capabilities
   → Skills** (or the **Skills** entry in the sidebar if your plan shows it), click
   **Create Skill**, name it **"Brightcart Weekly Support Summary"**, and paste the
   instructions from `components/skill/skill-instructions.md`. To run it, start a chat,
   invoke the skill, and paste your week's ticket list.
7. Build the heatmap **Artifact**. Start any chat (the project is fine), paste the prompt
   from `components/artifact/heatmap-prompt.md`, and send. Claude returns a live HTML
   Artifact in the side panel. Click **Publish** (top-right of the Artifact) to get a
   shareable link for your team, or screenshot it for a weekly report.

That's the whole co-pilot. No terminal, no deploy step, no code.

## Architecture Plan

```
┌─────────────────────────────────────────────────────────────┐
│            Brightcart Customer Support Co-Pilot              │
├─────────────────────────────────────────────────────────────┤
│  Claude Project "Brightcart Support Co-Pilot": 4 uploaded    │
│  docs (FAQ, refund policy, SLA/escalation, known issues) +   │
│  a system prompt that makes Claude a grounded support agent  │
├─────────────────────────────────────────────────────────────┤
│  Prompt Library: 2 saved prompts — "Triage Ticket"           │
│  (category + priority + owner) and "Draft Reply" (grounded,  │
│  cites the source doc) — kept in a pinned project chat       │
├─────────────────────────────────────────────────────────────┤
│  Skill "Weekly Support Summary": reads a week of tickets,    │
│  outputs a manager memo (volume, categories, SLA breaches,   │
│  top recurring issues, 3 recommendations)                    │
├─────────────────────────────────────────────────────────────┤
│  Artifact: static HTML ticket-status heatmap (category ×     │
│  day) + resolved/open summary table, publishable as a link   │
└─────────────────────────────────────────────────────────────┘
```

## Deployment Checklist

- [x] Claude Project created with the 4 Brightcart docs and the system prompt set
- [x] Triage prompt classifies tickets (category + priority + owner) and is saved
- [x] Reply prompt drafts grounded responses that cite the source doc, and is saved
- [x] Weekly Support Summary Skill produces a manager memo from a ticket list
- [x] Heatmap Artifact renders ticket trends and can be published as a link

## Your Deployed URL

This co-pilot lives inside Claude.ai, so there is no server to deploy. Share it two ways:

- **Project link:** open the project, click **Share** (top-right), and invite teammates
  on your plan.
- **Heatmap link:** open the heatmap Artifact and click **Publish** to get a public URL,
  e.g. `https://claude.ai/public/artifacts/<your-id>`. Paste that into your weekly report.

## Reflection

1. **What problem does this actually solve?** Agents stop re-reading policies for every
   ticket — triage and a grounded draft reply arrive in seconds, and managers get a
   weekly view instead of guessing. Support shifts from reactive to proactive.
2. **Which Claude.ai feature was most useful and why?** The Claude Project. Uploading the
   four docs once means every reply is grounded in the same policies and cites them, so
   answers stay consistent across the whole team.
3. **What would you add next?** A second Skill that auto-tags incoming tickets from an
   email export, and an Artifact "agent scorecard" showing average response time per
   agent so coaching is data-driven.
