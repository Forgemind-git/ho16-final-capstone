# MCP Server Tool Plan — Sales Intelligence Platform

> This plan describes the CRM tools that give Claude live access to Acme Cloud's pipeline data. You connect an MCP server to **Claude Desktop** under **Settings → Connectors → Add custom connector**. It runs under your normal Claude.ai subscription login — **no API key needed**. Once connected, Claude can call these tools during any chat or pipeline review.

These are **read-only** tools (safe to start with): they let Claude *see* CRM data, not change it. You can add a write tool like `update_lead_score` later once you trust the read flow.

## Tools to Build

### Tool 1 — `list_leads`
- **Name:** `list_leads`
- **Description:** Returns leads from the CRM, optionally filtered by ICP fit, owner, or status. Used when the rep asks "show me my hot leads" or "which new leads came in this week."
- **Inputs:**
  - `owner` (string, optional) — sales rep name or email.
  - `min_score` (number, optional) — only leads with lead score >= this value.
  - `status` (string, optional) — one of `new`, `working`, `qualified`, `disqualified`.
  - `limit` (number, optional, default 20) — max leads to return.
- **Returns:** JSON array of lead objects.

```json
[
  {
    "lead_id": "L-1042",
    "company": "Northwind Fintech",
    "contact": "Priya Shah",
    "title": "VP Engineering",
    "employees": 400,
    "industry": "fintech",
    "score": 9,
    "status": "qualified",
    "owner": "sam@acme.cloud",
    "last_activity": "2026-06-24"
  },
  {
    "lead_id": "L-1051",
    "company": "Tiny Apps Ltd",
    "contact": "Joe Bloggs",
    "title": "Founder",
    "employees": 12,
    "industry": "saas",
    "score": 3,
    "status": "new",
    "owner": "sam@acme.cloud",
    "last_activity": "2026-06-26"
  }
]
```

### Tool 2 — `get_deal_stage`
- **Name:** `get_deal_stage`
- **Description:** Returns the full current state of one deal, including its pipeline stage, value, age in stage, and next action. Used when the rep asks "where is the Northwind deal?"
- **Inputs:**
  - `deal_id` (string, required) — e.g. `D-3007`. (Or `company` (string) if you don't have the id.)
- **Returns:** JSON object for the deal.

```json
{
  "deal_id": "D-3007",
  "company": "Northwind Fintech",
  "stage": "Proposal",
  "value_usd": 84000,
  "days_in_stage": 19,
  "owner": "sam@acme.cloud",
  "expected_close": "2026-07-15",
  "last_activity": "2026-06-12",
  "proposal_sent": false,
  "next_action": "Send proposal — overdue"
}
```

### Tool 3 — `list_pipeline`
- **Name:** `list_pipeline`
- **Description:** Returns all open deals across stages so Claude can analyse the whole pipeline. This is the tool the Cowork pipeline agent and the dashboard Artifact rely on. Used for "review my whole pipeline" or "what's stalling?"
- **Inputs:**
  - `owner` (string, optional) — limit to one rep; omit for the whole team.
  - `stage` (string, optional) — one of `Prospect`, `Qualified`, `Proposal`, `Negotiation`, `Closed Won`, `Closed Lost`.
  - `include_closed` (boolean, optional, default false) — include closed deals.
- **Returns:** JSON array of deal objects (same shape as `get_deal_stage`).

```json
[
  { "deal_id": "D-3007", "company": "Northwind Fintech", "stage": "Proposal",
    "value_usd": 84000, "days_in_stage": 19, "expected_close": "2026-07-15",
    "last_activity": "2026-06-12", "proposal_sent": false },
  { "deal_id": "D-3011", "company": "Brightwave Commerce", "stage": "Negotiation",
    "value_usd": 120000, "days_in_stage": 6, "expected_close": "2026-07-02",
    "last_activity": "2026-06-26", "proposal_sent": true }
]
```

## Usage Scenario

During a Monday pipeline review, the rep opens Claude Desktop (with the CRM connector enabled) and types: *"Pull my open pipeline and tell me what needs attention."*

1. Claude calls **`list_pipeline`** with `owner: "sam@acme.cloud"` and gets every open deal.
2. It spots that **Northwind Fintech** (`D-3007`) has been in **Proposal** for 19 days with `proposal_sent: false` and no activity since June 12 — a stalled, high-value deal.
3. To double-check, Claude calls **`get_deal_stage`** with `deal_id: "D-3007"` for the full detail and confirms the next action is overdue.
4. The rep then asks *"any of my new leads worth chasing?"* and Claude calls **`list_leads`** with `min_score: 7, status: "new"`, surfacing the strong-fit leads to prioritise.

Claude turns the raw JSON into a plain-language summary: which deals are at risk, which leads to call first, and the single next action for each. No spreadsheets, no manual digging.
