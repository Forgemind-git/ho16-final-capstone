# Architecture Plan — Sample 05: Customer Support Co-Pilot

> Fill this in as you design your solution. Use it to explain your choices to your trainer.

## Problem

Your support is slow and reactive. Build and deploy a customer-support co-pilot.

## Component 1: Claude Project — grounded on product docs + policies

**What documents will you upload?**
- TODO: Product documentation (FAQs, feature guides)
- TODO: Support policies (refund policy, SLA, escalation paths)
- TODO: Any knowledge base articles you already have

**System prompt (draft it here):**
```
TODO: Write your Project system prompt here.
Claude should act as a senior support agent who knows the product and policies deeply.
```

**How will you test it?**
- TODO: Submit a common customer question and check if Claude cites the right doc
- TODO: Ask Claude about your refund policy
- TODO: Ask Claude to triage a complex ticket

---

## Component 2: Prompt Library — triage + reply prompts

**Prompts you will create:**
1. TODO: Triage prompt — inputs and expected output (category + priority)
2. TODO: Reply draft prompt — inputs and expected output (grounded reply)

**How you will save them:**
- TODO: Describe where you will store these (Claude Project, prompt manager, etc.)

---

## Component 3: Skill — weekly support summary

**Skill goal:**
- TODO: What does the weekly summary include?

**Inputs:**
- TODO: A list of tickets for the week (or a summary from your helpdesk)

**Output:**
- TODO: Volume, top categories, unresolved issues, SLA breaches?

**Skill instructions (draft):**
```
TODO: Write the Skill instructions here.
```

---

## Component 4: Artifact — ticket-status heatmap

**What should the heatmap show?**
- TODO: Ticket volume by category? By day? By priority?

**Prompt to generate the Artifact:**
```
TODO: Write the prompt you will give Claude to generate this Artifact.
```

**Screenshot / description of final Artifact:**
- TODO: After building it, describe or screenshot the result.
