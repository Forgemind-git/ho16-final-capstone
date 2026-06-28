# Architecture Plan — Sample 02: Sales Intelligence Platform

> Fill this in as you design your solution. Use it to explain your choices to your trainer.

## Problem

Your sales team flies blind with no view of the pipeline. Build and deploy a sales intelligence platform.

## Component 1: Claude Project — grounded on ICP + product docs

**What documents will you upload?**
- TODO: Your Ideal Customer Profile (ICP)
- TODO: Product documentation or one-pager
- TODO: Any competitor battle cards or objection handlers

**System prompt (draft it here):**
```
TODO: Write your Project system prompt here.
Claude should act as a sales intelligence assistant who knows your ICP and product deeply.
```

**How will you test it?**
- TODO: Describe a lead and ask Claude if it fits your ICP
- TODO: Ask Claude to identify the most relevant pain points for that lead

---

## Component 2: MCP Server — CRM data tools

**What CRM data does your sales team need?**
- TODO: List the data (lead list, deal stages, contact history, etc.)

**Tool signatures:**
```
TODO: name each tool, its inputs, and what it returns
```

---

## Component 3: Cowork Agent — pipeline analysis

**Agent goal:**
- TODO: What does the agent analyse and what does it output?

**Inputs:**
- TODO: What data does it read?

**Output format:**
- TODO: Pipeline health report? Risk flags? Next best actions?

**Agent instructions (draft):**
```
TODO: Write the Cowork agent instructions here.
```

---

## Component 4: Artifact — deal-health dashboard

**What should the dashboard show?**
- TODO: List the metrics (deal stage, lead score, days in stage, next action, etc.)

**Prompt to generate the Artifact:**
```
TODO: Write the prompt you will give Claude.
```

**Screenshot / description of final Artifact:**
- TODO: After building it, describe or screenshot the result.
