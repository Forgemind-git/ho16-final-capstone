# Sample 05 — Customer Support Co-Pilot

> **Problem Statement:** Your support is slow and reactive. Build and deploy a customer-support co-pilot.

## Your Mission

Design and deploy a solution that solves this problem using Claude.ai subscription features.
You do NOT need to write code — use Claude Projects, Cowork agents, Skills, and Artifacts.

## Components to Build

Work through each component below. Check it off when done.

- [ ] **Claude Project: grounded on product docs + policies**
  - Upload your product documentation and support policies to a Claude Project
  - Write a system prompt that makes Claude an expert support agent
  - Test: does Claude cite the correct doc when answering a support question?

- [ ] **Prompt Library: triage + reply prompts**
  - Create a triage prompt that classifies tickets by category and urgency
  - Create a reply prompt that drafts a grounded response citing your docs
  - Save both as named prompts in your Claude Project

- [ ] **Skill: weekly support summary**
  - Design a Skill that reads a list of tickets and produces a weekly summary for managers
  - What should the summary include? (volume, top categories, unresolved issues)
  - Write and test the Skill

- [ ] **Artifact: ticket-status heatmap**
  - Ask Claude to generate a ticket-status heatmap Artifact
  - It should show ticket volume by category and day/week
  - Iterate until it gives your team useful visibility

## Architecture Plan

Fill this in as you design your solution:

```
┌──────────────────────────────────────────┐
│       Customer Support Co-Pilot          │
├──────────────────────────────────────────┤
│  [TODO: describe your Claude Project]    │
├──────────────────────────────────────────┤
│  [TODO: describe your Prompt Library]    │
├──────────────────────────────────────────┤
│  [TODO: describe your Skill]             │
├──────────────────────────────────────────┤
│  [TODO: describe your Artifact]          │
└──────────────────────────────────────────┘
```

## Deployment Checklist

- [ ] Claude Project created with product docs and policies uploaded
- [ ] Triage prompt classifies tickets correctly
- [ ] Reply prompt drafts grounded responses citing docs
- [ ] Weekly summary Skill produces a useful manager report
- [ ] Heatmap Artifact renders ticket trends clearly

## Your Deployed URL

> TODO: Add the link to your deployed solution here once it is live.

## Reflection

Answer these after you finish:

1. What problem does your solution actually solve?
2. Which Claude.ai feature was most useful and why?
3. What would you add next?
