import { ManifestV3Export } from '@crxjs/vite-plugin'
import { Browser, BuildMode, BuildTarget } from './types'

/**
 * Given the `Mode` i.e. `Browser` target, return the appropriate `Manifest` to build from
 *
 *
 * ```typescript
 * type BuildMode = Browser
 * type BuildTarget = {
 *   manifest: Manifest
 *   browser: Browser
 * }
 * ```
 * @example
 *
 *  If the following script is present in project's `package.json`,
 *
 * ```json
 * "scripts": {
 *  "build:extension-chrome": "vite build --mode chrome",
 * }
 * ```
 *
 * then it will build for the chrome browser
 *
 * @export
 * @param {BuildMode} mode
 * @param {BuildTarget[]} targets
 * @return {*} { Manifest }
 *
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
