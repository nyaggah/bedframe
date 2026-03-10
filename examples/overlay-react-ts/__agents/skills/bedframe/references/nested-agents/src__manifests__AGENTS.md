# `src/manifests`

This folder contains Bedframe manifest source files.

## Working rules

- `base.manifest.ts` is the shared manifest source.
- Keep browser files focused on browser-specific deltas from the base manifest.
- Each browser file should export a Bedframe `BuildTarget`.
- Treat generated `dist/<browser>/manifest.json` as output, not source.
- Prefer narrow permission and browser-specific changes over global manifest churn.

## Current project shape

- Active browsers: {{browser_targets}}
- Extension type: `{{extension_type}}`

## Browser notes

- Firefox requires deliberate `browser_specific_settings.gecko.id` handling before publish.
- Safari build output is supported separately from direct Bedframe store publish.

## Read next

- Root `AGENTS.md`
- `src/_config/AGENTS.md`
- `.agents/skills/bedframe`
