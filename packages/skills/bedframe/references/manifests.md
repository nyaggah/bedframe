# Bedframe Manifests

## Files

- `src/manifests/base.manifest.ts`
- `src/manifests/<browser>.ts`

## Canonical pattern

Keep shared fields in `base.manifest.ts`, then apply browser deltas in each browser file.

```ts
import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

const updatedManifest = {
  ...baseManifest,
  // browser-specific deltas only
}

export const chrome = createManifest(updatedManifest, 'chrome')
```

## Firefox example (MV3-compatible Bedframe delta)

```ts
import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

const { side_panel, ...rest } = baseManifest

const updatedFirefoxManifest = {
  ...rest,
  background: {
    scripts: [baseManifest.background.service_worker],
  },
  sidebar_action: {
    default_icon: baseManifest.action.default_icon,
    default_title: baseManifest.name,
    default_panel: side_panel.default_path,
  },
  browser_specific_settings: {
    gecko: {
      id: baseManifest.author.email,
    },
  },
}

export const firefox = createManifest(updatedFirefoxManifest, 'firefox')
```

## Safari example

```ts
import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

const updatedSafariManifest = {
  ...baseManifest,
  browser_specific_settings: {
    safari: {
      strict_min_version: '15.4',
      strict_max_version: '*',
    },
  },
}

export const safari = createManifest(updatedSafariManifest, 'safari')
```

## Rules

- keep shared fields in the base manifest
- keep browser files focused on browser-specific deltas
- keep permissions narrow
- update config/pages/scripts together when manifest-linked paths change
- edit source manifests only; treat `dist/<browser>/manifest.json` as output

## Verify

- run `bedframe build <browser>`
- inspect generated `dist/<browser>/manifest.json` for expected browser deltas
