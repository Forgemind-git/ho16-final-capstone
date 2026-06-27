# Sample 04 — Personal Finance Copilot

> **Problem Statement:** People upload bank statements and have no idea where their money is going. Manually categorising hundreds of transactions takes hours, and the patterns are hard to see. This project ingests a CSV bank statement, lets Claude categorise every transaction automatically, then enables natural language questions about your spending — all on a dashboard with category breakdowns.

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

## Setup Instructions

```bash
cd samples/sample-04/backend
npm install
cp ../.env.example .env
# Edit .env — add your ANTHROPIC_API_KEY
node server.js
# Open http://localhost:3004
```

## Live URL

http://localhost:3004 (replace with your deployed URL after deployment)

## CSV Format

Your CSV should have these columns (order matters):
```
date,description,amount
2024-01-15,AMAZON PRIME,-14.99
2024-01-16,SALARY DEPOSIT,3000.00
2024-01-17,STARBUCKS,-5.50
```

A sample CSV is included at `sample_statement.csv`.

## What You Can Do

1. Upload a bank statement CSV → Claude categorises every transaction
2. View dashboard — spending by category with visual breakdown
3. Ask questions — "How much did I spend on food last month?" "What's my biggest expense category?"
