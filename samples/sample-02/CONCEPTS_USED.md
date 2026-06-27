# Concepts Used — Sample 02: Sales Intelligence Platform

## Course Modules Covered

- [x] **Module 1 — Claude API Basics:** Direct Anthropic SDK calls for lead enrichment and email drafting
- [x] **Module 2 — Prompt Engineering:** Structured JSON output; persona-based system prompts for copywriting
- [x] **Module 3 — Research Automation:** Claude infers company profile from name alone
- [x] **Module 4 — Content Generation:** Claude writes personalised outreach emails from enriched data
- [x] **Module 5 — Full-Stack Integration:** Express backend + vanilla HTML frontend
- [x] **Module 6 — Persistent Storage:** SQLite for leads, emails, CRM activity log
- [x] **Module 7 — Dashboard Design:** Kanban pipeline view by deal stage
- [x] **Module 8 — CRM Pattern:** Every action logged with timestamp and description
- [x] **Module 9 — Error Handling:** try/catch throughout; JSON parse with fallback
- [x] **Module 10 — Deployment:** Dockerfile + .env.example

## AI Techniques

- **Inference from minimal input:** Claude enriches a company from just its name
- **Structured JSON output:** Consistent schema for enrichment data and email drafts
- **Persona system prompt:** Claude acts as a B2B sales copywriter for email generation
- **Chained AI calls:** Enrich → Email uses output of first call as input context
- **Lead scoring:** Claude rates lead quality 1-10 with reasoning

## Architecture Patterns

- RESTful API with clear resource separation (/leads, /pipeline)
- SQLite with foreign keys (leads → emails, leads → crm_log)
- Kanban UI reflects database stage column directly
