# Sample 04 — Personal Finance Copilot

> **Problem Statement:** You never know where your money goes. Build and deploy a personal-finance copilot.

This is a **worked, copy-and-use example.** Everything below is filled in and ready to paste
into your Claude.ai subscription. A real sample bank statement, `sample_statement.csv`, is
included in this folder so you can build the whole thing without using your own data first.
Once it works with the sample, **copy and adapt** it to your real statement.

## What you are building

A no-code "copilot" that answers the question *"where did my money go this month?"* using four
Claude.ai subscription features working together:

1. **A Claude Project** grounded on your bank export — ask plain-English questions about your spending.
2. **A Cowork agent** that reads the transactions and sorts every line into 7 named categories.
3. **A Skill** that compares a planned budget against what you actually spent (a variance report).
4. **An Artifact** — a spending-breakdown chart you can look at and share.

No code. No API key. Just your normal Claude.ai login.

## Use it with your Claude.ai subscription

No API key needed. Just your normal Claude.ai login.

1. Open Claude.ai and create a new Project called **"Personal Finance Copilot"** (left sidebar → **Projects** → **+ New Project**).
2. Upload the included `sample_statement.csv` into the Project (open the Project → **Project knowledge** → **Add content** → upload the file). This is a real one-month sample statement with 17 expenses.
3. Open `components/claude-project/system-prompt.md`, copy the system prompt, and paste it into the Project's **Custom instructions** box. Save.
4. Start a new chat inside the Project and ask the three test questions at the bottom of that file (for example, *"What is my single largest spending category?"*). Confirm the answers match the numbers in the sample statement.
5. Categorise the month: open **Cowork** (or a normal chat), paste the agent instructions from `components/cowork-agent/agent-instructions.md`, then paste in (or upload) the rows from `sample_statement.csv`. Claude returns a categorised table plus a per-category total. Save that table — you will reuse it.
6. Run the budget check: paste the Skill instructions from `components/skill/skill-instructions.md`, fill in the sample budget table it already contains, paste the categorised totals from step 5, and Claude returns a budget-vs-actual variance report.
7. Make the chart: paste the prompt from `components/artifact/chart-prompt.md` into a chat. Claude generates a self-contained HTML chart as an **Artifact** in the right-hand panel. Click the Artifact to view it.
8. **Copy and adapt:** export your own bank statement as CSV from your bank's website, upload it to the same Project in place of (or alongside) the sample, and repeat steps 4–7 with your real data and your own budget numbers.

Tip: keep all four steps inside the same Project so Claude always has the statement in context.

## Architecture Plan

```
┌────────────────────────────────────────────────────────────┐
│                 Personal Finance Copilot                   │
├────────────────────────────────────────────────────────────┤
│  Claude Project  → holds sample_statement.csv + budget;    │
│                    answers spending questions from the data │
├────────────────────────────────────────────────────────────┤
│  Cowork agent    → reads each transaction, assigns it to    │
│                    one of 7 categories, totals each bucket  │
├────────────────────────────────────────────────────────────┤
│  Skill           → compares a planned budget to actual      │
│                    spend, outputs a per-category variance   │
├────────────────────────────────────────────────────────────┤
│  Artifact        → HTML bar chart of spend by category for  │
│                    the month, with a budget-vs-actual table │
└────────────────────────────────────────────────────────────┘
```

Flow: **upload statement → ask questions → categorise → compare to budget → visualise.**

## Components to Build

Each component has a ready-to-paste file. Check it off when you have run it.

- [x] **Claude Project: grounded on bank exports** — see `components/claude-project/system-prompt.md`
  - Upload `sample_statement.csv` to a Claude Project
  - Paste the provided system prompt into Custom instructions
  - Test: Claude answers the three provided questions from the data
- [x] **Cowork agent: monthly categorisation** — see `components/cowork-agent/agent-instructions.md`
  - Paste the instructions, then paste the rows from `sample_statement.csv`
  - Claude returns the categorised table + per-category totals
- [x] **Skill: budget vs actual analyser** — see `components/skill/skill-instructions.md`
  - Paste the instructions with the sample budget table
  - Claude returns a variance report (over/under by category)
- [x] **Artifact: spending breakdown chart** — see `components/artifact/chart-prompt.md`
  - Paste the prompt; Claude builds an HTML chart Artifact
  - Iterate until the chart is clear

## Deployment Checklist

- [x] Claude Project created with `sample_statement.csv` uploaded
- [x] Cowork agent categorises transactions into 7 buckets
- [x] Budget vs actual Skill produces a clear variance report
- [x] Spending chart Artifact renders and is readable
- [x] End-to-end: upload statement → categorise → compare budget → visualise

## Where this "lives"

There is no website to deploy. Your finished copilot is the **Claude Project** in your own
Claude.ai account — open it any time, upload a fresh statement, and re-run the four steps.
To share it, invite a teammate to the Project, or share the chart Artifact via its share link.

## Reflection

Answer these after you finish:

1. **What problem does your solution actually solve?** It turns a raw bank statement into a plain-English answer to "where did my money go?" — categorised, compared to budget, and charted, in minutes.
2. **Which Claude.ai feature was most useful and why?** For most people it is the Project, because the statement stays in context so every follow-up question is grounded in the same data.
3. **What would you add next?** Multi-month trends (upload several statements and chart spend over time), and an automatic alert when a category goes over budget.
