# Concepts Used — Sample 05: Customer Support Co-Pilot

## Course Modules Covered

- [x] **Module 1 — Claude API Basics:** SDK calls for triage, reply drafting, and trend summary
- [x] **Module 2 — Prompt Engineering:** Classification with fixed taxonomy; system persona for support agent
- [x] **Module 3 — Grounding / RAG:** Replies grounded in KB articles; source citation enforced in prompt
- [x] **Module 4 — AI Classification:** Ticket triage assigns category from 9 options + 4 priority levels
- [x] **Module 5 — Knowledge Base Pattern:** Upload articles → retrieved as context for every reply
- [x] **Module 6 — Full-Stack Integration:** Express + vanilla HTML SPA
- [x] **Module 7 — Persistent Storage:** SQLite with 3 tables (kb, tickets, replies)
- [x] **Module 8 — Dashboard Design:** Category bar chart + priority/status stats
- [x] **Module 9 — Workflow Design:** KB upload → Ticket submit (auto-triage) → Draft reply → Update status
- [x] **Module 10 — Deployment:** Dockerfile + .env.example

## AI Techniques

- **Grounded generation:** Reply must cite knowledge base articles; "never make up info" instruction
- **Constrained classification:** Category and priority from fixed lists; validation on parse
- **Persona system prompt:** Claude acts as empathetic support agent
- **Context assembly:** All KB articles concatenated as context per reply call
- **Fallback handling:** If KB is empty, Claude asks for more details instead of hallucinating
- **Trend analysis:** Claude synthesises ticket stats into actionable manager summary
