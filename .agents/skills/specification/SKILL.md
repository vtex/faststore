---
name: specification
description: Generate a Spec Driven Development (SDD) document containing Business Context, Arch Decisions, and Technical Contract. Use when the user mentions "spec", "init spec", "create specification", references a file in the specs/ folder, or wants to create a feature specification.
license: MIT
metadata:
  author: VTEX
  version: "1.2.0"
---

# Specification — Spec Driven Development

Generate a complete SDD for a feature and write it as a structured markdown file to `specs/<feature-name>.md`. Uses a **hybrid approach**: for simple, well-described features the agent generates the full spec in a single pass; for complex or ambiguous features it gathers requirements interactively before writing.

**End-to-end flow:** this skill is the **start** of the pipeline; **implementing** is the **end**. After the spec is `Approved`, the **implementing** skill takes over. There is **no required intermediate step** (no separate planning doc or skill) — capable agents plan and break work internally from the approved spec.

## Sections

A specification always contains all three sections:

| # | Section | Purpose | Depends on |
|---|---------|---------|------------|
| 1 | **Business Context** | Problem, goals, requirements, acceptance criteria, key scenarios | — |
| 2 | **Arch Decisions** | Technical approach, plan & key architecture decisions | Business Context |
| 3 | **Technical Contract** | Interfaces, models, boundaries | Business Context + Arch Decisions |

## Workflow

### Phase 1: Identify feature

Determine what feature the specification is for (to derive the filename). If the user's message already names the feature, move on. Otherwise, ask.

### Phase 2: Repository context

If the user did **not** mention which repository (or repositories) the feature relates to, **ask before proceeding**. Use the AskQuestion tool so the user can type or select the repo(s).

Once you know the repositories, use the **GitHub** tool to fetch context and understand what already exists:

- Repository metadata (description, language, topics)
- Languages and tech stack breakdown
- README contents (project overview)
- Dependency files (`package.json`, `requirements.txt`, `go.mod`, etc.)
- Existing specs in the `specs/` directory (to avoid duplication)

Use the gathered context to build a **repository profile** containing:
- Primary language and tech stack
- Project purpose and domain
- Existing patterns, frameworks, and conventions
- Known dependencies and integration points
- Existing specifications (to avoid duplication)

This profile is used in Phase 2.5 to decide whether the agent can generate the spec directly or needs to ask more questions.

### Phase 2.5: Assess completeness

Evaluate whether the user's initial message **plus** the repository profile already provide enough information to generate all three sections. Check each section against its core questions:

| Section | Can generate if you know… |
|---|---|
| **Business Context** | The problem, who it affects, expected outcome, acceptance criteria per story, and key scenarios |
| **Arch Decisions** | The proposed technical approach, its trade-offs, and key architecture decisions |
| **Technical Contract** | The interfaces, models, or boundaries involved |

**Decision rules:**

- **All sections covered** → skip Phase 3 entirely, go to Phase 4 (single-pass)
- **Some gaps** → ask only about the gaps (targeted discovery)
- **Mostly unknown** → run full Phase 3 (interactive)

When in doubt, prefer asking over assuming — a wrong spec is worse than a slow one.

### Phase 3: Discovery (may be skipped)

> **Skip this phase** if Phase 2.5 determined all sections can be generated (single-pass).

Gather information through conversation. Use the repository profile from Phase 2 and the gap analysis from Phase 2.5 to guide which questions to ask.

**Rules:**
- **Only ask about gaps identified in Phase 2.5** — don't re-cover what's already known
- **Skip questions that the repo context already answers** (e.g., don't ask about tech stack if `package.json` reveals it)
- **Pre-fill what you can infer** and confirm with the user instead of asking from scratch (e.g., "Based on the repo, this is a Node.js service using Express — is that correct?")
- **Only ask about what's genuinely unknown** — focus on intent, business rules, and decisions that code alone can't reveal

**Business Context questions — Problem & Requirements**
- What problem are we solving?
- Who is affected and how?
- What happens if we don't solve it?
- What are the expected outcomes?
- What are the functional and non-functional requirements?
- Are there constraints or dependencies?
- For each user story: what are the acceptance criteria? (use given/when/then format)
- What are the key scenarios — happy path, error cases, and edge cases? What pre-conditions, steps, and expected results define each?

**Arch Decisions questions — Technical Approach & Decisions**
- What is the proposed solution?
- What alternatives were considered and why were they rejected?
- What are the risks and how do we mitigate them?
- What key architectural or design decisions need to be made?
- For each decision: what is the context, the options, and the chosen approach?
- What is the implementation plan?

**Technical Contract questions — Interfaces & Boundaries**
- What interfaces, data models, or system boundaries does this feature define?
- What are the inputs and outputs?
- What are the integration points with other systems or modules?

### Phase 4: Writing

Create the file at `specs/<feature-name>.md` using the template in [references/template.md](references/template.md).

Rules:
- Use kebab-case for the filename (e.g., `specs/user-authentication.md`)
- Create the `specs/` directory at the project root if it doesn't exist
- Fill every section — no placeholders or TODOs
- Every user story must have acceptance criteria in given/when/then format
- Key Scenarios table must include at least one happy path, one error case, and one edge case
- Keep language direct and concise
- Use diagrams (mermaid) when they clarify flow or architecture

### Phase 5: Review & Deliver

After writing, present a summary of what was generated and ask if any section needs refinement.

Once the user is satisfied, open a Pull Request with **only** the spec file:

1. Create branch `spec/<feature-name>` from the base branch
2. Stage only `specs/<feature-name>.md` — no other files
3. Verify with `git status` that nothing else is staged before committing
4. Commit with message `spec: <feature-name>`
5. Push and create the PR:
   - Title: `spec: <feature-name>`
   - Body: summary of the spec contents

## Lifecycle

| Status | Meaning | Trigger |
|---|---|---|
| `Draft` | Written, awaiting review | Spec generated |
| `Approved` | Reviewed and accepted for implementation | User approves |
| `Done` | Fully implemented | Implementation complete |

Update the status in the document header as the specification progresses.

Once a spec is `Approved`, it is implemented using the **implementing** skill only — that skill loads the spec, reconnoiters the repo, runs a test-first implementation loop, verifies, and delivers (PR + status `Done`). No extra handoff artifact is required between specification and implementation.

## Important

- Never generate a section without having **sufficient information** for it — whether provided in the user's initial message, inferred from the repository context, or gathered through discovery questions
- Ask clarifying questions when answers are vague
- Adapt the number of Key Decisions to what the feature actually requires — don't force unnecessary decisions
- The Technical Contract section should be technology-agnostic unless the user specifies a stack
