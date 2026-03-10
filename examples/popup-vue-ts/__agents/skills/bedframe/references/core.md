# `@bedframe/core`

## Primary Bedframe helpers

- `createBedframe(...)`
- `createManifest(...)`
- `createManifestBase(...)`
- `bedframe(...)`

## Important types

- `Bedframe`
- `BuildTarget`
- `Manifest`
- browser and framework enums in `types.ts`

Use these helpers and types rather than inventing parallel project shapes.

## Minimal examples

```ts
import { createBedframe } from '@bedframe/core'

export default createBedframe({
  browser: [chrome.browser],
  extension: {
    type: 'popup',
    manifest: [chrome],
    pages: {
      popup: 'src/pages/main.html',
    },
  },
  development: {
    template: {
      config: {
        framework: 'react',
        language: 'typescript',
        packageManager: 'bun',
      },
    },
  },
})
```

```ts
import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

export const chrome = createManifest(baseManifest, 'chrome')
```

```ts
import { bedframe } from '@bedframe/core'

plugins: [bedframe(manifest)]
```

## Usage guidance

- Prefer exported `BuildTarget`, `Manifest`, and Bedframe enums/types from core over custom local types.
- Keep core usage aligned with current config/manifests/vite wiring.
