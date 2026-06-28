# Architecture Plan — Sample 01: AI Ops Command Center

> Fill this in as you design your solution. Use it to explain your choices to your trainer.

## Problem

Your operations are run from memory. Build and deploy an AI ops command centre.

## Component 1: Claude Project — grounded on runbooks + SOPs

**What documents will you upload?**
- TODO: List the runbooks, SOPs, or ops docs you will add to the Project

**System prompt (draft it here before setting it in Claude):**
```
TODO: Write your Project system prompt here.
It should tell Claude what role it plays and what documents it has access to.
```

**How will you test it?**
- TODO: Write 3 test questions a real ops team member would ask

---

## Component 2: MCP Server — real-time status tools

**What real-time data does your ops team need?**
- TODO: List the data sources (e.g. server uptime, ticket queue, deployment status)

**Tool signatures you plan to build:**
```
TODO: name each tool, its inputs, and what it returns
Example:
  get_server_status(server_id) → { status, uptime, last_check }
  list_open_tickets() → [{ id, title, priority, age }]
```

---

## Component 3: Cowork Agent — daily ops briefing

**Agent goal:**
- TODO: In one sentence, what does this agent produce each day?

**Inputs the agent uses:**
- TODO: What does it read? (MCP tools, uploaded docs, a fixed template?)

**Output format:**
- TODO: What does the briefing look like? Bullet points? Sections? A table?

**Agent instructions (draft):**
```
TODO: Write the Cowork agent instructions here before setting them up.
```

---

## Component 4: Artifact — live status dashboard

**What metrics should the dashboard show?**
- TODO: List 4–6 metrics your ops team needs at a glance

**Prompt you will use to generate the Artifact:**
```
TODO: Write the prompt you will give Claude to generate this dashboard Artifact.
```

**Screenshot / description of final Artifact:**
- TODO: After you build it, describe or screenshot what it looks like.
