import { AnyCase, createEnum } from './utils'

export const FrameworkEnum = {
  React: 'React',
  Vanilla: 'Vanilla',
  Preact: 'Preact',
  Lit: 'Lit',
  Svelte: 'Svelte',
  Vue: 'Vue',
} as const

export const BrowserEnum = {
  Chrome: 'Chrome',
  Brave: 'Brave',
  Opera: 'Opera',
  Edge: 'Edge',
  Firefox: 'Firefox',
  Safari: 'Safari',
} as const

const LanguageEnum = {
  TypeScript: 'TypeScript',
  JavaScript: 'JavaScript',
} as const

export const StyleEnum = {
  'Styled Components': 'Styled Components',
  Tailwind: 'Tailwind',
} as const

export const PackageManagerEnum = {
  Yarn: 'Yarn',
  Npm: 'Npm',
  PnPm: 'PnPm',
} as const

export type Manifest = chrome.runtime.ManifestV3
export type ManifestIcons = chrome.runtime.ManifestIcons
export type ManifestBackground = chrome.runtime.ManifestV3['background']
export type ManifestContentScripts =
  chrome.runtime.ManifestV3['content_scripts']
export type ManifestWebAccessibleResources =
  chrome.runtime.ManifestV3['web_accessible_resources']
export type ManifestCommands = chrome.runtime.ManifestV3['commands']
export type ManifestAction = chrome.runtime.ManifestV3['action']
export type ManifestPermissions = chrome.runtime.ManifestV3['permissions']
export type ManifestOptionsUI = chrome.runtime.ManifestV3['options_ui']
export type ManifestURLOverrides =
  chrome.runtime.ManifestV3['chrome_url_overrides']

export type BrowserName<T extends string> = Capitalize<T> | Lowercase<T>
export type BrowserEnumType<T extends string> = {
  [browser in BrowserName<T>]: BrowserName<T>
}

// vite.config crx({manifest}) config
export type BuildMode = AnyCase<Browser>
export type BuildTarget = {
  manifest: Manifest
  browser: AnyCase<Browser>
}
export type BuildConfig = {
  command?: 'build' | 'serve'
  mode?: AnyCase<Browser> | string | undefined
  // ^^^ `Browser` for @bedframe-specific build modes... rest for vite and pals
}

export interface Repository {
  type: string // will be set to 'git' if user selects to user --source-control=git
  url?: string // valid git repo URL
  bugs?: Bugs
}

export interface Bugs {
  url?: string // valid  URL
  email?: string // validate
}

export type Browser = (typeof BrowserEnum)[keyof typeof BrowserEnum]
export const Browser: AnyCase<Browser> = createEnum(BrowserEnum)

export type PackageManager =
  (typeof PackageManagerEnum)[keyof typeof PackageManagerEnum]
export const PackageManager: AnyCase<PackageManager> =
  createEnum(PackageManagerEnum)

export type Framework = (typeof FrameworkEnum)[keyof typeof FrameworkEnum]
export const Framework: AnyCase<Framework> = createEnum(FrameworkEnum)

export type Style = (typeof StyleEnum)[keyof typeof StyleEnum]
export const Style: AnyCase<Style> = createEnum(StyleEnum)

export type Language = (typeof LanguageEnum)[keyof typeof LanguageEnum]
export const Language: AnyCase<Language> = createEnum(LanguageEnum)
