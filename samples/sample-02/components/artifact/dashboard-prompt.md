# Artifact Prompt — Deal-Health Dashboard

> This is the copy-paste prompt that makes Claude build Acme Cloud's deal-health dashboard as an **Artifact** — a single static HTML page you can open in the side panel and share. Start a normal chat in Claude.ai, paste the prompt below, and Claude returns the dashboard. The sample data for 8 deals is included in the prompt, so it works out of the box.

## Prompt (copy this whole block)

```
Create a single self-contained HTML page (inline CSS, no external files, no
JavaScript libraries) called "Acme Cloud — Deal Health Dashboard". Render it
as an Artifact.

LAYOUT
- A header with the title and a summary bar showing: total open deals, total
  pipeline value, and counts of Healthy / At-risk / Stalled deals.
- Below it, a Kanban board: one column per stage in this order —
  Prospect, Qualified, Proposal, Negotiation, Closed Won.
- Each deal is a card placed in its stage column.

EACH DEAL CARD SHOWS
- Company name (bold)
- Deal value in USD (e.g. $84k)
- Days in current stage
- Lead score out of 10
- Next action (one short line)
- A coloured left border + small status pill for health:
  green = On track, amber = At risk, red = Stalled.

HEALTH RULES
- Stalled (red): days in stage > 14.
- At risk (amber): days in stage 8-14, OR lead score <= 5.
- On track (green): everything else. Closed Won is always green.

STYLE
- Clean, modern, light background, readable on a laptop screen.
- Colour the pill and card border by health. Make stalled deals stand out.
- No login, no backend — just a static page using the sample data below.

SAMPLE DATA (8 deals)
1. Northwind Fintech   | Proposal    | $84k  | 19 days | score 9 | Next: Send proposal today
2. Cobalt Gaming       | Qualified   | $96k  | 22 days | score 8 | Next: Book decision-maker call
3. Summit Retail       | Negotiation | $54k  | 16 days | score 7 | Next: Ask for verbal commit
4. Delta Marketplace   | Prospect    | $40k  |  9 days | score 6 | Next: Send value follow-up
5. Brightwave Commerce | Negotiation | $120k |  6 days | score 9 | Next: Finalise contract terms
6. Atlas Logistics     | Qualified   | $38k  |  4 days | score 7 | Next: Schedule technical demo
7. Pinecone SaaS       | Prospect    | $22k  |  3 days | score 4 | Next: Qualify budget & timeline
8. Vertex Health       | Closed Won  | $158k |  2 days | score 10| Next: Kick off onboarding
```

## Fields to Show Per Deal

Each deal card displays these fields:

1. Company name
2. Deal value (USD)
3. Days in current stage
4. Lead score (out of 10)
5. Next action (one short line)
6. Health status — green (On track) / amber (At risk) / red (Stalled), shown as a coloured border and pill

## Iteration Notes

After generating the first version, these are the refinements worth asking Claude for (just reply in the same chat — the Artifact updates in place):

1. *"Add a colour-coded summary bar at the top with the Healthy / At-risk / Stalled counts and total pipeline value."* — gives the team the headline at a glance.
2. *"Sort the cards inside each column by deal value, highest first."* — biggest deals surface first.
3. *"Make stalled (red) cards stand out more — bolder border and a small ⚠ icon on the pill."* — draws the eye to what needs action.
4. *"Add the expected close date under the days-in-stage line."* — helps with forecasting.

When you adapt this to your own company, replace the 8 sample deals with a paste of your real pipeline (or, if you connected the CRM MCP server, ask Claude to call `list_pipeline` first and build the dashboard from the live data).
