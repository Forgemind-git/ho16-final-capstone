# Architecture Plan — Sample 01: AI Ops Command Center

> This is a fully worked design for a fictional company, **Northwind Logistics** (parcel delivery
> + warehousing). Copy it and replace the company name, document names, and numbers with your own.

## Problem

Northwind's operations are run from memory. Every morning a senior dispatcher reconstructs the
state of the world from Slack, a ticket tool, and a few spreadsheets, and answers the same
questions over and over ("what's our late-shipment rule again?"). We are building one AI command
centre so the knowledge is grounded, the live numbers are on tap, the morning summary is
automatic, and a dashboard is always on the wall.

## Component 1: Claude Project — grounded on runbooks + SOPs

**What documents will you upload?**
- `depot-outage-runbook.pdf` — what to do when a depot loses power, internet, or access
- `late-shipment-runbook.pdf` — thresholds and steps when shipments breach their delivery window
- `returns-sop.pdf` — how returned / undeliverable parcels are processed and restocked
- `on-call-escalation.pdf` — who is on call, contact numbers, and escalation tiers
- `warehouse-safety-sop.pdf` — incident reporting and safety stand-down procedure

**System prompt (the exact text we paste into Project instructions):**
```
You are the Operations Analyst for Northwind Logistics, a parcel-delivery and warehousing
company. You answer questions for our dispatchers, depot leads, and on-call managers.

You have access to these documents in the Project knowledge:
- depot-outage-runbook.pdf
- late-shipment-runbook.pdf
- returns-sop.pdf
- on-call-escalation.pdf
- warehouse-safety-sop.pdf

Rules:
- Answer ONLY from the uploaded documents. Do not invent procedures, names, or phone numbers.
- Always cite the document and section you used, e.g. "(depot-outage-runbook.pdf, Step 2)".
- For any incident question, give the steps in order and name who to escalate to.
- If the documents do not cover the question, say "That isn't in our runbooks — escalate to the
  on-call manager" and stop. Do not guess.
- Keep answers short and action-first: numbered steps, then the escalation contact.
```

**How will you test it?** Ask these 3 questions and confirm each answer is correct and cited:
1. "A depot just lost power. What are the first three steps and who do I call?"
2. "A shipment is 40 minutes past its delivery window. Is that an escalation, and what do we do?"
3. "How do we process a parcel that came back as undeliverable?"

---

## Component 2: MCP Server — real-time status tools

**What real-time data does your ops team need?**
- Live depot status (power/network/staffing) per depot
- The open ticket queue with priority and how long each has been open
- Shipment health: how many are in-window, at-risk, or already late today

**How it connects:** through **Claude Desktop** using the existing subscription. No API key — the
connectors are added in Claude Desktop's settings and authenticate with your normal login.

**Tool signatures (worked, with example returns):**
```
get_depot_status(depot_id: string)
  → {
      "depot_id": "DEP-CHI-01",
      "name": "Chicago South",
      "power": "ok",          // ok | degraded | down
      "network": "ok",
      "staff_on_shift": 14,
      "staff_expected": 16,
      "status": "amber",      // green | amber | red
      "last_check": "2026-06-28T06:55:00Z"
    }

list_open_tickets(priority?: "P1"|"P2"|"P3")
  → [
      { "id": "TKT-4471", "title": "Conveyor jam line 3", "priority": "P1", "age_minutes": 35 },
      { "id": "TKT-4472", "title": "Scanner offline dock 2", "priority": "P2", "age_minutes": 110 }
    ]

get_shipment_health(date?: "YYYY-MM-DD")
  → {
      "date": "2026-06-28",
      "total": 8420,
      "in_window": 7980,
      "at_risk": 310,
      "late": 130,
      "late_pct": 1.5
    }
```

See `components/mcp-server/tool-plan.md` for the full descriptions and a usage scenario.

---

## Component 3: Cowork Agent — daily ops briefing

**Agent goal:** Every morning, produce a one-page ops briefing so the team starts the day knowing
exactly what is green, what is at risk, and what to do first.

**Inputs the agent uses:**
- The three MCP tools (`get_depot_status` for each depot, `list_open_tickets`, `get_shipment_health`)
- The Project runbooks, to map any incident to the correct response and escalation contact
- A fixed briefing template (so the format is the same every day)

**Output format:** a one-page briefing with four fixed sections — **Overall status**,
**Open incidents**, **Key metrics**, **Today's actions** — using green/amber/red labels.

**Agent instructions (summary; full version in the component file):**
```
Each morning at 7:00am, call get_shipment_health(today), list_open_tickets(), and
get_depot_status() for all depots. Summarise into the four-section template. Mark anything
breaching a runbook threshold as red and name the escalation owner from on-call-escalation.pdf.
If any tool fails or data is older than 30 minutes, say so clearly at the top instead of guessing.
```

The complete instructions and an example output are in
`components/cowork-agent/agent-instructions.md`.

---

## Component 4: Artifact — live status dashboard

**What metrics should the dashboard show? (6)**
1. On-time delivery rate (today, %)
2. Shipments at risk (count)
3. Late shipments (count)
4. Open P1 tickets (count)
5. Depots operational (e.g. 7 of 8)
6. Average ticket age (minutes)

**Prompt you will use to generate the Artifact:** a complete copy-paste prompt that produces a
dark-themed, single-page HTML dashboard with sample data and green/amber/red status dots. The full
prompt is in `components/artifact/dashboard-prompt.md`.

**Screenshot / description of final Artifact:** a single dark screen, six metric cards in a 3×2
grid, each card showing a big number, a label, and a coloured status dot. A "Last refreshed"
timestamp sits in the top-right. It is left running on a monitor in the ops room. (Replace this
with your own screenshot once built.)
