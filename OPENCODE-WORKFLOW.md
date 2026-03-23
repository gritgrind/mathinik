# OpenCode Workflow

This document defines how Mathinik should invoke and supervise OpenCode runs.

It exists because OpenCode is expected to run as an **ACP/external coding harness**, not as a native sub-agent or an ad hoc local CLI workflow.

## Core rule

Use **ACP to run OpenCode**.

Monitor progress by:
- branch creation
- commit creation
- pushed branch
- PR creation
- expected file/code changes

Do **not** rely only on:
- chat silence
- lack of chat updates
- harness completion chatter alone

Repo artifacts are the source of truth.

---

## Why this workflow exists

OpenCode can complete repo work successfully even when harness/session reporting is incomplete or delayed.

That means successful supervision should be based on:
1. Git state
2. GitHub state
3. file artifacts
4. then session/chat feedback

This workflow reduces false alarms when the coding harness is quiet.

---

## Invocation model

### Required invocation path

Invoke OpenCode via:
- `runtime: "acp"`
- `agentId: "opencode"`

### Preferred mode

Use a persistent ACP session bound to a thread **when the current surface supports ACP thread binding**.

### Fallback mode

If ACP thread binding is unavailable on the current surface, fall back to:
- ACP one-shot run mode

### Important note

If ACP thread/session constraints on the current surface prevent long-lived binding, do **not** fall back to a native sub-agent just to keep continuity. Prefer ACP run mode and artifact-based supervision.

---

## Required task contract for OpenCode

Every OpenCode task should include a clear output contract.

Tell OpenCode to do all of the following when relevant:
1. create or use the correct branch
2. read the required project docs before implementation
3. make only the intended issue/task changes
4. commit the work
5. push the branch
6. open a PR if requested
7. report back with concrete identifiers

### Required report fields

An OpenCode task should return, when applicable:
- branch name
- commit hash
- PR URL
- changed files summary
- test/build result
- blocker note if incomplete

---

## Required doc-reading behavior

Before working on an implementation issue, OpenCode should read the relevant repo docs.

### Always-read project docs
- `PRD.md`
- `CONTENT-SCHEMA.md`
- `STATE-SCHEMA.md`
- `ARCHITECTURE.md`
- `STACK-DECISIONS.md`
- `IMPLEMENTATION-PLAN.md`

### Issue-specific docs
For a specific issue, OpenCode should also read the issue body and its referenced docs/sections.

### Confirmation requirement
OpenCode should explicitly confirm which docs it read whenever the task asks for that confirmation.

---

## Monitoring model

## Principle

Treat **repo and GitHub artifacts** as the primary evidence of progress.

### Primary success signals
1. expected branch exists
2. expected commit exists
3. expected files changed
4. branch is pushed to remote
5. PR exists when requested

### Secondary success signals
6. chat/session summary arrived
7. harness emitted a clean completion update

If primary signals exist but chat output is weak or silent, treat the run as likely successful and verify further.

---

## Verification checklist

After an OpenCode run, verify these in order:

### Git/repo verification
- [ ] repo is on the expected branch or branch exists locally
- [ ] recent commit exists
- [ ] commit message matches expected task/issue scope
- [ ] changed files match the requested task
- [ ] working tree is acceptable after the run

### GitHub verification
- [ ] remote branch exists
- [ ] PR exists if requested
- [ ] PR title/body roughly match the requested task

### Output verification
- [ ] reported branch matches actual branch
- [ ] reported commit matches actual commit
- [ ] reported PR URL exists
- [ ] tests/build results are believable and relevant

---

## Silence and timeout handling

### If OpenCode is quiet for 60–120 seconds
Do **not** assume failure immediately.

Instead verify:
- branch creation
- recent commits
- expected file creation/modification
- PR creation

### Treat as likely in-progress if
- branch exists and moved
- commit exists
- repo files changed as expected
- PR has appeared

### Treat as likely blocked if
- no branch progress exists
- no commit exists
- no expected files changed
- no PR exists
- no repo-side evidence of work is visible

---

## Blocked-run behavior

If OpenCode appears blocked, determine which of these is true:
- waiting for auth
- waiting for interactive input
- failed to push
- failed to open PR
- unclear issue/task scope
- repo is dirty or branch state is wrong

If possible, recover by checking repo/GitHub state first.
Do not assume chat silence is the root cause.

---

## Repo-side summary requirement

For important runs, OpenCode should write a durable repo-side summary.

Recommended options:
- `OPENCODE.md` for persistent process notes
- a future `runs/` log directory for per-run summaries

A repo-side summary is useful when harness output is incomplete.

### Suggested contents
- task performed
- docs read
- branch name
- commit hash
- PR URL
- blockers or ambiguities
- important implementation constraints observed

---

## Branch model guidance

Mathinik’s intended workflow is:
- one batch branch
- one issue = one commit
- multiple issue commits on the same batch branch
- one PR per batch

### Implication for OpenCode
For issue execution:
- use the assigned batch branch
- do not create a fresh branch per issue unless explicitly told
- keep each issue to one coherent commit whenever practical
- do not mix unrelated issue work into the same commit

---

## Issue execution guidance

When OpenCode is used for a GitHub issue:
1. verify dependencies are satisfied
2. read the issue body
3. read the issue’s referenced docs
4. implement only that issue’s intended scope
5. run relevant validation/tests
6. commit once for the issue when possible
7. push the batch branch
8. update PR if the batch PR already exists, or open one if requested

---

## Recommended commit hygiene

OpenCode should prefer commit messages that map clearly to issue work.

Examples:
- `feat: scaffold app shell (#8)`
- `chore: set up tooling baseline (#9)`
- `test: add testing baseline (#11)`

This keeps the batch branch readable and reviewable.

---

## What not to do

Do not:
- rely only on harness chat completion text
- assume silence means failure
- treat native sub-agent execution as equivalent to ACP OpenCode runs
- mix multiple unrelated issues into one commit
- leave the branch in a broken state after an issue commit
- skip referenced docs for implementation tasks

---

## Short operational summary

### Invoke
Use ACP to run OpenCode.

### Supervise
Verify branch, commit, pushed branch, PR, and changed files.

### Trust order
Repo artifacts first, harness chatter second.

### For Mathinik issues
Read the project docs, keep issue scope tight, and preserve one-issue-one-commit discipline.
