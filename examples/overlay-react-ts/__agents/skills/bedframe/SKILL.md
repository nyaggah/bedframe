---
name: bedframe
description: Work in a Bedframe browser extension project. Use when the repository contains AGENTS.md, src/_config/bedframe.config.ts, src/manifests/*, or the task involves the Bedframe CLI, @bedframe/core, browser manifests, extension pages, Vite config, or release flow.
---

# Bedframe

Use this skill for any task inside a Bedframe project.

Bedframe is a cross-browser browser extension framework built around the `B.E.D.` model:

- `Browser`
- `Extension`
- `Development`

Most project-defining changes should be understood through `src/_config/bedframe.config.ts` and the root `AGENTS.md`.

## Inspect first

- `AGENTS.md`
- the nearest folder-level `AGENTS.md` for the files you are editing
- `src/_config/bedframe.config.ts`

## Critical rules

- Treat `src/_config/bedframe.config.ts` as the canonical project definition.
- Keep config, manifests, pages, scripts, package metadata, and workflow files aligned.
- Edit source files, not generated `dist/*` output.
- Use `@bedframe/core` helpers and types when they already define the structure.
- Use the smallest Bedframe CLI command that verifies the task.
- Treat build support and publish support as different concerns.
- Bedframe is Vite-based, but generic Vite SSR/server patterns are not part of the default Bedframe contract.

## Operating model

Use this single skill for all Bedframe tasks.

Route within the skill by task type:

- new project or scaffold shape:
  - inspect `references/cli.md`
- config, browser targets, extension shape, or development settings:
  - inspect `references/config.md`
- manifest and browser-target work:
  - inspect `references/manifests.md`
  - inspect `references/browser-differences.md` when browser-specific behavior matters
- page and HTML entrypoint work:
  - inspect `references/pages.md`
- runtime and service worker work:
  - inspect `references/scripts.md`
- local development or production build verification:
  - inspect `references/cli.md`
  - inspect `references/vite.md`
- tests:
  - inspect `references/testing.md`
- version, release, and publish:
  - inspect `references/mvp.md`
  - inspect `references/publish.md`

Do not look for a separate Bedframe skill per CLI command. Treat those workflows as modes within this skill.

## Read next

- `references/REFERENCE.md`
- `references/architecture.md`
- `references/cli.md`
- `references/config.md`
- `references/core.md`
- `references/vite.md`
- `references/testing.md`
- `references/manifests.md`
- `references/pages.md`
- `references/scripts.md`
- `references/browser-differences.md`
- `references/mvp.md`
- `references/publish.md`
- `references/codemods.md`
- `references/examples.md`
