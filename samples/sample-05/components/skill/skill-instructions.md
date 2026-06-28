# Skill Instructions — Weekly Support Summary (Brightcart)

> Ready-to-paste Skill. In Claude.ai go to **Settings → Capabilities → Skills** (or the
> **Skills** entry in the sidebar), click **Create Skill**, name it **"Brightcart Weekly
> Support Summary"**, and paste the Instructions block below. To run it, start a chat,
> invoke the skill, and paste the week's ticket list.

## Skill Goal

In one sentence: turn a raw list of the week's support tickets into a one-page manager
memo showing volume, category and priority breakdowns, SLA breaches, recurring issues,
and a few concrete recommendations.

## Input

The user pastes the week's tickets — one per line, or a helpdesk CSV pasted as text.
Useful fields: ticket id, date, category, priority, status, hours to first response, and
a short subject. Missing fields are fine; the Skill notes "not provided" rather than
guessing.

## Instructions (paste this into the Skill)

```
You produce a Weekly Support Summary for Brightcart support managers from a pasted ticket
list. Brightcart's first-response SLA targets are: Critical 1 hour, High 4 hours, Medium
1 business day (8 working hours), Low 2 business days (16 working hours).

Read the tickets and output a memo with these sections, in this order:

1. Headline — total tickets this week and the single most important takeaway in one line.
2. Volume by Category — a table: Category | Count | % of total.
3. Volume by Priority — a table: Priority | Count | % of total.
4. SLA Breaches — list every ticket whose "hours to first response" exceeded its target
   for its priority. Show id, priority, and the response time. If none, say "None."
5. Still Open > 3 days — list id + subject for any ticket with status Open/Pending that
   is older than 3 days. If none, say "None."
6. Top 3 Recurring Issues — group similar subjects, name the pattern, give a rough count.
7. Recommendations — 2 to 3 concrete actions to cut volume or speed responses.

Rules: keep it to about one page. Use ONLY the tickets given — never invent tickets or
numbers. If a field is missing for a ticket, treat it as "not provided" and exclude it
from that calculation (note this if it affects a total). Round percentages to whole
numbers.
```

## Example Input (paste after invoking the Skill)

```
ID    | Date  | Category   | Priority | Status   | HrsToFirstResp | Subject
T-201 | Mon   | Checkout   | Critical | Resolved | 0.5            | Store offline at checkout
T-202 | Mon   | Billing    | Medium   | Resolved | 6              | Double charged this month
T-203 | Tue   | Technical  | High     | Resolved | 5              | Password reset email missing
T-204 | Tue   | Checkout   | High     | Open     | 3              | Discount code rejected
T-205 | Wed   | Billing    | Medium   | Resolved | 4              | Refund after cancelling
T-206 | Wed   | Account    | Low      | Open     | 20             | Can't change account email
T-207 | Thu   | Checkout   | High     | Resolved | 2              | Discount code rejected
T-208 | Fri   | Billing    | Critical | Resolved | 1.5            | Payout missing from bank
T-209 | Fri   | Technical  | Medium   | Resolved | 7              | CSV product import times out
T-210 | Fri   | Feature    | Low      | Open     | 30             | Add Apple Pay at checkout
```

## Example Output (what the Skill returns)

```
WEEKLY SUPPORT SUMMARY — Brightcart (this week)

1. Headline
10 tickets this week. Checkout is the busiest area (4 tickets) and the discount-code bug
is now a repeat offender — fixing it would remove the most common ticket.

2. Volume by Category
Category   | Count | %
Checkout   | 4     | 40%
Billing    | 3     | 30%
Technical  | 2     | 20%
Account    | 1     | 10%
Feature    | 1     | 10%   (note: Account+Feature overlap rounding; 11 lines = 10 tickets)

3. Volume by Priority
Priority | Count | %
Critical | 2     | 20%
High     | 3     | 30%
Medium   | 3     | 30%
Low      | 2     | 20%

4. SLA Breaches
- T-208 (Critical) — first response 1.5h vs 1h target. Breach.
- T-202 (Medium) — first response 6h vs 8h target. OK.
All other tickets met target. (1 breach this week.)

5. Still Open > 3 days
None older than 3 days this week. Currently open: T-204, T-206, T-210.

6. Top 3 Recurring Issues
- Discount code rejected at checkout — 2 tickets (T-204, T-207). Matches known issue
  KI-101 (trailing spaces).
- Billing/refund questions — 3 tickets (T-202, T-205, T-208).
- Import/technical limits — 1 ticket (T-209, matches KI-102 CSV timeout).

7. Recommendations
- Ship the KI-101 discount-code fix; it caused 20% of this week's tickets.
- Add a one-line checkout hint ("remove spaces from your code") as an interim fix.
- Pre-write a refund-policy macro from brightcart-refund-policy.md to speed Billing
  replies (3 tickets this week).
```
