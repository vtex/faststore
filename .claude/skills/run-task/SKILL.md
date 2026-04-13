---
name: run-task
description: Execute a spec-driven tasks from the provided folder or from user-provided specifications. Guides through planning, review, and step-by-step implementation.
argument-hint: [folder containing the implementation plans]
allowed-tools: Read, Write, Edit, Glob, Grep, Bash(git status, git diff, git log, git branch, git add, git commit, ls, yarn lint, yarn lint:fix), Task, AskUserQuestion, TodoWrite, Skill
---

# Run Task — SDD Implementation Skill

You are executing a spec-driven implementation task. Follow the phases below **in strict order**. Do not skip phases.

## Phase 1: Preparation

1. If `$ARGUMENTS` is provided, use it as the source folder for the plans. For each plan in the source folder, use the file name as the action name.
2. If not provided, asks the user the folder directory containing the execution plans using `AskUserQuestion`.
3. If none is provided, do not proceed to the other phase, and repeat the previous question. Explain with the following words: `I cannot proceed without a plan. Could you tell me which file contains the detailed plan?`
4. Once a valid folder is provided, reads the folder and confirm the plans with the user.
5. Run `/log-task` skill and prepare the table with the available information - start timestamp, task name, prompt used, number of agents to be used. Use the task name as argument.



## Phase 2: Execution

Run the first plan in the folder. For **each step** in the current plan:

1. Mark the step as in-progress in the plan file: `- [~] **Step N:** ...`
2. Implement the step exactly as described.
3. **As each agent finishes**, immediately append the timing and total tokens from the task notification to `@sdd/experiment-tracking.json`:
```json
{
  "step-1":
    {"agent": "Agent A",
    "total_tokens": 12345,
    "duration_ms": 8900,
    "total_duration_seconds": 8.9}
}
```
!!! This data is only available at the moment the notification arrives — don't defer it.
4. After completing the step, mark it as done in the plan file: `- [x] **Step N:** ...`
5. Move to the next step.

Once all steps in the plan are completed, move on to the next plan in the folder.

### STOP Rules — Halt immediately if:

- **Blocker:** A missing dependency, unavailable API, or broken import prevents progress.
- **Test/Lint failure:** `yarn lint` or any verification step fails and the fix is not obvious.
- **Unclear instruction:** A plan step is ambiguous and could be interpreted multiple ways.
- **Verification fails repeatedly:** The same check fails after two attempts.
- **Critical gap:** You realize the plan is missing a step that's required before continuing.

When stopped, **explain what went wrong**, quote the relevant error or ambiguity, and **ask the user for clarification**. Do not guess.

---

## Phase 3: Verification

After all plans are completed:

1. Run `yarn lint` and fix any issues (up to 2 attempts, then stop and ask).
2. Verify no TypeScript errors exist in the changed files.
3. Run any additional verification checks listed in the plan.
4. Update the plan file status from `Draft` to `Completed`.
5. Run `/log-task` skill again and fill in the table with the missing information - end timestamp, tokens spent.

---

## Phase 4: Wrap-up

1. Summarize what was implemented.
2. List all files created or modified.
3. Follow the **Task Logging Rule** from `CLAUDE.md`: ask the user if they want to log the task to the experiment tracker. If yes, invoke `/log-task` with a concise description.
4. Include the task and its summary in the CHANGELOG.md file

---

## Hard Rules

- **Never push to remote.** No `git push` under any circumstance.
- **Never skip user review.** The plan must be approved before execution starts.
- **Ask, don't guess.** When in doubt, stop and ask.
- **One step at a time.** Don't batch multiple plan steps together.
- **Keep the plan file updated.** It is the source of truth for progress.
