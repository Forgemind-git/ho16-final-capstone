# Artifact Prompt — Content Calendar Tracker

> Paste the prompt below into a new chat in your FieldPro Content Engine Project. Claude renders an HTML content calendar as an Artifact on the right. Edit it by chatting ("mark piece #4 Published", "add an Owner column").

## Prompt (copy-paste ready)

```
Create a single self-contained HTML content calendar tracker for the FieldPro
content team. One file, inline CSS and JavaScript, no external libraries or fonts.

Table columns, in this order:
  #, Topic, Format, Channel, Status, Publish Date, Owner

Rules:
- Status is exactly one of: Draft, Review, Scheduled, Published. Show each as a
  colored pill — Draft grey, Review amber, Scheduled blue, Published green.
- Above the table, add a summary strip showing a count for each status
  (e.g. "Draft 3 · Review 2 · Scheduled 2 · Published 3").
- Add a filter bar with two dropdowns: one to filter by Status, one to filter by
  Channel. Selecting a value hides non-matching rows; "All" shows everything. The
  summary counts should reflect the full data, not the filtered view.
- Clean, readable design: comfortable padding, alternating row shading, a sticky
  header row. Make it work on a laptop screen.
- Pre-fill the 10 sample rows below.

Sample data (FieldPro):
1.  How small trades businesses can cut no-show appointments | Blog    | Blog     | Published | 2026-06-10 | Maya
2.  Cut no-shows: the 3-text reminder sequence              | Social  | LinkedIn | Published | 2026-06-11 | Maya
3.  Cut no-shows email teaser                               | Email   | Email    | Published | 2026-06-12 | Sam
4.  Cut no-shows 5-tweet thread                             | Social  | X        | Scheduled | 2026-06-13 | Sam
5.  Invoicing on-site before the crew leaves               | Blog    | Blog     | Review    | 2026-06-18 | Maya
6.  On-site invoicing LinkedIn post                         | Social  | LinkedIn | Draft     | 2026-06-19 | Sam
7.  Hiring your first office manager                        | Blog    | Blog     | Draft     | 2026-06-25 | Maya
8.  Office manager hiring checklist email                   | Email   | Email    | Scheduled | 2026-06-26 | Sam
9.  5 scheduling mistakes that cost trades money            | Social  | X        | Review    | 2026-07-01 | Maya
10. Getting paid faster: deposits explained                 | Blog    | Blog     | Draft     | 2026-07-03 | Sam

Render it as an Artifact I can keep open and update.
```

## Columns to Include

1. # (row number)
2. Topic
3. Format (Blog / Social / Email)
4. Channel (Blog / LinkedIn / Email / X)
5. Status (Draft / Review / Scheduled / Published)
6. Publish Date
7. Owner

## Iteration Notes

- First version put the status counts inside the filtered view, so they changed when we filtered. We added "summary counts should reflect the full data, not the filtered view" and that fixed it.
- We asked for colored pills after the first plain-text version — the color coding makes the board scannable at a glance.
- To update the board, just chat: "mark piece #4 as Published and set its date to 2026-07-02" or "add a new Draft row for a YouTube short about no-shows." Claude regenerates the Artifact with the change. Remember it's a tracker snapshot, not a live database — your edits live in the regenerated Artifact, so keep the latest one.
