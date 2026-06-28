# Sample 01 — AI Ops Command Center

> **Problem Statement:** Your operations are run from memory. Build and deploy an AI ops command centre.

This is a **worked example you can copy and adapt.** Everything below is filled in for a
fictional company called **Northwind Logistics** (a mid-size parcel-delivery and warehouse
operation). Read it top to bottom, then swap in your own company name, your own documents, and
your own numbers. You do **not** need to write any code, use a terminal, or get an API key.

## What you'll build

A single "command centre" you run entirely inside your normal Claude.ai subscription. It has
four parts that work together:

1. **A Claude Project** that has read every Northwind runbook and SOP, so anyone can ask
   "what do we do when a depot loses power?" and get the correct, document-grounded answer.
2. **An MCP connection** (added through Claude Desktop) that lets Claude pull *live* ops numbers
   — open tickets, late shipments, depot status — instead of relying on what someone remembers.
3. **A Cowork agent** that writes a tidy **daily ops briefing** every morning so the team starts
   the day knowing exactly what needs attention.
4. **An Artifact** — a one-page HTML dashboard — that shows the key metrics at a glance and can
   be dropped on a screen in the ops room.

The point: operations stop being run "from memory." The knowledge lives in the Project, the live
numbers come through MCP, the morning summary is automatic, and the dashboard is always on.

## Components to Build

Work through each component below. Check it off when done. Each one has a fully worked file in
the `components/` folder you can copy from.

- [x] **Claude Project: grounded on runbooks + SOPs**
  - Upload Northwind's runbooks and SOPs to a Claude Project
  - Paste the ready-made system prompt that grounds Claude in those documents
  - Test: can Claude answer operational questions accurately? (3 test questions provided)
  - Worked file: `components/claude-project/system-prompt.md`

- [x] **MCP server: real-time status tools**
  - Three tools that expose live ops data to Claude: depot status, ticket queue, shipment health
  - Connected through Claude Desktop using your subscription — no API key
  - Worked file: `components/mcp-server/tool-plan.md`

- [x] **Cowork: daily ops briefing agent**
  - A Cowork agent that produces a one-page morning briefing every day at 7:00am
  - Reads the MCP tools + the Project documents, writes a fixed-format summary
  - Worked file: `components/cowork-agent/agent-instructions.md`

- [x] **Artifact: live status dashboard**
  - A static HTML dashboard with 6 ops metrics and green/amber/red status colours
  - Worked file: `components/artifact/dashboard-prompt.md`

## Architecture Plan

```
┌────────────────────────────────────────────────────────────────┐
│              Northwind Logistics — AI Ops Command Center        │
├────────────────────────────────────────────────────────────────┤
│  Claude Project "Northwind Ops Brain": holds 5 runbooks + SOPs  │
│  (depot outage, late-shipment, returns, on-call, safety) so     │
│  Claude answers ops questions grounded in our own documents.    │
├────────────────────────────────────────────────────────────────┤
│  MCP tools (via Claude Desktop): get_depot_status,              │
│  list_open_tickets, get_shipment_health — live numbers on       │
│  demand instead of "what did someone remember this morning".    │
├────────────────────────────────────────────────────────────────┤
│  Cowork agent "Morning Ops Briefing": runs 7:00am daily, pulls  │
│  the MCP tools, writes a one-page briefing (status, incidents,  │
│  metrics, today's actions) and posts it to the team.            │
├────────────────────────────────────────────────────────────────┤
│  Artifact "Ops Wall Dashboard": one-page HTML screen showing 6  │
│  key metrics with green/amber/red dots, left on a monitor in    │
│  the ops room all day.                                          │
└────────────────────────────────────────────────────────────────┘
```

## Use it with your Claude.ai subscription

No API key needed. Just your normal Claude.ai login. Follow these steps in order. (Where it says
"Northwind", use your own company. The exact text to paste lives in the `components/` files.)

