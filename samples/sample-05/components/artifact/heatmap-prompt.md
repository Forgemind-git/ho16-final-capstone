# Artifact Prompt — Ticket-Status Heatmap (Brightcart)

> Copy-paste prompt that makes Claude build a self-contained HTML ticket-status heatmap
> Artifact. In Claude.ai, start any chat (the Brightcart project is fine), paste the
> prompt below, and send. The Artifact opens in the side panel. Click **Publish**
> (top-right of the Artifact) to get a shareable link, or screenshot it for your weekly
> report.

## What to Show (the choices we made)

- [x] **Ticket volume by category × day** — the heatmap grid (this is the core view).
- [x] **Per-category summary table** — Open, Resolved, Avg Resolution (hrs) below the grid.
- [ ] Priority distribution bar chart — left out on purpose to keep one clean Artifact.
- [ ] Resolution rate over time line chart — left out for the same reason; add later if
  managers ask for a trend.

We chose **category (rows) × day of week (columns)** because it answers a manager's first
question — *what blew up, and when* — in one glance. Darkest cells = the week's hotspots.

## Prompt (copy everything between the lines)

```
Create a single self-contained HTML Artifact: a customer-support ticket-status heatmap for
Brightcart (an e-commerce SaaS) covering one week. Requirements:

- A heatmap grid. Rows = ticket categories: Billing, Technical, Account, Checkout,
  Feature Request. Columns = days: Mon, Tue, Wed, Thu, Fri, Sat, Sun.
- Each cell shows the ticket count, and its background is shaded light-to-dark blue based
  on the count (0 = very light, highest = deep blue). Include a small legend.
- Below the grid, a summary table with columns: Category | Open | Resolved |
  Avg Resolution (hrs).
- Add a one-line title "Brightcart — Weekly Ticket Heatmap" and today's-week label.
- Inline CSS only. No external libraries, no CDN, no JavaScript charts — just an HTML
  table styled with inline/embedded CSS so it renders anywhere and can be published.
- Make it readable on a projector: clear borders, dark text on light cells, white text on
  dark cells.

Use exactly this sample data.

Heatmap counts (category x day):
Category   Mon Tue Wed Thu Fri Sat Sun
Billing      1   0   1   0   1   0   0
Technical    0   1   0   0   1   0   0
Account      0   0   1   0   0   0   0
Checkout     2   1   0   1   0   0   0
Feature      0   0   0   0   1   0   0

Summary table:
Category        Open  Resolved  AvgResolution(hrs)
Billing          0      3        4
Technical        0      2        9
Account          1      0        14
Checkout         1      3        3
Feature Request  1      0        20
```

## Iteration Notes

What we changed after the first generation:

1. **First pass** used a rainbow color scale that was hard to read on a projector — asked
   Claude to switch to a single light-to-dark **blue** scale with a legend.
2. **Second pass** the numbers vanished on the darkest cells — asked for **white text on
   dark cells, dark text on light cells** so every count stays legible.
3. **Third pass** added the summary table and bolded the two hotspots (Checkout/Mon and
   Billing across the week) so the eye lands on them first.
4. Final result: a clean blue grid where Checkout/Mon is the darkest cell and the summary
   table shows Feature Request has the slowest average resolution (20 hrs). Published to a
   link and pasted into the weekly manager report.
