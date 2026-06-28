# Artifact Prompt — Spending Breakdown Chart

> Paste the prompt below into a Claude chat. Claude builds a self-contained HTML chart as an
> Artifact in the right-hand panel. Sample data is already included — ready to run.

## Prompt (ready to paste)

```
Create a single self-contained HTML file (inline CSS only, no external libraries or CDNs)
that shows a personal spending breakdown for one month as an Artifact. Use this sample data:

Total spend: $794.13   Budget: $760.00

Category | Budgeted | Actual
Groceries | 200 | 220.63
Food & Dining | 100 | 88.75
Transport | 80 | 83.20
Bills & Utilities | 200 | 193.99
Subscriptions | 30 | 40.47
Health | 50 | 32.10
Other | 100 | 134.99

Show a horizontal bar chart of Actual spend per category, sorted highest first, with the
dollar amount labelled on each bar. Colour each bar green if Actual <= Budgeted, red if it is
over budget. Put the total spend and total budget (and the over/under amount) in a header.
Below the chart, add a table with columns Category, Budgeted, Actual, Variance. Keep it clean
and readable on a phone.
```

## Chart Type

- [x] **Bar chart (spending by category)** — chosen: easiest to read and directly comparable to the budget.
- [ ] Pie chart (% of total by category) — good for "share of wallet", but harder to compare to budget.
- [ ] Line chart (spending trend over months) — use this once you have uploaded several months.
- [ ] Other: a combined bar + table view (what the prompt above produces).

## Iteration Notes

First version renders 7 sorted bars with Groceries, Bills & Utilities and Other in red (over
budget) and the rest green, plus the variance table underneath. Good follow-up refinements to
ask Claude for:
- "Sort the bars by amount of overspend instead of by total spend."
- "Add each category's % of total spend at the end of its bar label."
- "Make the header show 'Over by $34.13' in red so the overspend stands out."
- "Add a thin grey marker on each bar showing where the budget line sits."
