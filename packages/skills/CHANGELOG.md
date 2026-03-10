# @bedframe/skills

## 0.1.0

### Minor Changes

- 26cceb0: Standardize Bedframe’s upstream-first scaffold pipeline, modernize project contracts, and align skills/examples with the current OSS workflow.

  ## What changed
  - Reworked scaffold flow to bootstrap from upstream templates first, then apply Bedframe codemods and conventions.
  - Added clearer feature-group handling for install/config/codemod phases during `bedframe make`.
  - Removed legacy font-coupled scaffold behavior from generated Vite configs and example projects.
  - Simplified Bedframe config usage by removing legacy style/font blocks from example project configs.
  - Consolidated agent guidance into the Bedframe skill package and aligned generated `AGENTS.md` + nearest-folder contracts.
  - Expanded Bedframe skill references for architecture, manifests, browser differences, MVP/release, and publish workflows.
  - Migrated root hook setup from Husky to Lefthook and aligned root scripts/tooling.
  - Updated release workflow to pnpm-first execution with Node 24 and removed unnecessary global rollup install steps.
  - Synced examples with current Bedframe conventions and current core/CLI behavior.

  ## Impact

  This release improves scaffold reliability, reduces manual project drift, and makes Bedframe’s CLI/core/skills usable in a more portable agent workflow across
  local and OSS usage.
