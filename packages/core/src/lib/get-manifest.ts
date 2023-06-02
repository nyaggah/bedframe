import { ManifestV3Export } from '@crxjs/vite-plugin'
import { Browser, BuildMode, BuildTarget, Manifest } from './types'

/**
 * Given the `Mode` i.e. `Browser` target, return the appropriate `Manifest` to build from
 *
 * ```typescript
 * type BuildMode = Browser
 * type BuildTarget = {
 *   manifest: Manifest
 *   browser: Browser
 * }
 * ```
 * @export
 * @param {BuildMode} mode
 * @param {BuildTarget[]} targets
 * @return {*} { Manifest }
 */
export function getManifest(
  mode: BuildMode,
  targets: BuildTarget[]
): ManifestV3Export {
  const target = targets.find((t) => t.browser === mode)

  if (target) {
    return target.manifest as ManifestV3Export
  }

  const browsers = Object.values(Browser).join(', ').toLowerCase()

  throw new Error(
    `Unknown mode: "${mode}". 'mode' is the browser you're building for. Should be one of ${browsers}`
  )
}
