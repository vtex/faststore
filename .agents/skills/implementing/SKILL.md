---
name: implementing
description: Non-interactive sandbox implementation from an approved spec to a PR. Use when the user mentions "implement", "implement spec", "implement specs/<feature>.md", sandbox implementation, or autonomous implementation from a specification.
license: MIT
metadata:
  author: VTEX
  version: "1.2.0"
---

# Implementing — Spec to Code

Implement a feature **autonomously** from an approved `specs/<feature-name>.md`.

## Execution model

This skill assumes a **sandboxed, asynchronous** run: **no human interaction** during execution (no questions, confirmations, or waiting for replies).

| | |
|---|---|
| **Input** | `specs/<feature-name>.md` (must be `Approved` — see Phase 1) |
| **Success output** | Pull Request on `feat/<feature-name>`, spec status → `Done` |
| **Blocked output** | Agent **ends** without a completed feature PR; a **GitHub issue** documents why implementation could not finish |

**Pipeline (end-to-end):** the **specification** skill produces the spec; this skill consumes it. There is **no intermediate planning artifact or skill** — you plan, decompose work, and sequence tasks internally (same idea as composable workflows in [superpowers](https://github.com/obra/superpowers), but without an extra handoff step). The spec is the single handoff contract, analogous to how [autoresearch](https://github.com/karpathy/autoresearch) treats `program.md` as the human-authored context and keeps a tight edit surface for the agent.

**Operating loop:** pick a user story → implement with tests → verify against acceptance criteria → commit → repeat until every story is done. **Evidence over claims:** nothing is “done” until tests and checks prove it.

## Constraints

**What you CAN do:**
- Create and modify source code, tests, and configuration files required by the spec
- Install dependencies explicitly mentioned in the Technical Contract or required by the chosen approach
- Create branches, commit, and open PRs
- Open a **GitHub issue** (or equivalent) when implementation is **impossible** to complete after tie-breakers and reasonable effort — see *Non-interactive execution*

**What you CANNOT do:**
- Implement features, endpoints, or behaviors not described in the spec
- Change the spec file itself — if the spec is wrong, contradictory, or blocking, follow *Non-interactive execution* (assumptions in PR, or issue + terminate)
- Skip writing tests for a user story that has acceptance criteria
- Merge or push to the main branch without explicit user consent (from platform policy outside this run)

**The goal is simple: make every acceptance criterion pass.** The spec is the single source of truth. If the spec says it, implement it. If the spec doesn't say it, don't.

## Workflow

### Phase 1: Load and validate

1. Read the full `specs/<feature-name>.md`
2. Check that the status is `Approved`. If it is **not** `Approved` (e.g. `Draft`): **end the run** immediately. Do **not** open an implementation PR. Emit a **structured report** in sandbox logs/output (reason, current status, path to the spec file) so the orchestrator can mark the job failed.
3. Extract from the spec:
   - **User Stories + Acceptance Criteria** → the work units
   - **Key Scenarios** → the test cases
   - **Arch Decisions** → the technical approach and constraints
   - **Technical Contract** → interfaces, models, and boundaries to implement exactly
4. If the spec references repositories you don't have context on, use the GitHub tool to fetch their structure, README, and dependencies

**Internal planning:** derive order of work, file touch list, and test strategy from the spec and repo. No separate plan-approval step.

### Phase 2: Codebase reconnaissance

Before writing any code, understand the existing codebase:

- Project structure, conventions, and patterns already in use
- Existing tests: framework, naming conventions, where they live
- Dependency management: what's already installed, what's available
- CI/CD: how tests are run, linting rules, build steps

Adapt your implementation to match existing patterns. Don't introduce new conventions unless the spec explicitly calls for it.

### Phase 3: Implementation loop

Work through user stories one at a time. For each story:

```
LOOP per user story:

1. Write failing tests derived from the acceptance criteria and key scenarios
2. Run the tests — confirm they fail for the right reason
3. Implement the minimal code to make the tests pass
4. Run the tests — confirm they pass
5. Refactor if needed (tests must still pass after)
6. Commit with a descriptive message
7. Move to the next story
```

**Rules:**
- Follow the architecture described in Arch Decisions — don't contradict accepted decisions
- Implement interfaces and models exactly as defined in the Technical Contract
- One commit per user story (or per logical unit if a story is large)
- Commit messages follow the repo's existing convention; if none exists, use: `feat: <what was implemented>`
- If a test fails after implementation and you cannot fix it after **reasonable attempts** (e.g. 3+ focused tries), treat this as **blocking** → *Non-interactive execution* (issue + terminate). Do not force a green build by gutting tests or the spec.

**If something goes wrong:**
- Implementation breaks existing tests → fix the regression before moving on; if the fix is not achievable without violating the spec or breaks invariants, treat as **blocking** → issue + terminate
- Ambiguity in acceptance criteria → apply **tie-break order**: **Key Scenarios** → **Arch Decisions** → **Technical Contract** → **repository conventions**. If ambiguity is **resolved**, document **Assumptions** in the PR body (dedicated section). If still **unresolvable** (no coherent reading), treat as **blocking** → issue + terminate
- A dependency is missing → install it if possible and note it in the PR summary; if it cannot be installed in the sandbox, treat as **blocking** → issue + terminate
- The spec contradicts itself in a way tie-breakers cannot reconcile → **blocking** → issue + terminate; do not guess

### Phase 4: Verification

After all user stories are implemented:

1. Run the full test suite — everything must pass
2. Walk through the Key Scenarios table and confirm each scenario is covered by a test
3. Check that no files were modified outside the scope of the spec
4. Review your own changes: look for leftover debug code, TODOs, or unused imports

### Phase 5: Deliver (success path)

1. Update the spec status from `Approved` to `Done`
2. Open a Pull Request:
   - Branch: `feat/<feature-name>`
   - Title: `feat: <feature-name>`
   - Body: use **sections** (not a live chat summary):
     - **Summary** — what was implemented, per user story
     - **Tests** — what was added or changed
     - **Assumptions** — explicit assumptions from tie-breakers (omit section if none)
     - **Deviations** — any deviation from the spec with justification (omit if none)
     - **Follow-ups** — risks or optional next steps (omit if none)
     - **Spec** — link to `specs/<feature-name>.md`
   - Reference the spec PR if it exists

## Non-interactive execution

There is **no** human in the loop during the run: do not ask questions or wait for answers.

**Success:** proof lives in the **PR description** and **passing tests** (and CI, if applicable).

**Blocked — impossible to complete the spec:**  
1. **Stop** — do not open a PR that claims the feature is done.  
2. **Open a GitHub issue** with at minimum:
   - Title pattern: `implementing blocked: <feature-name>`
   - Link to `specs/<feature-name>.md`
   - What was attempted (stories, commits, branches if any)
   - Objective reason for the block (contradiction, missing dependency, irresolvable ambiguity, tests/CI that cannot be satisfied, etc.)
   - Evidence: relevant spec excerpts, error output, failing test names  
3. **End the agent run.** Sandbox logs should reflect failure for the orchestrator.

Optional: push a WIP branch only if the orchestrator requires a trace — the **issue** is the primary failure artifact.

## Important

- The spec is law — don't add features, don't skip requirements
- Tests are not optional — every acceptance criterion must have a corresponding test
- Match existing codebase patterns — don't impose new conventions
- Keep commits atomic — one story, one commit
- Never silently work around a broken spec — resolve with documented assumptions in the PR, or file an issue and stop
