# Concepts Used — Sample 03: Content Production Engine

> **Note:** The primary way to build this project is inside your **Claude.ai subscription** (Cowork agent, saved Prompt Library prompts, a Skill, and a content-calendar Artifact) — **no API key needed**. The API integration and deployment concepts listed below are an **optional, advanced** path for learners who also want to run it as a deployed web app.

## Course Modules Covered

- [x] **Module 1 — Claude API Basics:** SDK calls for brief generation, drafting, and repurposing
- [x] **Module 2 — Prompt Engineering:** Platform-specific instructions; structured JSON output
- [x] **Module 3 — Research Automation:** Claude generates angles, insights, and outline from a topic
- [x] **Module 4 — Content Generation:** Full long-form post drafted from structured brief
- [x] **Module 5 — Content Repurposing:** One post → LinkedIn teaser + email snippet + Twitter thread
- [x] **Module 6 — Full-Stack Integration:** Express + vanilla HTML SPA
- [x] **Module 7 — Persistent Storage:** SQLite tracks all posts, variants, and status
- [x] **Module 8 — Dashboard Design:** Stats grid + post list by status
- [x] **Module 9 — Workflow Design:** 3-step pipeline: Research → Draft → Repurpose
- [x] **Module 10 — Deployment:** Dockerfile + .env.example

## AI Techniques

- **Chained prompts:** Brief → Draft → Repurpose forms a 3-stage AI pipeline
- **Format-specific instructions:** Different word count and style rules per content type
- **Structured JSON for brief:** Consistent schema enables UI rendering without parsing
- **Context carry-forward:** Draft uses brief data; repurpose uses draft content
- **Platform-native reformatting:** Twitter thread format, email tone, LinkedIn engagement hooks
