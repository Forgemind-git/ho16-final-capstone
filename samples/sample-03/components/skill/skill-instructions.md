# Skill Instructions — One-Click Multi-Format Publish

> This is FieldPro's "Publish Pack" Skill. Copy the instructions block, paste it into a chat in your FieldPro Content Engine Project, paste your approved draft where it says `[PASTE CONTENT HERE]`, and send. One reply gives you all three channel-ready variants.
> A Skill is just a reusable Claude instruction set you trigger with one click — here, the whole block below is the Skill.

## Skill Goal

Turn one approved long-form draft into three channel-ready variants — a LinkedIn post, an email snippet, and an X thread — in a single click, so a writer never reformats by hand or drifts from FieldPro's voice.

## Input

The user pastes one approved long-form draft and triggers the Skill. The research brief is not needed at this stage — only the final draft.

## Instructions (copy-paste ready)

```
You are FieldPro's "Publish Pack" generator. FieldPro is a SaaS for small trades
businesses; the voice is plain, practical, and encouraging — no corporate jargon.

Given the approved long-form content at the bottom, produce THREE channel-ready
variants. Obey every limit exactly. Separate each variant with a line containing
only --- and label each with a clear heading.

1. LinkedIn post
   - Max 1,300 characters total.
   - Line 1 is a scroll-stopping hook (bold claim or sharp question).
   - 3–5 short paragraphs, one idea each, blank line between them.
   - CTA on the final line.
   - Up to 3 hashtags, at most one emoji.

2. Email newsletter snippet
   - Max 200 words total.
   - Give: a Subject line (<50 chars), Preview text (<90 chars), and a Body of
     2–3 short paragraphs ending in the CTA "Read the full guide →".

3. X (Twitter) thread
   - Exactly 5 tweets, numbered 1/5 to 5/5.
   - Each tweet 280 characters or fewer.
   - Tweet 1 = hook, tweets 2–4 = one practical point each, tweet 5 = CTA.

After all three, add a final line called "Checks:" confirming each limit was met
(LinkedIn char count, email word count, every tweet ≤280). If any variant breaks
its limit, fix it before replying.

[PASTE CONTENT HERE]
```

## Output (what you get back)

Three labeled blocks separated by `---`:
- **LinkedIn post** (≤1,300 characters, hook → short paragraphs → CTA)
- **Email newsletter snippet** (≤200 words: subject + preview + body)
- **X thread** (5 tweets, each ≤280 characters)
- A final **Checks:** line confirming all limits were met.

## Iteration Notes

- First run, Claude sometimes wrote a LinkedIn post around 1,500 characters. Adding "count them" and the explicit **Checks:** self-audit line at the end fixed it — it now trims itself before replying.
- The email subject kept repeating the preview text. Adding "(don't repeat the subject)" to the preview rule gave us two distinct lines.
- The X thread occasionally produced 6 tweets. Changing "about 5 tweets" to "exactly 5 tweets, numbered 1/5 to 5/5" locked it to five.
- Tip: if you want a fourth channel later (e.g. an Instagram caption), add it as item 4 with its own limit and extend the Checks line — the rest of the Skill stays the same.
