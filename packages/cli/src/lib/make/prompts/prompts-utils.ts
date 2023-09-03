import {
  blue,
  cyan,
  green,
  lightCyan,
  lightMagenta,
  lightRed,
  magenta,
  red,
  stripColors,
  yellow,
} from 'kolorist'
import {
  Browser,
  Framework,
  Language,
  PackageManager,
  Style,
} from '@bedframe/core'
import path from 'node:path'

export type ColorType = (str: string | number) => string
export type VariantColor = {
  name: string
  color: ColorType
}

export function disableOptions(disabledOptions: string[]): Set<string> {
  return new Set(disabledOptions)
}

export const packageManagerColors: VariantColor[] = [
  ...Object.values(PackageManager).map((packageManager, i) => {
    const colors = [cyan, yellow, magenta]
    return {
      name: packageManager,
      color: colors[i],
    }
  }),
]

export const BrowserColors: VariantColor[] = [
  ...Object.values(Browser).map((browser, i) => {
    const colors = [cyan, yellow, magenta, lightRed, red, green]
    return {
      name: browser,
      color: colors[i],
    }
  }),
]

export const FrameworkColors: VariantColor[] = [
  ...Object.values(Framework).map((framework, i) => {
    const colors = [cyan, yellow, magenta, lightRed, red, green]
    return {
      name: framework,
      color: colors[i],
    }
  }),
]

export const LanguageColors: VariantColor[] = [
  ...Object.values(Language).map((language, i) => {
    const colors = [blue, yellow]
    return {
      name: language,
      color: colors[i],
    }
  }),
]

export const StyleColors: VariantColor[] = [
  ...Object.values(Style).map((style, i) => {
    const colors = [lightCyan, lightMagenta]
    return {
      name: style,
      color: colors[i],
    }
  }),
]

export function getColor(variants: VariantColor[], key: string): ColorType {
  return variants.find((variant) => variant.name === key)?.color ?? stripColors
}

export const packageManagers = Object.values(PackageManager).map(
  (packageManager) => {
    const _packageManager = packageManager as PackageManager
    const color = getColor(packageManagerColors, _packageManager)
    return {
      title: color(_packageManager),
      value: packageManager,
    }
  },
)

export const browsers = Object.values(Browser).map((browser) => {
  const _browser = browser as Browser
  const color = getColor(BrowserColors, _browser)
  return {
    title: color(_browser.toLowerCase()),
    value: _browser.toLowerCase(),
    // disabled: Boolean(disableOptions(['Firefox', 'Safari']).has(_browser)),
    // ^^^ TO diddly DO: technically you can build for ALL browsers right meow
    // but the "P" in the real MVP (i.e. the Publish in the `Make Version Publish` workflow)
    // only works for Chrome, FF and Edge partially... rest is WIP!
    // https://www.youtube.com/watch?v=fmpw7fO8iFs&t=25s
  }
})

export const frameworks = Object.values(Framework).map((framework) => {
  const _framework = framework as Framework
  const color = getColor(FrameworkColors, _framework)
  return {
    title: color(_framework),
    value: _framework,
    disabled: Boolean(
      disableOptions(['Lit', 'Preact', 'Svelte', 'Vanilla', 'Vue']).has(
        _framework,
      ),
    ),
  }
})

export const languages = Object.values(Language).map((language) => {
  const _language = language as Language
  const color = getColor(LanguageColors, _language)
  return {
    title: color(_language),
    value: _language,
    disabled: Boolean(disableOptions(['JavaScript']).has(_language)),
  }
})

export const stylingOptions = Object.values(Style).map((style) => {
  const _style = style as Style
  const color = getColor(StyleColors, _style)
  return {
    title: color(_style),
    value: _style,
  }
})

export function formatTargetDir(
  value: string,
): Record<'name' | 'path', string> {
  return {
    name: path.basename(value),
    path: path.resolve(value),
  }
}
