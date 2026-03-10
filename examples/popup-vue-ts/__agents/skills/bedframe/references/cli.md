# Bedframe CLI

## Main commands

- `bedframe make`
- `bedframe dev`
- `bedframe build`
- `bedframe zip`
- `bedframe version`
- `bedframe publish`

## Scaffold branches (`bedframe make`)

- Upstream Vite scaffold branch:
  - uses non-interactive `create-vite` with framework/language template mapping.
- shadcn branch (React + Tailwind + shadcn selection):
  - bootstraps project via non-interactive `shadcn init` on Vite template.
- After bootstrap, Bedframe applies install/config/codemod steps and writes Bedframe-specific project surfaces.

## Command selection

- scaffold project shape: `bedframe make`
- verify local runtime behavior: `bedframe dev`
- verify build output: `bedframe build`
- package archives for distribution: `bedframe zip`
- prepare release/version state: `bedframe version`
- publish direct targets: `bedframe publish --browsers <list>`

## Browser-target examples

- develop selected browsers: `bedframe dev chrome,safari`
- build selected browsers: `bedframe build chrome,firefox`
- publish supported direct targets: `bedframe publish --browsers chrome,edge,firefox`

## Verification strategy

Use the smallest command that proves the change:

- manifest or page wiring: `bedframe build <one-browser>`
- runtime behavior: `bedframe dev <one-browser>`
- release-path checks: `bedframe version` then `bedframe build`

Use the smallest command that proves the change.
