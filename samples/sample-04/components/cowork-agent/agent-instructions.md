# Cowork Agent Instructions — Monthly Categorisation

> Paste the instructions below into Cowork (or a normal Claude chat), then paste in the rows
> from `sample_statement.csv`. Ready to run as-is.

## Agent Goal

Given a month of bank transactions, this agent sorts every spending line into one of 7 named
categories, then totals each category and shows its share of the month's total spend.

## Spending Categories (7)

- **Groceries** — supermarkets, food shops (Whole Foods, Grocery Store)
- **Food & Dining** — coffee, restaurants, takeaway (Starbucks, Chipotle, Restaurant Dinner, Uber Eats)
- **Transport** — rideshare and fuel (Uber Ride, Gas Station)
- **Bills & Utilities** — electric, internet, phone (Electric Bill, Internet Service, Phone Bill)
- **Subscriptions** — streaming and memberships (Amazon Prime, Netflix, Spotify)
- **Health** — pharmacy and medical (Pharmacy CVS)
- **Other** — cash withdrawals, general shopping, anything that fits nowhere else (ATM Withdrawal, Amazon Purchase)

## Instructions (ready to paste)

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

Transactions:
[PASTE THE ROWS FROM sample_statement.csv HERE]
```

## Example Categorised Output (from `sample_statement.csv`)

**Categorised transactions:**

| Date       | Description               | Amount   | Category          |
|------------|---------------------------|----------|-------------------|
| 2024-01-03 | Starbucks Coffee          | -$5.50   | Food & Dining     |
| 2024-01-05 | Amazon Prime Subscription | -$14.99  | Subscriptions     |
| 2024-01-08 | Whole Foods Market        | -$127.43 | Groceries         |
| 2024-01-10 | Netflix                   | -$15.49  | Subscriptions     |
| 2024-01-11 | Uber Ride                 | -$18.20  | Transport         |
| 2024-01-12 | Pharmacy CVS              | -$32.10  | Health            |
| 2024-01-14 | Electric Bill             | -$89.00  | Bills & Utilities |
| 2024-01-15 | Internet Service          | -$59.99  | Bills & Utilities |
| 2024-01-16 | Chipotle                  | -$12.75  | Food & Dining     |
| 2024-01-18 | Gas Station               | -$65.00  | Transport         |
| 2024-01-20 | Spotify                   | -$9.99   | Subscriptions     |
| 2024-01-22 | Grocery Store             | -$93.20  | Groceries         |
| 2024-01-24 | Restaurant Dinner         | -$48.00  | Food & Dining     |
| 2024-01-25 | ATM Withdrawal            | -$100.00 | Other             |
| 2024-01-26 | Amazon Purchase           | -$34.99  | Other             |
| 2024-01-28 | Uber Eats                 | -$22.50  | Food & Dining     |
| 2024-01-30 | Phone Bill                | -$45.00  | Bills & Utilities |

**Summary:**

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

**Flags:** ATM Withdrawal ($100.00) is a round-number cash charge — confirm what it was spent on. Whole Foods ($127.43) is the largest single charge. Three active subscriptions detected: Amazon Prime, Netflix, Spotify.

(Income that was correctly ignored: Salary +$3,500.00, Freelance +$800.00, and the $5,000.00 opening balance.)
