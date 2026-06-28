# Prompt Library — Customer Support Co-Pilot (Brightcart)

> Two reusable, copy-paste-ready prompts. Claude.ai has no separate prompt-manager
> product, so you save these **inside your Claude Project**: open the **Brightcart Support
> Co-Pilot** project, start a new chat titled **"PROMPTS — copy from here"**, paste both
> prompts below into the first message, then pin/star that chat (the "…" menu on the chat
> → **Star** or **Pin**). When a real ticket comes in, copy the prompt out of that pinned
> chat into a fresh chat in the project and replace `[PASTE TICKET HERE]` with the ticket.
> Because you run them inside the project, Claude already has the Brightcart docs loaded.

---

## Prompt 1: Triage Ticket

**Name:** Triage Ticket

**When to use:** The moment a new ticket arrives, before drafting any reply.

**Prompt:**
```
Triage the following Brightcart customer support ticket using our uploaded docs.

Return exactly this, nothing else:
- Category: [Billing / Technical / Account / Checkout / Feature Request / Other]
- Priority: [Low / Medium / High / Critical]
- Reasoning: one sentence explaining the category and priority.
- Source: the document that informed your call (e.g. brightcart-sla-escalation.md), or
  "none" if the ticket needs no doc to classify.
- Suggested owner: [First-line agent / Senior agent / Billing-Trust team / Engineering /
  Management]

Use brightcart-sla-escalation.md to set priority and owner. If payment, data loss,
security, or a store-down/checkout-broken issue is involved, raise the priority and route
to the correct team. Do not draft a reply yet.

Ticket:
[PASTE TICKET HERE]
```

**Example output (for the "store offline at checkout" ticket):**
```
- Category: Checkout
- Priority: Critical
- Reasoning: The storefront is down and customers cannot complete checkout, which is a
  revenue-blocking outage.
- Source: brightcart-sla-escalation.md (escalation routes)
- Suggested owner: Engineering
```

---

## Prompt 2: Draft Reply

**Name:** Draft Reply

**When to use:** Right after triage, to generate a grounded reply the agent reviews and
sends.

**Prompt:**
```
Draft a customer reply for the following Brightcart ticket, grounded in our uploaded docs.

Requirements:
- Open with one empathetic line acknowledging the customer's situation.
- Give a concrete next step or resolution drawn from the docs.
- Cite the exact document (and section) you used, e.g. "per brightcart-refund-policy.md".
- Keep it under 120 words, professional and warm, no corporate filler.
- If the request is outside our policy or not in the docs, say so politely and tell the
  customer it is being escalated to the right team (per brightcart-sla-escalation.md).
- End with: "Source used: <document name>" on its own line so the agent can verify.

Ticket:
[PASTE TICKET HERE]
```

**Example output (for the "full refund after 6 weeks" ticket):**
```
Hi Sam, thanks for flagging this, and sorry for the worry about the charge.

Our refund policy covers the most recent billing period within 30 days, so I can refund
last month's subscription charge straight away — it'll return to your original card in
5-10 business days. Charges from earlier in the year fall outside the 30-day window, so
I'm not able to refund those, but I've made sure your subscription is fully cancelled so
there are no further charges. Want me to process last month's refund now?

Source used: brightcart-refund-policy.md
```
