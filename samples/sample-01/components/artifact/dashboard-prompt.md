# Artifact Prompt — Northwind Live Status Dashboard

> A complete, copy-paste prompt that makes Claude generate a one-page HTML ops dashboard as an
> Artifact. To use it: open a normal chat in Claude.ai, paste the prompt block below, and Claude
> returns the dashboard in the Artifact panel on the right. Then ask for tweaks in plain English.

## Prompt to Generate the Dashboard (copy this whole block)

```
Create a single self-contained HTML page (inline CSS and JS, no external files or libraries) that
works as a wall dashboard for Northwind Logistics' ops room. It will be left running on a monitor.

Layout:
- Dark theme (near-black background, light text), large and readable from across a room.
- A header with the title "Northwind Logistics — Ops Command Center" on the left and a
  "Last refreshed: <time>" stamp on the right that updates from the browser clock every 30 seconds.
- Six metric cards in a 3-column by 2-row grid. Each card shows: a big number, a small label
  underneath, and a coloured status dot (green / amber / red) in the corner.

Show these six metrics with this sample data:
1. On-time delivery rate — 98.5% — green
2. Shipments at risk — 310 — amber
3. Late shipments — 130 — green
4. Open P1 tickets — 1 — red
5. Depots operational — 7 of 8 — amber
6. Average ticket age — 72 min — amber

Use green = #22c55e, amber = #f59e0b, red = #ef4444. Make it a static demo: hard-code the sample
data above in a JavaScript object so it renders with no backend. Add a short comment in the JS
showing where live values from MCP tools (get_shipment_health, list_open_tickets, get_depot_status)
would be plugged in later. Keep it to one screen with no scrolling at 1080p.
```

## Metrics to Display

1. On-time delivery rate (today, %) — green/amber/red by the late-shipment thresholds
2. Shipments at risk (count)
3. Late shipments (count, and % of total)
4. Open P1 tickets (count) — any open P1 turns this red
5. Depots operational (e.g. "7 of 8")
6. Average ticket age (minutes)

## Iteration Notes

After the first version, refine it in plain English. Typical follow-up prompts that worked well:
- "Make the numbers bigger and the labels smaller — it's viewed from 4 metres away."
- "Move 'Open P1 tickets' to the top-left so the most urgent metric is read first."
- "Add a thin coloured bar across the top of each card matching its status colour."
- "Show the late shipments card as '130 (1.5%)' so we see the count and the percentage together."
- "Dim the whole screen slightly between 8pm and 6am so it's not glaring overnight."

Record what you changed and why so the next person understands the final layout. For Northwind the
key change was reordering the cards to put the single red P1 metric first — the team needs the most
urgent thing top-left, not buried in the grid.
