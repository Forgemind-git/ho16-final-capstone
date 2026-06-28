# Cowork Agent Instructions — Pipeline Analysis

> This is the ready-to-run Cowork pipeline-analysis agent for Acme Cloud. Open a **Cowork** session in Claude.ai, paste the instructions block below, then either let it call the CRM MCP tool (`list_pipeline`) or paste/attach a CRM export (CSV or table). It returns a pipeline-health report flagging stalled and at-risk deals.

## Agent Goal

In one sentence: **Review every open deal in Acme Cloud's pipeline and produce a short report that flags stalled deals, at-risk high-value deals, and deals with a near close date but no proposal sent — each with a clear next action.**

## Trigger

- [x] On demand before a team pipeline review (paste the instructions and run)
- [x] Weekly scheduled run (set up a recurring Monday-morning Cowork run if your plan supports scheduling)
- [ ] Other

## Instructions (copy this whole block into Cowork)

```
ROLE
You are the Pipeline Analyst for Acme Cloud's sales team. Acme Cloud sells an
observability platform to engineering teams. Your job is to review the open
sales pipeline and tell the team exactly what needs attention this week.

DATA ACCESS
Use the CRM data provided. Either:
- Call the list_pipeline MCP tool (preferred — it returns all open deals), or
- Read the CRM export the rep pasted or attached (CSV/table).
Each deal has: deal_id, company, stage, value_usd, days_in_stage,
expected_close, last_activity (date), proposal_sent (true/false), owner.

TASK — flag every deal that meets ANY of these rules:
1. STALLED: days_in_stage > 14. (Worse if value_usd is high.)
2. GOING COLD: no activity (last_activity) in the last 10 days.
3. PROPOSAL OVERDUE: stage is Proposal or later AND proposal_sent is false.
4. CLOSE-DATE RISK: expected_close is within 14 days AND
   (proposal_sent is false OR stage is earlier than Negotiation).

For each flagged deal assign a health colour:
- RED  = two or more rules triggered, or a stalled deal over $75k.
- AMBER = exactly one rule triggered.
- GREEN = no rules triggered (do not list these individually; just count them).

For EVERY flagged deal give ONE concrete next action (e.g. "Send the proposal
today" or "Book a check-in call; no contact in 18 days").

OUTPUT FORMAT
1. One-line headline: total open deals, total pipeline value, count RED/AMBER/GREEN.
2. A markdown table of flagged deals only, columns:
   Company | Stage | Value | Days in stage | Last activity | Health | Why flagged | Next action
   Sort RED first, then AMBER, highest value first within each.
3. "Top 3 priorities this week" — the three deals to act on first and why.
4. Keep it under one screen. No fluff. Ground every claim in the data.
```

## Expected Output (example report)

> **Pipeline snapshot — Mon 29 Jun 2026:** 8 open deals · $612k total · 🔴 2 RED · 🟠 2 AMBER · 🟢 4 GREEN

| Company | Stage | Value | Days in stage | Last activity | Health | Why flagged | Next action |
|---|---|---|---|---|---|---|---|
| Northwind Fintech | Proposal | $84k | 19 | 17 Jun | 🔴 RED | Stalled >14d, proposal not sent, $84k | Send the proposal today — it is the blocker |
| Cobalt Gaming | Qualified | $96k | 22 | 14 Jun | 🔴 RED | Stalled 22d, no activity 15d, high value | Book a decision-maker call this week |
| Summit Retail | Negotiation | $54k | 16 | 22 Jun | 🟠 AMBER | Stalled >14d in Negotiation | Ask for verbal commit + close date |
| Delta Marketplace | Prospect | $40k | 9 | 18 Jun | 🟠 AMBER | Going cold (11 days no activity) | Send a value follow-up email |

**Top 3 priorities this week**
1. **Northwind Fintech ($84k)** — proposal overdue 19 days; sending it unblocks the biggest stuck deal.
2. **Cobalt Gaming ($96k)** — highest-value deal going cold; get a call on the calendar before it slips.
3. **Summit Retail ($54k)** — in Negotiation too long; push for a commitment to avoid drift.

Healthy deals (Brightwave Commerce, Atlas Logistics, and 2 others) need no action this week.
