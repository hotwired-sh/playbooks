# @hotwired-sh/playbooks

## CRITICAL: Commit Message Rules

**Every `.md` file in `playbooks/` is product content, not documentation.**

These files are shipped to agents via the npm package `@hotwired-sh/playbooks`. Any change to playbook `.md` files changes how the app works and MUST trigger a release.

- `feat:` — Use for ANY change to playbook `.md` files (new commands, workflow changes, wording changes)
- `fix:` — Use for corrections to playbook content (wrong command, broken instructions)
- **NEVER** use `docs:` for playbook changes — `docs:` skips the release and the changes won't ship

Only use `docs:` for changes to `README.md` or other non-playbook files.

## Release

Releases are automated via semantic-release on push to `main`. The npm package is published automatically when the version bumps.

## Structure

```
playbooks/
  doc-editor/       # Document editing workflow (writer + critiquer)
  plan-build/       # Planning workflow (strategist + builder)
  architect-team/   # Architecture workflow (architect + worker)
  protocol-base.md  # Shared protocol foundation
```
