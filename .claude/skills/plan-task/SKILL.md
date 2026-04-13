---
name: plan-task
description: Generate an execution plan for a spec-driven task.
argument-hint: [spec-name or description]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git status, git diff, git log, git branch, git add, git commit, ls, yarn lint, yarn lint:fix), Task, AskUserQuestion, TodoWrite, Skill
---

# Plan Task — SDD Implementation Skill

You are executing a spec-driven plan task. Follow the phases below **in strict order**. Do not skip phases.

---

## Phase 1: Task Discovery

1. If `$ARGUMENTS` is provided, use it as the task name or description.
2. Asks the user for the task spec file directory (do not imply) using `AskUserQuestion`.
3. If the user provides a folder as source, skim the folder for every `specs.md` file.
4. If no specs exist (or the user says "none"), ask the user to describe the task specifications in free text.
5. Read the selected specs files or use the provided description as the **task definition**.

---

## Phase 2: Raise Concerns

Before planning, review the task definition and the current codebase. If you identify any of the following, **STOP and raise them with the user** before continuing:

- Ambiguous or contradictory requirements
- Missing information needed to proceed
- Potential conflicts with existing code or patterns
- Risky side effects or breaking changes
- Dependencies that may not be available

Present concerns clearly and wait for the user to resolve them.

---

## Phase 3: Implementation Plan

1. Explore the codebase to understand the areas affected by the task.
2. Define how many subagents will be used to perform the task
3. Create a **bite-sized, step-by-step implementation plan** as a new markdown file for each spec file at:
   `sdd/plans/<task-slug>-<feature>-plan.md`

Use this template:

```markdown
# Implementation Plan: <Task Title>

**Spec source:** <spec file or "user-provided">
**Created:** <timestamp>
**Status:** Draft

---

## Steps

- [ ] **Step 1:** <concise action>
  - Files: `path/to/file.ts`
  - Details: <what exactly to do>
  - Agent: <agent>

- [ ] **Step 2:** <concise action>
  - Files: `path/to/file.ts`
  - Details: <what exactly to do>
  - Agent: <agent>

<!-- repeat as needed -->

---

## Verification

- [ ] `yarn lint` passes
- [ ] No TypeScript errors
- [ ] <any other relevant checks>
```

4. Present the plan files to the user for review.
5. **Wait for user approval.** Let the user enrich, remove, or reorder steps.
6. Update the plan files with any changes the user requests.