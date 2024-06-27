import { createManifest } from '@bedframe/core'
import { baseManifest } from './base.manifest'

export const chrome = createManifest(
  {
    ...baseManifest, // MV3 manifest
  },
  'chrome',
)
