# Architecture Plan — Sample 04: Personal Finance Copilot

> Fill this in as you design your solution. Use it to explain your choices to your trainer.

## Problem

You never know where your money goes. Build and deploy a personal-finance copilot.

## Component 1: Claude Project — grounded on bank exports

**What files will you upload?**
- TODO: Bank statement (CSV, PDF, or pasted text)
- TODO: Any budget spreadsheet you already have

**System prompt (draft it here):**
```
TODO: Write your Project system prompt here.
Claude should act as a personal finance analyst who has read your bank statement.
It should answer questions grounded in the uploaded data.
```

**How will you test it?**
- TODO: Ask "How much did I spend on food last month?"
- TODO: Ask "What is my single largest expense category?"
- TODO: Ask "Which subscriptions am I paying for?"

---

## Component 2: Cowork Agent — monthly categorisation

**Agent goal:**
- TODO: Read the transactions and categorise them into named buckets

**Categories you will use:**
- TODO: List your spending categories (e.g. Food, Transport, Housing, Entertainment)

**Agent instructions (draft):**
```
TODO: Write the Cowork agent instructions here.
```

---

## Component 3: Skill — budget vs actual analyser

**Skill goal:**
- TODO: Compare planned budget to actual spending, output variance

**Inputs:**
- TODO: A budget table and the categorised transactions

**Output:**
- TODO: Variance by category, total over/under, commentary

**Skill instructions (draft):**
```
TODO: Write the Skill instructions here.
```

---

## Component 4: Artifact — spending breakdown chart

**What should the chart show?**
- TODO: Spending by category? Month-over-month trend? Top merchants?

**Prompt to generate the Artifact:**
```
TODO: Write the prompt you will give Claude to generate this chart Artifact.
```

**Screenshot / description of final Artifact:**
- TODO: After building it, describe or screenshot the result.
