# Architecture Plan — Sample 02: Sales Intelligence Platform

> A worked design for **Acme Cloud**, a B2B SaaS that sells observability tooling (logs, metrics, tracing) to engineering teams. Use this to explain your choices to your trainer, then copy and adapt it to your own company. Everything is built inside a Claude.ai subscription — no code, no API key.

## Problem

Acme Cloud's sales team flies blind: leads are scored inconsistently, no one knows which deals are stalling, and there is no single view of pipeline health. This platform fixes that with four connected Claude.ai pieces — a grounded Project, CRM tools via MCP, a Cowork pipeline analyst, and a deal-health dashboard Artifact.

## Component 1: Claude Project — grounded on ICP + product docs

**What documents will you upload?**
- `acme-icp.md` — Ideal Customer Profile: 200-2,000 employees, 30+ engineers running microservices/Kubernetes, in SaaS/fintech/e-commerce/gaming; buyer is VP Eng / Director Platform/SRE. (Full text in `components/claude-project/system-prompt.md`.)
- `acme-product-onepager.md` — what Acme Cloud sells (unified logs/metrics/tracing) and the four problems it solves: slow incident response, tool sprawl/cost, blind spots, on-call burnout.
- `acme-objection-handlers.md` — answers to the four common objections (already use a competitor, too expensive, no time to migrate, security/data residency).

**System prompt (worked, ready to paste):**
```
You are the Sales Intelligence Assistant for Acme Cloud. Acme Cloud sells an
observability platform (logs, metrics, distributed tracing in one place) to
engineering teams. Ground every answer in the three uploaded docs
(acme-icp.md, acme-product-onepager.md, acme-objection-handlers.md).

For any lead: (1) score ICP fit 1-10 with one short paragraph of reasoning;
(2) name the 2-3 most relevant pain points; (3) write 3 personalised talking
points; (4) if an objection is hinted at, give the matching handler answer.
Only use facts from the docs and the lead details. If something isn't covered,
say "Not covered in our docs". Never invent features, pricing, or customers.
Be concise: Score, Reasoning, Pain points, Talking points.
```
(The complete, longer version is in `components/claude-project/system-prompt.md`.)

**How will you test it?**
- *"Lead: VP Engineering at a 400-person fintech, ~80 engineers on Kubernetes, using three monitoring tools, complaining about slow incident response. ICP fit? Score 1-10 with reasoning, plus pain points and 3 talking points."* — expect a high score (8-10).
- *"Top 3 pain points Acme Cloud solves for a fast-scaling e-commerce company at peak season?"* — expect incident speed, tool consolidation/cost, blind-spot tracing, grounded in the one-pager.
- *"Draft talking points for a Director of Platform who said 'we already use a competitor and have no time to migrate.'"* — expect the consolidation/cost angle plus the under-a-day, run-alongside answer.

---

## Component 2: MCP Server — CRM data tools

**What CRM data does your sales team need?** A current lead list (with ICP score, owner, status), the live stage and detail of any single deal, and the full open pipeline for review and dashboards.

**Tool signatures** (read-only to start; full descriptions + example JSON in `components/mcp-server/tool-plan.md`). Connect via Claude Desktop → Settings → Connectors — uses your subscription login, no API key:
```
list_leads(owner?, min_score?, status?, limit=20)
  -> [ {lead_id, company, contact, title, employees, industry, score,
        status, owner, last_activity} ]

get_deal_stage(deal_id)               # or by company
  -> {deal_id, company, stage, value_usd, days_in_stage, owner,
      expected_close, last_activity, proposal_sent, next_action}

list_pipeline(owner?, stage?, include_closed=false)
  -> [ {deal_id, company, stage, value_usd, days_in_stage,
        expected_close, last_activity, proposal_sent} ]
```

---

## Component 3: Cowork Agent — pipeline analysis

**Agent goal:** Review every open deal and produce a short report flagging stalled deals, at-risk high-value deals, and deals with a near close date but no proposal sent — each with a clear next action.

**Inputs:** The CRM pipeline — either via the `list_pipeline` MCP tool, or a pasted/attached CRM export (CSV/table) with deal_id, company, stage, value_usd, days_in_stage, expected_close, last_activity, proposal_sent, owner.

**Output format:** A one-line snapshot headline (open deals, total value, RED/AMBER/GREEN counts), a markdown table of flagged deals only with a next action each, and a "Top 3 priorities this week" list.

**Agent instructions (worked, ready to run):**
```
ROLE: Pipeline Analyst for Acme Cloud's sales team.
DATA: Use list_pipeline (preferred) or the pasted CRM export.
FLAG any deal where: days_in_stage > 14 (STALLED); no activity in 10 days
(GOING COLD); stage Proposal+ but proposal_sent false (PROPOSAL OVERDUE);
expected_close within 14 days but no proposal / earlier than Negotiation
(CLOSE-DATE RISK).
HEALTH: RED = 2+ rules or stalled deal over $75k; AMBER = 1 rule; GREEN = none.
For every flagged deal give ONE concrete next action.
OUTPUT: headline counts -> table (Company|Stage|Value|Days|Last activity|
Health|Why|Next action, RED first then by value) -> Top 3 priorities. One screen, no fluff.
```
(Full version + example report in `components/cowork-agent/agent-instructions.md`.)

---

## Component 4: Artifact — deal-health dashboard

**What should the dashboard show?** A Kanban board by stage (Prospect → Qualified → Proposal → Negotiation → Closed Won) with one card per deal, plus a summary bar. Per-card fields: company, deal value, days in stage, lead score, next action, and a green/amber/red health indicator. Health rules: red if days-in-stage > 14; amber if 8-14 days or lead score ≤ 5; green otherwise.

**Prompt to generate the Artifact (summary — full copy-paste version with 8 sample deals in `components/artifact/dashboard-prompt.md`):**
```
Create a single self-contained HTML page "Acme Cloud — Deal Health Dashboard"
(inline CSS, no libraries), rendered as an Artifact. Header + summary bar
(total deals, total value, Healthy/At-risk/Stalled counts). Kanban columns by
stage. Each deal card: company, value, days in stage, lead score /10, next
action, and a coloured border + pill for health (green on track, amber at
risk, red stalled). Use the 8 sample deals provided. Stalled = days_in_stage
> 14; at risk = 8-14 days or score <= 5; on track otherwise.
```

**Screenshot / description of final Artifact:** A light, clean single-page board. Five stage columns left to right; each card carries the company, value (e.g. $84k), days-in-stage, score, and next action. Northwind Fintech (Proposal, 19 days) and Cobalt Gaming (Qualified, 22 days) render with red borders and a ⚠ Stalled pill; Brightwave Commerce and Vertex Health (Closed Won) are green; the top summary bar reads e.g. "8 deals · $612k · 4 Healthy · 2 At-risk · 2 Stalled". The team sees what to act on in one glance, and the Artifact can be shared via its Publish link.
