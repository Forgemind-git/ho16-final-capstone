# Concepts Used — Sample 01: AI Ops Command Center

> **Primary build:** This project is built on the **Claude.ai subscription** path using **Projects** (to ground Claude on your ops documents) and **Artifacts** (to generate the dashboard) — no API key required. The API integration described below is the **optional, advanced** path for running it as a deployed web app.

## Course Modules Covered

- [x] **Module 1 — Claude API Basics:** Direct Anthropic SDK calls in claude.js
- [x] **Module 2 — Prompt Engineering:** Structured prompts with JSON output format instructions
- [x] **Module 3 — Grounding / RAG:** Q&A answers are grounded in uploaded document content
- [x] **Module 4 — Research Automation:** Document summarisation extracts key points + action items
- [x] **Module 5 — Full-Stack Integration:** Express backend + vanilla HTML frontend
- [x] **Module 6 — Persistent Storage:** SQLite via better-sqlite3 for docs, chat logs, metrics
- [x] **Module 7 — Dashboard Design:** Metrics grid + recent activity feed
- [x] **Module 8 — Automation:** /api/refresh endpoint designed for cron job scheduling
- [x] **Module 9 — Error Handling:** try/catch with JSON parse fallback in claude.js
- [x] **Module 10 — Deployment:** Dockerfile + .env.example for production deployment

## AI Techniques

- **Structured output:** Claude returns JSON with summary, key_points, action_items
- **Context injection:** All document contents passed as context for grounded Q&A
- **System prompt:** Ops assistant instructed to cite sources and stay within documents
- **Model choice:** claude-3-5-haiku-20241022 for speed and cost efficiency

## Architecture Patterns

- Single Express server serves both API and static frontend
- SQLite as zero-config embedded database
- Modular separation: db.js (data), claude.js (AI), server.js (routing)
