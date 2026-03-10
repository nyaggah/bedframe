# Bedframe Scripts

## Files

- `src/scripts/*`

## Runtime role

- `src/scripts/service-worker.ts` is the default background/runtime entrypoint in scaffolded projects.
- Overlay projects may include content scripts (for example `src/scripts/content.tsx`) referenced from manifest `content_scripts`.

## Rules

- keep service-worker and content-script paths aligned with manifests
- runtime files are source, not generated output
- re-check manifest/config assumptions before moving or renaming scripts

## Extension-type notes

- `sidepanel`: service worker often handles sidepanel welcome/main transitions.
- `popup` and `overlay`: action click listeners commonly bridge to page/content behavior.
- `devtools`: ensure runtime messaging assumptions match devtools page/panel flow.

## Safe rename/move checklist

1. update script path in `src/manifests/base.manifest.ts` (and browser deltas if needed)
2. update any references in `src/_config/bedframe.config.ts`
3. update imports/usages in runtime/page code
4. run `bedframe build <browser>` and validate generated manifest script paths
