# MCP Server Tool Plan — Northwind Ops Command Center

> These are the three live-data tools that turn the Ops Brain from "what someone remembers" into
> "what is actually happening right now." You connect them through the **Claude Desktop** app
> using your existing Claude subscription — **no API key**. In Claude Desktop, open
> **Settings → Connectors** (or **Developer → Edit Config**) and add the Northwind ops connector;
> once it's connected, Claude can call the three tools below in any chat.

## Tools to Build

### Tool 1 — get_depot_status
- **Name:** `get_depot_status`
- **Description:** Fetches the live operating status of one depot — power, network, staffing, and
  an overall green/amber/red roll-up — so Claude can answer "is Chicago South healthy right now?"
- **Inputs:** `depot_id` (string, e.g. `"DEP-CHI-01"`). Omit to get all depots.
- **Returns (example JSON):**
```json
{
  "depot_id": "DEP-CHI-01",
  "name": "Chicago South",
  "power": "ok",
  "network": "ok",
  "staff_on_shift": 14,
  "staff_expected": 16,
  "status": "amber",
  "last_check": "2026-06-28T06:55:00Z"
}
```

### Tool 2 — list_open_tickets
- **Name:** `list_open_tickets`
- **Description:** Returns the current open ops ticket queue with priority and how long each ticket
  has been open, so Claude can tell the team what needs attention first.
- **Inputs:** `priority` (optional string: `"P1"`, `"P2"`, or `"P3"`). Omit to return all.
- **Returns (example JSON):**
```json
[
  { "id": "TKT-4471", "title": "Conveyor jam line 3", "priority": "P1", "age_minutes": 35, "depot": "DEP-CHI-01" },
  { "id": "TKT-4472", "title": "Scanner offline dock 2", "priority": "P2", "age_minutes": 110, "depot": "DEP-NYC-02" }
]
```

### Tool 3 — get_shipment_health
- **Name:** `get_shipment_health`
- **Description:** Returns today's shipment counts split into in-window, at-risk, and late, plus the
  late percentage — the headline number for the morning briefing and the wall dashboard.
- **Inputs:** `date` (optional string `"YYYY-MM-DD"`). Omit to use today.
- **Returns (example JSON):**
```json
{
  "date": "2026-06-28",
  "total": 8420,
  "in_window": 7980,
  "at_risk": 310,
  "late": 130,
  "late_pct": 1.5
}
```

## How Claude Would Use These Tools

In plain language: a dispatcher opens a chat and types *"How are we doing this morning?"* Claude
calls `get_shipment_health()` to get today's late count, `list_open_tickets("P1")` to find the
urgent tickets, and `get_depot_status()` for every depot. It then writes a short summary —
"On-time is 98.5%, one P1 ticket open (conveyor jam at Chicago South, 35 min), all depots green
except Chicago South which is amber on staffing." Because the Project also holds the runbooks,
Claude can immediately add the right next step and escalation contact for that conveyor jam,
all in one answer — no spreadsheets, no guessing, and no API key.
