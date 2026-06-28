# Skill Instructions — Budget vs Actual Analyser

> Paste the instructions below into a Claude chat (or save as a Skill). It already contains a
> sample budget, so you can run it against the categorised totals from the Cowork agent.

## Skill Goal

Compares a planned monthly budget against what you actually spent per category, and returns a
variance report: over/under by category, the overall over/under, and a few concrete suggestions.

## Input Format

The user provides:
1. A budget table (category, budgeted amount) — a sample one is below.
2. The per-category totals from the Cowork agent in Component 2.

## Sample Budget (used in the worked example)

| Category          | Budgeted |
|-------------------|----------|
| Groceries         | $200     |
| Food & Dining     | $100     |
| Transport         | $80      |
| Bills & Utilities | $200     |
| Subscriptions     | $30      |
| Health            | $50      |
| Other             | $100     |
| **Total**         | **$760** |

## Instructions (ready to paste)

```
Given a budget table and the actual per-category spending below, produce a variance report.

For each category, output a row: Category | Budgeted | Actual | Variance | Status
- Variance = Budgeted - Actual (a negative number means I overspent).
- Status = "Over Budget" if Actual > Budgeted, "On Track" if within $5 either way,
  otherwise "Under Budget".

Then output:
- Total budgeted vs total actual, and the overall over/under amount.
- The top 3 categories where I overspent, largest overspend first.
- 2-3 specific, friendly suggestions to get back on budget next month.

Budget:
[PASTE BUDGET TABLE]

Actual spending:
[PASTE CATEGORISED TOTALS FROM THE COWORK AGENT]
```

## Example Variance Report (sample budget vs `sample_statement.csv` actuals)

| Category          | Budgeted | Actual    | Variance  | Status       |
|-------------------|----------|-----------|-----------|--------------|
| Groceries         | $200     | $220.63   | -$20.63   | Over Budget  |
| Food & Dining     | $100     | $88.75    | +$11.25   | Under Budget |
| Transport         | $80      | $83.20    | -$3.20    | On Track     |
| Bills & Utilities | $200     | $193.99   | +$6.01    | Under Budget |
| Subscriptions     | $30      | $40.47    | -$10.47   | Over Budget  |
| Health            | $50      | $32.10    | +$17.90   | Under Budget |
| Other             | $100     | $134.99   | -$34.99   | Over Budget  |
| **Total**         | **$760** | **$794.13** | **-$34.13** | Over Budget |

**Overall:** budgeted $760.00, actually spent $794.13 — **over by $34.13.**

**Top 3 overspends:**
1. Other — over by $34.99
2. Groceries — over by $20.63
3. Subscriptions — over by $10.47

**Suggestions:**
- "Other" is your biggest miss: the $100 ATM withdrawal and the $34.99 Amazon purchase have no clear category — track what cash is for next month so it stops being a black hole.
- You are paying for three streaming services ($40.47). Dropping one would put Subscriptions back under budget.
- Groceries went over by only $20 — either bump the budget to $225 or skip one mid-week top-up shop.
