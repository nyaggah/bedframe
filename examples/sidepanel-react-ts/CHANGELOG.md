# sidepanel-react-ts

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

## 0.0.3

### Patch Changes

- 7f8128b: add temp legacy config.

  ```
  legacy: {
    skipWebSocketTokenCheck: true,
  },
  ```

  Temporary workaround for upstream (crxjs) issue:
  change to Vite CORS policies in the dev server:

  "
  In Vite 6.0.8 and below, WebSocket server was able to connect from any web pages. However,
  that could be exploited by a malicious web page.

  In Vite 6.0.9+, the WebSocket server now requires a token to connect from a web page.
  But this may break some plugins and frameworks that connects to the WebSocket server
  on their own. Enabling this option will make Vite skip the token check.

  We do not recommend enabling this option unless you are sure that you are fine with
  that security weakness.
  "

  ^^^
  - https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184
  - https://github.com/vitejs/vite/blob/9654348258eaa0883171533a2b74b4e2825f5fb6/packages/vite/src/node/config.ts#L535

## 0.0.2

### Patch Changes

- fd2cf80: project gen updates + commit hook clean up
