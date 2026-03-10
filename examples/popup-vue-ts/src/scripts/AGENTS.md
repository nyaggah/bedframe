# `src/scripts`

This folder contains Bedframe runtime script source files.

## Working rules

- Keep script paths aligned with the manifest source and actual files on disk.
- The service worker is the default background/runtime entrypoint in a standard Bedframe scaffold.
- Only add content scripts or extra runtime files when the extension shape or feature actually requires them.
- Do not move runtime files without re-checking `src/manifests/*` and `src/_config/bedframe.config.ts`.

## Current project shape

- Extension type: `{{extension_type}}`
- Framework: `{{framework}}`

## Read next

- Root `AGENTS.md`
- `src/manifests/AGENTS.md`
- `.agents/skills/bedframe`
