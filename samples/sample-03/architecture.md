# Architecture Plan — Sample 03: Content Production Engine

> This is the worked design for the **FieldPro** content engine. Use it to explain your choices to your trainer, then copy and adapt it for your own brand and topic.

## Problem

You want to produce content at scale but research, drafting and tracking are disconnected. Build and deploy a content engine.

**Our scenario:** the FieldPro content team (a SaaS for small field-service / trades businesses) needs to publish consistently. Today the research lives in one person's browser tabs, drafts live in a doc, repurposing is manual copy-paste, and tracking lives in someone's memory. We connect all four inside one Claude.ai Project. Worked topic throughout: **"How small trades businesses can cut no-show appointments"**.

## Component 1: Cowork Agent — research + brief

**Agent goal:**
- Given a single content topic, produce a structured, ready-to-draft research brief so a writer never starts from a blank page.

**Inputs:**
- A topic line (e.g. "How small trades businesses can cut no-show appointments").
- Optional: a target audience override. If none is given, the agent assumes FieldPro's default audience (owners/office managers at 1–20-person trades businesses).

**Output format:**
- A one-page markdown brief with fixed sections in this order: **Topic**, **Target audience & main pain**, **3 angles/hooks**, **5 key insights or data points**, **Suggested outline (H2 sections)**, **3 keywords**. Roughly 250–400 words so it's skimmable.

**Agent instructions (draft):**
```
You are a B2B content research specialist for FieldPro, a SaaS that helps
small field-service and trades businesses schedule jobs, dispatch crews,
and get paid faster.

The user gives you one TOPIC. Produce a structured research brief with these
sections, in this exact order and with these headings:

1. Topic — restate it in one clear line.
2. Target audience & main pain — who reads this and the single biggest pain
   it speaks to. Default audience: owners and office managers at trades
   businesses with 1–20 staff (plumbing, electrical, HVAC, landscaping).
3. Three angles / hooks — three distinct ways to frame the piece, each a
   one-sentence hook a reader would click.
4. Five key insights or data points — concrete, practical claims a trades
   owner would find true and useful. Where you cite a number, say it is an
   illustrative estimate, not a verified statistic.
5. Suggested outline — 4–6 H2 section headings in logical order.
6. Three keywords — short search phrases this audience would actually type.

Rules: plain language, no corporate jargon, no fluff. Keep the whole brief
under ~400 words. Do not invent specific named studies or fake citations.
```

See `components/cowork-agent/agent-instructions.md` for the full version plus a worked example output.

---

## Component 2: Prompt Library — draft + repurpose

**Prompts we created (all saved in the "FieldPro Content Engine" Project):**
1. **Long-Form Draft** — input: the research brief. Output: an ~900–1,100-word blog article in FieldPro voice with intro, 4 H2 sections, and a CTA.
2. **LinkedIn Repurpose** — input: the approved draft. Output: a ≤1,300-character LinkedIn post with a scroll-stopping first line, short paragraphs, and a soft CTA.
3. **Email Snippet** — input: the approved draft. Output: a subject line, preview text, and a ~150-word email body that links out to the full article.
4. **Short-Form / Thread** — input: the approved draft. Output: a 5-tweet X thread, each tweet ≤280 characters, hook → 3 points → CTA.

**How we save and reuse them:**
- All four live in `components/prompt-library/prompts.md`. Inside Claude.ai we keep them in the **FieldPro Content Engine** Project: each prompt is run in its own chat, and we keep this file as the master copy to paste from. The Project's brand note means we don't repeat "FieldPro voice" instructions in every prompt — Claude already knows.

---

## Component 3: Skill — one-click multi-format publish

**Skill goal:**
- Turn one approved long-form draft into three channel-ready variants in a single click, so a writer never reformats by hand.

**Inputs:**
- The approved long-form draft only (pasted where the Skill says `[PASTE CONTENT HERE]`). The brief is not needed at this stage.

**Outputs (3 formats):**
- **Format 1 — LinkedIn post:** max 1,300 characters; hook on line 1, 3–5 short paragraphs, CTA on the last line, max 3 hashtags.
- **Format 2 — Email newsletter snippet:** max 200 words; subject line + preview text + one body paragraph that links to the full post.
- **Format 3 — X (Twitter) thread:** exactly 5 tweets, each ≤280 characters; tweet 1 = hook, tweets 2–4 = key points, tweet 5 = CTA.

**Skill instructions (draft):**
```
You are FieldPro's "Publish Pack" generator. Given the approved long-form
content below, produce THREE channel-ready variants, each obeying its limit.
Keep FieldPro's plain, practical voice. Output each variant separated by ---
and clearly labeled. Then add a one-line "Checks" note confirming each limit
was met.
(full version in components/skill/skill-instructions.md)
```

See `components/skill/skill-instructions.md` for the complete instructions and limits.

---

## Component 4: Artifact — content calendar tracker

**What the calendar shows:**
- One row per content piece with columns: **#**, **Topic**, **Format**, **Channel**, **Status** (Draft / Review / Scheduled / Published), **Publish Date**, **Owner**. A filter bar lets us filter by Status and by Channel, and a summary strip at the top shows counts per status.

**Prompt to generate the Artifact:**
```
Create a single self-contained HTML content calendar tracker (one file, inline
CSS/JS, no external libraries). Columns: #, Topic, Format, Channel, Status,
Publish Date, Owner. Status is one of Draft / Review / Scheduled / Published,
shown as a colored pill. Add a filter bar (Status dropdown + Channel dropdown)
and a summary strip showing counts per status. Pre-fill 10 sample rows of
FieldPro content. (full prompt + sample data in
components/artifact/calendar-prompt.md)
```

**Description of final Artifact:**
- A clean, single-file HTML table that renders as an Artifact on the right side of the chat. The status pills are color-coded (Draft grey, Review amber, Scheduled blue, Published green). Selecting a Status or Channel in the filter bar hides non-matching rows and the summary counts stay visible at the top. We update it by chatting ("mark piece #4 Published, set its date to 2026-07-02"). It is a tracker snapshot, not a live database — re-asking Claude regenerates it with our edits.
