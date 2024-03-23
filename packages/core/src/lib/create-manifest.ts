import type { Browser, BuildTarget, Manifest } from './types'
import type { AnyCase } from './utils'
/**
 *
 *
 * @export
 * @param {Manifest} manifest
 * @param {AnyCase<Browser>} browser
 * @return {*}  {@link BuildTarget}
 */
export function createManifest(
  manifest: Manifest,
  browser: AnyCase<Browser>,
): BuildTarget {
  return {
    manifest,
    browser,
  }
}

/**
 * create a base Manifest to inherit from
 * type Manifest = chrome.runtime.ManifestV3
 *
 * use as shared base to extend inBrowser manifests
 *
 * @export
 * @param {Manifest} manifest
 * @return {*}  {@link Manifest}
 */
export function createManifestBase(manifest: Manifest): Manifest {
  return manifest
}
