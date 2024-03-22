import type { ManifestV3Export } from '@crxjs/vite-plugin'
import { type AnyCase, createEnum } from './utils'

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
  Tailwind: 'Tailwind',
} as const

export const PackageManagerEnum = {
  // Bun: "Bun", // https://youtu.be/fmpw7fO8iFs?si=KBXSZerQRCdQ0U1c&t=25
  PnPm: 'PnPm',
  Npm: 'Npm',
  Yarn: 'Yarn',
} as const

export type Manifest = ManifestV3Export & {
  browser_specific_settings?: {
    gecko?: {
      id: string
      strict_min_version?: string
      strict_max_version?: string
    }
  }
}

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

export type BuildMode = AnyCase<Browser>
export type BuildTarget = {
  manifest: Manifest
  browser: AnyCase<Browser>
}
export type BuildConfig = {
  command?: 'build' | 'serve'
  mode?: AnyCase<Browser> | string | undefined
}

export interface Repository {
  type: string
  url?: string
  bugs?: Bugs
}

export interface Bugs {
  url?: string
  email?: string
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
