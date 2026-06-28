# Architecture Plan — Sample 05: Customer Support Co-Pilot (Brightcart)

> This is the worked design. Use it to explain your choices to your trainer, and copy
> the pieces into your own Claude.ai account. **Brightcart** is a fictional e-commerce
> SaaS (hosted storefront + checkout + subscriptions/billing) whose support team handles
> billing, login, checkout, and refund tickets.

## Problem

Brightcart support is slow and reactive: agents re-read the same policies for every
ticket, replies are inconsistent, and managers cannot see weekly patterns. We build a
co-pilot entirely inside Claude.ai — a grounded Project, two saved prompts, a summary
Skill, and a heatmap Artifact. No code, no API key.

## Component 1: Claude Project — grounded on product docs + policies

**What documents we upload** (create each as a `.md` file, then upload to Project
knowledge). Short sample contents are below so you can build a working copy today:

- **`brightcart-faq.md`** — top how-to answers.
  - *How do I reset my password?* From the login page click **Forgot password**; a reset
    link is emailed and is valid for 60 minutes.
  - *Why was my customer's card declined at checkout?* Most declines are the bank, not
    Brightcart. Ask the shopper to retry, then check **Store → Payments → Logs**.
  - *How do I issue a refund?* **Orders → open the order → Refund**. Full or partial.
- **`brightcart-refund-policy.md`** — refund and returns rules.
  - Refunds allowed within **30 days** of purchase. Subscriptions: refund the **current
    period only**, no proration for past periods. Refunds return to the original payment
    method in **5–10 business days**. Chargebacks are handled by the Billing team only.
- **`brightcart-sla-escalation.md`** — response targets and escalation.
  - First response targets: **Critical 1 hour, High 4 hours, Medium 1 business day,
    Low 2 business days.** Escalate **payment/data-loss/security** issues to the
    **Billing/Trust team**; escalate **store-down or checkout-broken** to **Engineering**.
- **`brightcart-known-issues.md`** — current bugs + workarounds.
  - *KI-101:* Discount codes with trailing spaces fail at checkout. Workaround: re-enter
    the code without spaces. Fix ETA next release.
  - *KI-102:* CSV product import over 5,000 rows times out. Workaround: split into files
    under 2,500 rows.

**System prompt** (the full ready-to-paste version lives in
`components/claude-project/system-prompt.md`):

```
You are a senior customer support agent for Brightcart, an e-commerce SaaS that gives
online stores a hosted storefront, checkout, and subscriptions/billing engine. You answer
only from the uploaded documents: brightcart-faq.md, brightcart-refund-policy.md,
brightcart-sla-escalation.md, brightcart-known-issues.md.

For any ticket you receive:
1. Triage it — assign a Category and a Priority.
2. Draft a grounded reply the agent can review and send.
3. Cite the exact document (and section) you used.
4. If the answer is not in the documents, say so plainly and escalate per the SLA doc.

Never invent product features, prices, or policy details. Be empathetic, concise, and
professional. When unsure, ask one clarifying question instead of guessing.
```

**How we test it** (3 real tickets):

1. **Login (Technical):** "I can't log in, the reset email never arrives." → Claude
   should cite `brightcart-faq.md` (60-min reset link) and suggest checking spam.
2. **Refund (Billing):** "I cancelled 6 weeks ago, I want all my money back." → Claude
   should cite `brightcart-refund-policy.md` (30-day window, current period only) and
   decline the older charges politely.
3. **Store down (Critical, escalate):** "My whole store is offline and customers can't
   check out." → Claude should mark **Critical**, cite `brightcart-sla-escalation.md`,
   and escalate to **Engineering**.

---

## Component 2: Prompt Library — triage + reply prompts

Two reusable prompts (full text in `components/prompt-library/prompts.md`):

1. **"Triage Ticket"** — input: one ticket. Output: Category (Billing / Technical /
   Account / Feature Request / Other), Priority (Low / Medium / High / Critical),
   one-line reasoning, suggested owner.
2. **"Draft Reply"** — input: one ticket (optionally the triage). Output: an empathetic,
   grounded reply that cites the source document and gives a concrete next step, or
   politely escalates if outside policy.

**How we save them:** Claude.ai has no separate prompt-manager product, so we keep both
prompts in a **pinned chat inside the project** named "PROMPTS — copy from here." To use
one, copy it into a fresh chat and replace `[PASTE TICKET HERE]` with the real ticket.

---

## Component 3: Skill — weekly support summary

**Skill goal:** turn a raw week of tickets into a one-page manager memo so leadership can
see volume, categories, SLA breaches, recurring issues, and what to fix next.

**Inputs:** a pasted list of the week's tickets (id, date, category, priority, status,
hours-to-first-response, short subject). A helpdesk CSV export pasted as text works too.

**Output:** a short memo with: total volume, breakdown by category and priority (count +
%), SLA breaches listed, tickets unresolved > 3 days, top 3 recurring issues, and 2–3
recommendations.

**Skill instructions** (full version in `components/skill/skill-instructions.md`):

```
You produce a Weekly Support Summary for Brightcart managers from a pasted ticket list.
Output a memo with these sections, in order:
1. Headline — total tickets and the single most important takeaway.
2. Volume by Category — table: category, count, % of total.
3. Volume by Priority — table: priority, count, % of total.
4. SLA Breaches — list each ticket whose first response missed its target (Critical 1h,
   High 4h, Medium 1 business day, Low 2 business days).
5. Still Open > 3 days — list id + subject.
6. Top 3 Recurring Issues — patterns across subjects, with rough counts.
7. Recommendations — 2-3 concrete actions to cut volume or speed responses.
Keep it under one page. Use the data given; never invent tickets. If a field is missing,
note "not provided" rather than guessing.
```

---

## Component 4: Artifact — ticket-status heatmap

**What the heatmap shows:** ticket volume by **category (rows)** × **day of week
(columns)** for one week, cells shaded light→dark by count, with the number printed in
each cell. Below it, a summary table per category: Open, Resolved, Avg Resolution Time.
We chose category×day because it answers the manager's first question — *what blew up,
and when* — at a glance. We left out a priority bar chart to keep one clean Artifact.

**Prompt to generate it** (full copy-paste version in
`components/artifact/heatmap-prompt.md`):

```
Create a single self-contained HTML Artifact: a customer-support ticket-status heatmap
for Brightcart for one week. Rows = categories (Billing, Technical, Account, Checkout,
Feature Request). Columns = Mon-Sun. Shade each cell light-to-dark blue by ticket count
and print the count. Below it, a summary table: Category | Open | Resolved | Avg
Resolution (hrs). Use the sample data I provide. Inline CSS only, no external libraries.
```

**Final Artifact (description):** a clean blue heatmap grid where Checkout/Mon and
Billing/Fri are the darkest cells (the week's hotspots), plus a summary table showing
Checkout has the slowest average resolution. Published to a link for the weekly report.
