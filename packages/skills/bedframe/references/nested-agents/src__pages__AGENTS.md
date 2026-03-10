# `src/pages`

This folder contains Bedframe HTML entrypoints.

## Working rules

- Keep page files aligned with `extension.pages` in `src/_config/bedframe.config.ts`.
- Keep any manifest-declared page fields aligned with the actual page paths.
- Do not add page entrypoints without checking config and manifest implications.

## Current project shape

- Extension type: `{{extension_type}}`
- Options mode: `{{options_mode}}`
- Override mode: `{{override_mode}}`
- Framework: `{{framework}}`

## Page guidance

- Some pages map directly to manifest fields such as popup, options, sidepanel, devtools, or overrides.
- Additional pages belong in `extension.pages`.
- When the extension shape changes, re-check `src/_config/bedframe.config.ts`, `src/manifests/*`, and `vite.config.ts`.
