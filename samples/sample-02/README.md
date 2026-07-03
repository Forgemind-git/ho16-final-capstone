# Sample 02 — Sales Intelligence Platform

> **Problem Statement:** Your sales team flies blind with no view of the pipeline. This sample shows a finished, copy-and-use sales intelligence platform built entirely inside a Claude.ai subscription — no code, no API key, no servers.

**▶ [See the finished dashboard (demo data)](preview.html)** — a populated, interactive front-end preview of this platform (pipeline, leaderboard, leads, AI outreach draft). Open `preview.html` in your browser.

This is a **worked example** for a fictional company, **Acme Cloud** (a B2B SaaS that sells observability tooling — logs, metrics and tracing — to engineering teams). Read it, then **copy and adapt** every prompt and document to your own company. Replace "Acme Cloud" with your company name and swap in your own ICP and product facts.

## What you are building

Four pieces that work together to give a sales team a clear view of their pipeline:

1. **A Claude Project** grounded on Acme Cloud's Ideal Customer Profile (ICP) and product docs, so Claude can score any lead and suggest talking points.
2. **An MCP server plan** that connects Claude to CRM data (lead lists, deal stages) through Claude Desktop.
3. **A Cowork pipeline-analysis agent** that reviews open deals and flags stalled or at-risk ones.
4. **A deal-health dashboard Artifact** — a single HTML page showing every deal's health at a glance.

You do NOT need to write code. You build all of this with Claude Projects, the Cowork feature, MCP connectors, and Artifacts — all part of a normal Claude.ai subscription.

## Use it with your Claude.ai subscription

No API key needed. Just your normal Claude.ai login.

1. Open Claude.ai and click **Projects** in the left sidebar, then **Create project**. Name it **"Acme Cloud Sales Intelligence"**.
2. Upload these documents to the Project (use the **+** / paperclip in the Project, or drag files in). For this sample, create three short text files with the content described in `components/claude-project/system-prompt.md`:
   - `acme-icp.md` — who Acme Cloud sells to (the Ideal Customer Profile).
   - `acme-product-onepager.md` — what Acme Cloud sells and the problems it solves.
   - `acme-objection-handlers.md` — common objections and the answers.
3. Paste the system prompt from `components/claude-project/system-prompt.md` into the Project's **custom instructions** box ("What should Claude know about you and your work in this project?").
4. Test it by asking: *"Here is a lead: VP Engineering at a 400-person fintech running microservices on Kubernetes, frustrated by slow incident response. Does this fit our ICP? Score it 1-10 and give me three talking points."* Claude should answer using only the uploaded docs.
5. (Optional, CRM data) To let Claude read live CRM data, open **Claude Desktop** → **Settings → Connectors → Add custom connector** and connect an MCP server. The tool plan in `components/mcp-server/tool-plan.md` describes exactly which tools to expose (`list_leads`, `get_deal_stage`, `list_pipeline`). This still uses your subscription login — no API key.
6. For the weekly pipeline review, open a **Cowork** session (the Cowork / agent panel in Claude.ai) and paste the agent instructions from `components/cowork-agent/agent-instructions.md`. Give it your CRM export (a CSV or pasted table) and it returns a pipeline-health report flagging stalled and at-risk deals.
7. For the dashboard, start a normal chat and paste the prompt from `components/artifact/dashboard-prompt.md`. Claude returns a deal-health dashboard as an **Artifact** (a live HTML page you can open in the side panel and share).

## Components to Build

Each is fully worked out in its own file — copy and adapt.

- [x] **Claude Project: grounded on ICP + product docs** → `components/claude-project/system-prompt.md`
- [x] **MCP server: CRM data tools** → `components/mcp-server/tool-plan.md`
- [x] **Cowork: pipeline analysis agent** → `components/cowork-agent/agent-instructions.md`
- [x] **Artifact: deal-health dashboard** → `components/artifact/dashboard-prompt.md`

Full design rationale is in `architecture.md`.

## Architecture Plan

```
┌────────────────────────────────────────────────────────────┐
│           Acme Cloud Sales Intelligence Platform           │
├────────────────────────────────────────────────────────────┤
│  Claude Project: grounded on Acme's ICP + product one-pager │
│  + objection handlers; scores leads 1-10 and writes talking │
│  points using only the uploaded docs.                       │
├────────────────────────────────────────────────────────────┤
│  MCP tools (via Claude Desktop connector): list_leads,      │
│  get_deal_stage, list_pipeline — read CRM lead and deal data │
│  so Claude can answer live pipeline questions.              │
├────────────────────────────────────────────────────────────┤
│  Cowork agent: weekly pipeline analyst — reads the CRM       │
│  export, flags deals stalled >14 days, high-value deals with │
│  no recent activity, and close dates with no proposal sent.  │
├────────────────────────────────────────────────────────────┤
│  Artifact: single-page HTML deal-health dashboard — Kanban   │
│  by stage, per-deal card (value, days in stage, score), and  │
│  green / amber / red health colour coding.                  │
└────────────────────────────────────────────────────────────┘
```

## Deployment Checklist

- [x] Claude Project created with ICP and product docs uploaded
- [x] System prompt tested with real lead examples (see test prompts)
- [x] Cowork agent runs a complete pipeline analysis
- [x] Deal-health Artifact renders and updates correctly
- [ ] Shared with at least one sales team member (do this in your own workspace)

## Your Deployed URL

Everything here lives inside Claude.ai, so there is no separate public URL to deploy. To "go live":

- Share the **Claude Project** with teammates via the Project's **Share** button (everyone uses their own Claude.ai login).
- Share the **dashboard Artifact** using the **Share** / **Publish** button on the Artifact — Claude gives you a link your sales team can open in a browser.

## Reflection

Answer these after you finish adapting it to your own company:

1. **What problem does your solution actually solve?** It gives the sales team one place to score leads consistently, see which deals are stalling, and know the next action on each deal — instead of guessing.
2. **Which Claude.ai feature was most useful and why?** For Acme Cloud, the Project (grounded scoring) plus the Cowork agent (weekly stall detection) removed the most manual work.
3. **What would you add next?** A scheduled Cowork run every Monday morning and an MCP `update_lead_score` write-back tool so scores flow back into the CRM.
