#!/usr/bin/env bash
set -euo pipefail

if [ -z "${1:-}" ]; then
  echo "Usage: $0 <iterations>"
  exit 1
fi

REPO_ROOT="$(cd "$(dirname "$0")" && pwd)"
cd "$REPO_ROOT"

require_cmd() {
  if ! command -v "$1" >/dev/null 2>&1; then
    echo "Required command not found: $1"
    exit 1
  fi
}

require_cmd git
require_cmd gh
require_cmd jq
require_cmd opencode
require_cmd node

if ! git rev-parse --git-dir >/dev/null 2>&1; then
  echo "This script must be run from inside the mathinik repo"
  exit 1
fi

if [ ! -f package.json ]; then
  echo "package.json not found"
  exit 1
fi

if [ -n "$(git status --porcelain)" ]; then
  echo "Working tree is not clean. Refusing to start."
  git status --short
  exit 1
fi

has_script() {
  node -e 'const fs=require("fs"); const p=JSON.parse(fs.readFileSync("package.json","utf8")); process.exit(p.scripts && p.scripts[process.argv[1]] ? 0 : 1)' "$1"
}

build_verification_steps() {
  local steps=()

  if has_script typecheck; then
    steps+=("npm run typecheck")
  fi
  if has_script lint; then
    steps+=("npm run lint")
  fi
  if has_script test; then
    steps+=("npm run test")
  fi
  if has_script build; then
    steps+=("npm run build")
  fi

  if [ ${#steps[@]} -eq 0 ]; then
    echo "No verification scripts found in package.json."
    return
  fi

  printf '%s\n' "${steps[@]}"
}

next_issue_json() {
  gh issue list \
    --state open \
    --limit 200 \
    --json number,title,labels \
    --jq '
      map(
        select(.title | test("^MIP-[0-9]{3}:"))
        | select(((.labels // []) | map(.name)) | index("blocked") | not)
      )
      | sort_by(.title)
      | .[0]
    '
}

for ((i=1; i<=$1; i++)); do
  echo "Iteration $i"
  echo "--------------------------------"

  issue_json="$(next_issue_json)"

  if [ -z "$issue_json" ] || [ "$issue_json" = "null" ]; then
    echo "No suitable open implementation issues remain."
    exit 0
  fi

  issue_number="$(printf '%s' "$issue_json" | jq -r '.number')"
  issue_title="$(printf '%s' "$issue_json" | jq -r '.title')"
  issue_body="$(gh issue view "$issue_number" --json body --jq '.body')"
  verify_steps="$(build_verification_steps)"

  prompt=$(cat <<EOF
Work in the mathinik repo.

Implement exactly GitHub issue #$issue_number.

Issue title:
$issue_title

Issue body:
$issue_body

Before coding, read and follow these docs:
- PRD.md
- CONTENT-SCHEMA.md
- STATE-SCHEMA.md
- ARCHITECTURE.md
- STACK-DECISIONS.md
- IMPLEMENTATION-PLAN.md
- OPENCODE-WORKFLOW.md

Rules:
1. Work on only this single issue.
2. Create an appropriate branch for this issue.
3. Keep scope tight and aligned with the issue.
4. Make one coherent commit when practical and include #$issue_number in the commit message.
5. Open a PR to main when done.
6. Do not start another issue.
7. If blocked, stop and report the blocker clearly.

After implementation, run these verification steps from package.json scripts when available:
$verify_steps

When done, output a concise summary containing:
- issue number
- branch name
- commit hash
- PR URL
- verification steps run
- blocker if any

If there are no more suitable issues after this issue, output <promise>COMPLETE</promise>.
EOF
)

  result="$(opencode -p "$prompt")"

  echo "$result"

  echo
  echo "Post-run repo status"
  echo "--------------------------------"
  echo "Current branch: $(git branch --show-current)"
  echo "Latest commit:"
  git log --oneline -1 || true
  echo
  echo "Working tree:"
  git status --short || true
  echo
  echo "Recent PRs:"
  gh pr list --limit 5 || true
  echo

  if [[ "$result" == *"<promise>COMPLETE</promise>"* ]]; then
    echo "No more suitable issues remain, exiting."
    exit 0
  fi
done
