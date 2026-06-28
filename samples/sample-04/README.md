# Sample 04 — Personal Finance Copilot

> **What you'll build:** A personal finance helper that reads a bank-statement CSV, sorts every transaction into spending categories, shows you a dashboard of where your money goes, and lets you ask plain-language questions like "How much did I spend on food?"

You can build the whole thing **inside your Claude.ai subscription** — no coding and no API key. The code in this folder is an optional, more advanced way to run the same idea as a real web app (and it even runs in a built-in **demo mode** with no API key at all).

## Use it with your Claude.ai subscription

This is the main, recommended way to build your Personal Finance Copilot. You only need a normal Claude.ai account (Free, Pro, or Team). **No API key needed.**

Follow these steps in order:

1. **Get a bank-statement CSV.** Export one month of transactions from your bank as a CSV file, or use the included `sample_statement.csv` from this folder. It just needs three columns: `date`, `description`, `amount` (negative numbers are money out, positive are money in).

2. **Create a Claude Project.** In Claude.ai, click **Projects** in the sidebar, then **Create Project**. Name it "Personal Finance Copilot". A Project lets Claude remember your instructions and your data across many chats.

3. **Add your statement as project knowledge.** Open your new Project and upload your CSV into the Project's knowledge area. Now every chat in this Project is "grounded" on your real spending — Claude answers from your numbers, not guesses.

4. **Give the Project simple instructions.** In the Project's custom instructions box, paste something like: *"You are my personal finance copilot. Use the uploaded bank statement to answer my questions. Always show exact dollar amounts. Categories to use: Food & Dining, Groceries, Transport, Entertainment, Shopping, Utilities & Bills, Healthcare, Education, Travel, Subscriptions, Housing & Rent, Insurance, ATM & Cash, Transfers, Other."*

5. **Ask grounded spending questions.** Start a chat in the Project and ask things like "How much did I spend on food last month?" or "What was my biggest expense category?" Claude reads your CSV and answers with real numbers.

6. **Build a categorisation Cowork agent.** Use Claude's Cowork (agent) mode to make a reusable helper: ask it to read the statement and label every transaction with one category, then return a clean table. This is your auto-categoriser — no spreadsheet formulas required.

7. **Create a budget-vs-actual Skill.** Save a Skill (a reusable instruction) such as *"Compare my actual spending in each category against a monthly budget I give you, and tell me where I overspent."* Now you can run a budget check any time just by invoking the Skill.

8. **Make a spending-chart Artifact.** Ask Claude to "make an Artifact that shows a bar chart of my spending by category." Claude builds an interactive chart Artifact right in the chat that you can view and tweak.

That's the full copilot — grounded Q&A, auto-categorisation, budget checks, and a visual dashboard — all inside Claude.ai with no setup.

## Architecture Overview

```
┌──────────────────────────────────────────────────────────┐
│                Personal Finance Copilot                   │
├──────────────────────────────────────────────────────────┤
│  Frontend (index.html)                                    │
│  ┌──────────────┐ ┌─────────────────┐ ┌──────────────┐  │
│  │  Dashboard   │ │  CSV Upload +   │ │  Chat with   │  │
│  │  (Spend by   │ │  Categorisation │ │  Your Data   │  │
│  │   Category)  │ │                 │ │              │  │
│  └──────────────┘ └─────────────────┘ └──────────────┘  │
├──────────────────────────────────────────────────────────┤
│  Backend (Express.js)                                     │
│  POST /api/statements/upload — parse CSV + Claude classify│
│  GET  /api/transactions      — list all transactions      │
│  POST /api/chat              — grounded Q&A on spending   │
│  GET  /api/insights          — category totals + trends   │
├──────────────────────────────────────────────────────────┤
│  AI Layer (claude.js)                                     │
│  categoriseTransactions()  — batch classify transactions  │
│  answerSpendingQuestion()  — grounded Q&A on tx data      │
│  generateInsight()         — monthly spending insight     │
├──────────────────────────────────────────────────────────┤
│  Data Layer (SQLite)                                      │
│  transactions  — id, date, description, amount, category  │
│  chat_logs     — id, question, answer, created_at         │
└──────────────────────────────────────────────────────────┘
```

## Course Concepts Demonstrated

- **CSV Ingestion:** Parse bank statement CSV and store raw transactions
- **AI Categorisation:** Claude classifies all transactions in one batch call
- **Grounded Q&A:** Chat with Claude about your spending using tx data as context
- **Insight Dashboard:** Spend by category with bar chart + top merchants
- **Full-Stack:** Single Express server + vanilla HTML single-page app

## CSV Format

Your CSV should have these columns (order matters):
```
date,description,amount
2024-01-15,AMAZON PRIME,-14.99
2024-01-16,SALARY DEPOSIT,3000.00
2024-01-17,STARBUCKS,-5.50
```

A sample CSV is included at `sample_statement.csv`.

## Optional — connect the live API & deploy (advanced)

Everything below is **optional** and meant for people who want to run this as a real web app. It is **not** required for the course — and you do **not** need it to try the app, because the code runs in a built-in **demo mode** with **no API key**. In demo mode the app still parses your CSV, categorises every transaction (by keyword), shows the dashboard, and answers chat questions with realistic sample text clearly marked as "demo mode".

To connect the **live** Anthropic API instead of demo mode, you need a **separate, paid Anthropic API key** from the Anthropic Console. This is **different from your Claude.ai subscription** — the subscription does not include API credits, and the API is billed separately by usage.

```bash
cd samples/sample-04/backend
npm install
cp ../.env.example .env
# Optional: open .env and add a paid ANTHROPIC_API_KEY to use the live API.
# Leave it blank to run in demo mode (no key, no cost).
node server.js
# Open http://localhost:3004
```

- **No key set →** the app runs in demo mode (free, no API calls).
- **Paid `ANTHROPIC_API_KEY` set →** the app calls the live Anthropic API for categorisation, insights, and chat answers.

### Deploying

Deployment (putting the app on a public URL) is also optional and advanced. The included `Dockerfile` lets you build a container if you choose to host it somewhere. Your live URL would replace `http://localhost:3004`. None of this is needed to complete the course.
