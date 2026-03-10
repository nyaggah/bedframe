# Codemod Assets

Use this location for Bedframe skill-adjacent codemod/reference assets that the CLI may read.

## Scope

- Keep codemod assets under `packages/skills/bedframe/references/**`.
- Do not create top-level package folders that look like separate skills.
- Keep these assets static and reusable across projects.

## Current asset locations

- nearest-folder AGENTS templates:
  - `references/nested-agents/*`
- base skill template:
  - `references/template/SKILL.md`

## Authoring contract

When adding a codemod/reference asset:

1. place it under a focused subfolder in `references/`
2. document when it is used and by which CLI path
3. avoid project-instance placeholders when possible
4. keep project-specific values in generated root/nearest `AGENTS.md` files

## CLI usage contract

- CLI should resolve canonical assets from published `@bedframe/skills` first (or workspace equivalent in local development).
- CLI should treat missing asset resolution as warning-level and continue scaffold when possible.
