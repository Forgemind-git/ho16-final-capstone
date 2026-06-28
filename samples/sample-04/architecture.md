# Architecture Plan — Sample 04: Personal Finance Copilot

> A worked design you can copy and adapt. Use it to explain your choices to your trainer.
> All numbers below come from the included `sample_statement.csv` (one month, 17 expenses,
> total spend **$794.13**).

## Problem

You never know where your money goes. Build and deploy a personal-finance copilot using
Claude.ai subscription features — no code, no API key.

## Component 1: Claude Project — grounded on bank exports

**What files will you upload?**
- `sample_statement.csv` — the included sample bank statement (date, description, amount). Start here.
- A simple budget you maintain yourself. You can either paste the budget table from Component 3 into a chat, or save it as `my_budget.csv` and upload it too. Example rows: `Groceries,200` / `Bills & Utilities,200`.

**System prompt (ready to paste — also in `components/claude-project/system-prompt.md`):**
```
You are my Personal Finance Copilot. I have uploaded my bank statement as a CSV
(columns: date, description, amount). Negative amounts are money I spent; positive
amounts are money I received.

Your job is to:
- Answer questions about my spending using ONLY the numbers in the uploaded statement.
- When I ask about a "category" (e.g. groceries, transport, subscriptions), group the
  matching transactions yourself and show me which rows you counted.
- Always show the total in dollars and, when useful, the % of my total spending.
- Point out anything unusual: large one-off charges, duplicate charges, or recurring
  subscriptions I might have forgotten.

Rules:
- Never invent or estimate a number. If it is not in the statement, say so.
- Ignore the OPENING BALANCE row and income rows (SALARY, FREELANCE) when totalling spending.
- If a transaction could fit more than one category, tell me and ask which I prefer.
```

**How will you test it?** Ask these three and check against the sample statement:
- "How much did I spend on groceries this month?" → should total **$220.63** (Whole Foods $127.43 + Grocery Store $93.20).
- "What is my single largest spending category?" → **Groceries ($220.63)**, just ahead of Bills & Utilities ($193.99).
- "Which subscriptions am I paying for?" → **Amazon Prime $14.99, Netflix $15.49, Spotify $9.99** (total $40.47).

---

## Component 2: Cowork Agent — monthly categorisation

**Agent goal:**
- Read every transaction in the statement and assign it to exactly one of 7 categories, then total each category and show its share of total spending.

**Categories you will use (7):**
1. Groceries
2. Food & Dining (coffee, restaurants, takeaway)
3. Transport (rideshare, fuel)
4. Bills & Utilities (electric, internet, phone)
5. Subscriptions (streaming, memberships)
6. Health (pharmacy, medical)
7. Other (cash withdrawals, general shopping, anything that fits nowhere else)

**Agent instructions (ready to paste — also in `components/cowork-agent/agent-instructions.md`):**
```
You are my monthly transaction categorisation agent.

Input: a list of bank transactions with columns date, description, amount.
Negative amounts are spending; ignore positive amounts (income) and any OPENING BALANCE row.

Task: assign each spending transaction to ONE of these 7 categories:
Groceries; Food & Dining; Transport; Bills & Utilities; Subscriptions; Health; Other.

Output, in this order:
1. A table with columns: Date | Description | Amount | Category (one row per transaction).
2. A summary table: Category | Total Spent | % of Total Spend, sorted high to low.
3. The grand total of spending.
4. A short "Flags" list: any single charge over $100, any merchant you were unsure about,
   and any subscription you spotted.

Use plain dollar amounts rounded to 2 decimals. Do not invent transactions.
```

**Worked output for the sample statement:**

| Category          | Total Spent | % of Total |
|-------------------|-------------|------------|
| Groceries         | $220.63     | 27.8%      |
| Bills & Utilities | $193.99     | 24.4%      |
| Other             | $134.99     | 17.0%      |
| Food & Dining     | $88.75      | 11.2%      |
| Transport         | $83.20      | 10.5%      |
| Subscriptions     | $40.47      | 5.1%       |
| Health            | $32.10      | 4.0%       |
| **Total**         | **$794.13** | **100%**   |

