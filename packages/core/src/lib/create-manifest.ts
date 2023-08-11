import { Browser, BuildTarget, Manifest, ManifestIcons } from './types'
import { AnyCase, RequiredManifestFields, SharedManifestFields } from './utils'
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
 * Icons should generally be in PNG format, because PNG has the best support for transparency.
 * They can, however, be in any raster format supported by Blink, including BMP, GIF, ICO, and JPEG.
 *
 * https://developer.chrome.com/docs/extensions/mv3/manifest/icons/
 *
 * ```
 * export interface ManifestIcons {
 *     [size: number]: string;
 * }
 * ```
 * ```
 * return {
 *   16: 'icons/icon-16x16.png', // Required: used asfavicon for an extension's pages.
 *   32: 'icons/icon-32x32.png', // Optional:
 *   48: 'icons/icon-48x48.png', // Required: used in extensions management page (chrome://extensions)
 *   128: 'icons/icon-128x128.png', // Required: used during installation and by the Chrome Web Store
 * }
 * ```
 *
 * @export
 * @param {ManifestIcons} [icons={ 128: 'icons/icon-128x128.png' }]
 * @return {*}
 *
 */
export function createManifestIcons(icons: ManifestIcons): ManifestIcons {
  return icons
}
/**
 *
 *
 * @export
 * @param {RequiredManifestFields} obj
 * @return {*}  {@link RequiredManifestFields}
 */
export function createManifestRequiredFields(
  obj: RequiredManifestFields,
): RequiredManifestFields {
  return obj
}
/**
 *
 *
 * @export
 * @param {SharedManifestFields} obj
 * @return {*}  {@link SharedManifestFields}
 */
export function createManifestSharedFields(
  obj: SharedManifestFields,
): SharedManifestFields {
  return obj
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

/*
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/manifest.json#notes_about_manifest.json_keys

Notes about manifest.json keys
"manifest_version", "version", and "name" are the only mandatory keys.
"default_locale" must be present if the "_locales" directory is present, and must be absent otherwise.
"browser_specific_settings" is not supported in Google Chrome.
*/
