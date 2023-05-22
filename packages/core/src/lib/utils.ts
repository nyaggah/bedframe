import type { Manifest } from './types'

export type ObjectValues<T> = T[keyof T]

export function createEnum<T extends Record<string, string>>(enumObj: T) {
  return Object.values(enumObj) as unknown as ObjectValues<T>
}

export type AnyCase<T extends string> =
  | Uppercase<T>
  | Lowercase<T>
  | Capitalize<T>
  | Uncapitalize<T>

export type AnyCaseLanguage<T extends string, K extends string> =
  | Uppercase<T | K>
  | Lowercase<T | K>
  | Capitalize<T | K>
  | Uncapitalize<T | K>

export type OptionalKeys<T> = {
  [K in keyof T as undefined extends T[K] ? K : never]: T[K]
}

export type RequiredManifestFields = Pick<
  Manifest,
  'name' | 'version' | 'manifest_version'
>

export type RecommendedManifestFields = Pick<
  Manifest,
  'default_locale' | 'description' | 'icons'
>

/**
 * SharedManifestFields
 * Required Fields + Optional potentially overlapping fields for all/ most Browser Manifests
 */
export type SharedManifestFields = RequiredManifestFields &
  Omit<Manifest, 'name' | 'version' | 'manifest_version'>

/**
 * @param {string} browser - any of modern `Browser`s
 * @return {*}  {Manifest} - valid (MV3) browser `Manifest` for browser.
 */

// export function getManifestForBrowser(browser: string): Manifest {
//   if (browser === 'chrome') {
//     return chromeManifest
//   }
//   if (browser === 'brave') {
//     return braveManifest
//   }
//   if (browser === 'opera') {
//     return operaManifest
//   }
//   return chromeManifest
// }

// const manifest = getManifestForBrowser(browser) as ManifestV3Export
// ^^^ TO diddly Do: in `vite.config.ts` >>> `@crxjs/vite-plugin` needs to play nice... cuh'mon maaan! just use the Goog `Manifest` from bedframe package

/*
Re: Cross-browser extension considerations (re: composing manifest.json)
https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions/Build_a_cross_browser_extension

---

API namespace
There are two API namespaces in use among the main browsers:

  - browser.*, the proposed standard for the extensions API used by Firefox and Safari.
  - chrome.* used by Chrome, Opera, and Edge.
*/