Flags: one charge over $100 (ATM Withdrawal $100.00); Whole Foods $127.43 is the largest single charge; 3 active subscriptions (Amazon Prime, Netflix, Spotify).

---

## Component 3: Skill — budget vs actual analyser

**Skill goal:**
- Compare a planned monthly budget against actual spend per category and produce a variance report (over/under by category, total, and a couple of concrete suggestions).

**Inputs:**
- A budget table (Category, Budgeted amount) — the sample one is below.
- The per-category totals from the Cowork agent in Component 2.

**Output:**
- A per-category table (Budgeted | Actual | Variance | Status), the total over/under, the top overspends, and 2–3 suggestions.

**Sample budget (used for the worked example):**

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

**Skill instructions (ready to paste — also in `components/skill/skill-instructions.md`):**
```
Given a budget table and the actual per-category spending below, produce a variance report.

For each category, output a row: Category | Budgeted | Actual | Variance | Status
- Variance = Budgeted - Actual (negative = overspent).
- Status = "Over Budget" if Actual > Budgeted, "On Track" if within $5, else "Under Budget".

Then output:
- Total budgeted vs total actual, and the overall over/under amount.
- The top 3 categories where I overspent, largest first.
- 2-3 specific, friendly suggestions to get back on budget next month.

Budget:
[PASTE BUDGET TABLE]

Actual spending:
[PASTE CATEGORISED TOTALS]
```

**Worked variance report for the sample month:**

| Category          | Budgeted | Actual   | Variance  | Status      |
|-------------------|----------|----------|-----------|-------------|
| Groceries         | $200     | $220.63  | -$20.63   | Over Budget |
| Food & Dining     | $100     | $88.75   | +$11.25   | Under Budget|
| Transport         | $80      | $83.20   | -$3.20    | On Track    |
| Bills & Utilities | $200     | $193.99  | +$6.01    | Under Budget|
| Subscriptions     | $30      | $40.47   | -$10.47   | Over Budget |
| Health            | $50      | $32.10   | +$17.90   | Under Budget|
| Other             | $100     | $134.99  | -$34.99   | Over Budget |
| **Total**         | **$760** | **$794.13** | **-$34.13** | Over Budget |

Top overspends: Other (-$34.99), Groceries (-$20.63), Subscriptions (-$10.47).
Suggestions: review the $100 ATM withdrawal and the $34.99 Amazon purchase under "Other"; cancel one of the three streaming subscriptions to save ~$10/month; the grocery overspend is small — round the budget up to $225 or trim one big shop.

---

## Component 4: Artifact — spending breakdown chart

**What should the chart show?**
- Spending by category for the month (a horizontal bar chart), with each category's actual vs its budget, and a budget-vs-actual table underneath. Bars are colour-coded green (within budget) or red (over budget).

**Prompt to generate the Artifact (ready to paste — also in `components/artifact/chart-prompt.md`):**
```
Create a single self-contained HTML file (inline CSS, no external libraries) that shows a
personal spending breakdown for one month as an Artifact. Use this sample data:

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
dollar amount labelled on each bar. Colour each bar green if Actual <= Budgeted, red if over.
Put the total spend and total budget in a header. Below the chart, add a table with columns
Category, Budgeted, Actual, Variance. Keep it clean and readable on a phone.
```

**Screenshot / description of final Artifact:**
- A header showing "Total spend $794.13 / Budget $760.00 (Over by $34.13)". Seven horizontal bars sorted high-to-low: Groceries, Bills & Utilities and Other appear red (over budget), the rest green. A tidy table underneath repeats the numbers. After the first version, ask Claude to "sort by amount of overspend" or "add the % of total to each bar" to refine it.
