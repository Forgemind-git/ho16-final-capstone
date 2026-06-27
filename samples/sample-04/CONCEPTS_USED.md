# Concepts Used — Sample 04: Personal Finance Copilot

## Course Modules Covered

- [x] **Module 1 — Claude API Basics:** SDK calls for batch categorisation and Q&A
- [x] **Module 2 — Prompt Engineering:** Batch processing prompt; constrained category list; grounded Q&A
- [x] **Module 3 — Data Ingestion:** CSV parsing with flexible column detection
- [x] **Module 4 — AI Classification:** Claude assigns categories from a defined taxonomy
- [x] **Module 5 — Grounded Q&A:** Spending Q&A grounded in actual transaction data
- [x] **Module 6 — Full-Stack Integration:** Express + multer + vanilla HTML
- [x] **Module 7 — Dashboard Design:** Category bar chart + income/expense summary stats
- [x] **Module 8 — Batch Processing:** Transactions processed in batches of 50 to stay within token limits
- [x] **Module 9 — Error Handling:** CSV parse errors, batch fallback, JSON extraction from model output
- [x] **Module 10 — Deployment:** Dockerfile + .env.example

## AI Techniques

- **Constrained output:** Category list provided in prompt; model must pick from fixed options
- **Batch API calls:** Multiple items per single API call for efficiency
- **Indexed batch output:** Model returns [{index, category}] for easy mapping back to records
- **Grounding with aggregated data:** Q&A uses category totals + recent transactions as context
- **Insight generation:** Claude produces a human-friendly spending insight from numeric data
