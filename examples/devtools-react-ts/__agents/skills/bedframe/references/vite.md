# Bedframe And Vite

Bedframe projects are Vite-based.

## Primary file

- `vite.config.ts|js`

## Bedframe-specific Vite guidance

- Bedframe's manifest/plugin integration belongs in `bedframe(manifest)`.
- Browser-target selection flows through Bedframe build targets and Vite mode.
- Build outputs are typically browser-scoped (for example `dist/<browser>` based on mode passed by Bedframe CLI).
- `vite.config.*` is build plumbing, not the canonical Bedframe project-definition file.

## Canonical shape

```ts
import { defineConfig } from 'vite'
import { bedframe } from '@bedframe/core'
import bedframeConfig from './src/_config/bedframe.config'

const { manifest, pages } = bedframeConfig.extension

export default defineConfig(({ mode }) => ({
  plugins: [bedframe(manifest)],
  build: {
    outDir: `dist/${mode}`,
    rollupOptions: {
      input: pages,
    },
  },
}))
```

## Plugin ordering notes

- Keep `bedframe(manifest)` in the active plugin chain.
- Add framework/style plugins (React, Vue, Tailwind, etc.) around it as needed by template.
- Keep aliases/tests/options aligned with `bedframe.config.ts` and scaffold choices.

## Fallback guidance

- Some upstream templates may not include a Vite config file.
- When missing, create `vite.config.ts|js` and apply Bedframe plugin + output/path wiring explicitly.

## Out of scope by default

The default Bedframe contract does not assume:

- SSR
- generic server middleware patterns
- library mode
- unrelated plugin-authoring work