1. **Open Claude.ai** in your browser and sign in as you normally do.
2. **Create a new Project.** Click **Projects** in the left sidebar, then click **+ Create
   project**. Name it `Northwind Ops Brain` and give it the description
   "Answers operations questions using our runbooks and SOPs."
3. **Upload your documents.** Inside the Project, find **Project knowledge** on the right and click
   **+ Add content** → **Upload files**. Upload these five files (use your real ones):
   `depot-outage-runbook.pdf`, `late-shipment-runbook.pdf`, `returns-sop.pdf`,
   `on-call-escalation.pdf`, `warehouse-safety-sop.pdf`.
4. **Paste the system prompt.** Still in the Project, click **Set project instructions** (the
   pencil / "Instructions" box) and paste the full prompt from
   `components/claude-project/system-prompt.md`. Click **Save**.
5. **Test the Project.** Start a new chat *inside the Project* and ask the three test questions in
   that same file, for example: *"A depot just lost power. What are the first three steps and who
   do I call?"* Check the answer matches your runbook and cites the document.
6. **Add live data with MCP (optional but recommended).** Download the free **Claude Desktop** app
   and sign in with the same subscription. Open **Settings → Connectors** (or **Developer →
   Edit Config**) and add the three connectors described in `components/mcp-server/tool-plan.md`.
   Once connected, Claude can call `get_depot_status`, `list_open_tickets`, and
   `get_shipment_health`. **No API key needed** — the connection uses your logged-in subscription.
7. **Set up the daily briefing in Cowork.** In Claude, open **Cowork**, click **New agent**, name
   it `Morning Ops Briefing`, and paste the instructions from
   `components/cowork-agent/agent-instructions.md`. Set it to run on a schedule at 7:00am.
8. **Build the dashboard Artifact.** Start a normal chat and paste the prompt from
   `components/artifact/dashboard-prompt.md`. Claude returns an HTML dashboard in the Artifact
   panel on the right. Ask for tweaks in plain English until it looks right, then click the
   Artifact's menu to **publish/share** it.
9. **Share it with your team.** Open the Project, click **Share**, and add one teammate so they
   can ask the Ops Brain questions too.

That's the whole command centre — Project + MCP + Cowork + Artifact — all inside Claude.ai.

## Deployment Checklist

- [ ] Claude Project `Northwind Ops Brain` created and the 5 documents uploaded
- [ ] System prompt pasted into project instructions and the 3 test questions answered correctly
- [ ] MCP connectors added in Claude Desktop and `get_depot_status` returns live data
- [ ] Cowork `Morning Ops Briefing` agent runs and produces the one-page briefing
- [ ] Dashboard Artifact renders correctly with all 6 metrics and status colours
- [ ] Shared with at least one team member

## Your Deployed URL

Once you publish the dashboard Artifact, paste its share link here, e.g.
`https://claude.ai/public/artifacts/northwind-ops-wall` (this is an example placeholder —
replace it with your own published Artifact link). The Project itself is reached from the
**Projects** list in your Claude.ai sidebar.

## Reflection

Answer these after you finish:

1. **What problem does your solution actually solve?**
   Northwind used to run mornings on memory and Slack threads — nobody had one trusted view of
   open tickets, late shipments, or depot status. Now the runbooks live in the Project, the live
   numbers come through MCP, the morning briefing is automatic, and the wall dashboard is always
   on. New staff can self-serve answers instead of interrupting a senior dispatcher.

2. **Which Claude.ai feature was most useful and why?**
   The Claude Project was the biggest win: grounding Claude in our own runbooks meant answers were
   correct and cited, not guessed. The Cowork daily briefing was a close second because it removed
   a 20-minute manual task every morning.

3. **What would you add next?**
   A fourth MCP tool for live driver/vehicle locations, and a weekly trend Artifact so we can see
   whether late-shipment rates are improving month over month.
