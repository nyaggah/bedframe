import type prompts from 'prompts'

export type ShadcnBase = 'radix' | 'base'
export type ShadcnPreset =
  | 'nova'
  | 'vega'
  | 'maia'
  | 'lyra'
  | 'mira'
  | 'custom'

export type ScaffoldSpec = {
  framework: string
  language: string
  packageManager: string
  browsers: string[]
  extensionType: string
  optionsMode: string
  overrideMode: string
  featureFlags: {
    lintFormat: boolean
    tests: boolean
    git: boolean
    gitHooks: boolean
    changesets: boolean
    commitLint: boolean
  }
  style: {
    framework: string
    isTailwind: boolean
    ui: {
      provider: 'none' | 'shadcn'
      shadcn?: {
        base: ShadcnBase
        preset: ShadcnPreset
        cssVariables: boolean
        rtl: boolean
      }
    }
  }
}

export function resolveScaffoldSpec(
  response: prompts.Answers<string>,
): ScaffoldSpec {
  const {
    framework,
    language,
    packageManager,
    style,
    shadcn,
    lintFormat,
    tests,
    git,
    gitHooks,
    changesets,
    commitLint,
  } = response.development.template.config

  const frameworkName = String(framework).toLowerCase()
  const languageName = String(language).toLowerCase()
  const styleName = String(style).toLowerCase()
  const isTailwind = styleName === 'tailwind'
  const shadcnEnabled =
    frameworkName === 'react' &&
    languageName === 'typescript' &&
    isTailwind

  return {
    framework: frameworkName,
    language: languageName,
    packageManager: String(packageManager).toLowerCase(),
    browsers: response.browser.map((browser: string) => browser.toLowerCase()),
    extensionType: String(response.extension.type.name).toLowerCase(),
    optionsMode: String(response.extension.options).toLowerCase(),
    overrideMode: String(response.extension.override).toLowerCase(),
    featureFlags: {
      lintFormat: Boolean(lintFormat),
      tests: Boolean(tests),
      git: Boolean(git),
      gitHooks: Boolean(gitHooks),
      changesets: Boolean(changesets),
      commitLint: Boolean(commitLint),
    },
    style: {
      framework: styleName,
      isTailwind,
      ui: shadcnEnabled
        ? {
            provider: 'shadcn',
            shadcn: {
              base: (shadcn?.base as ShadcnBase | undefined) ?? 'radix',
              preset: (shadcn?.preset as ShadcnPreset | undefined) ?? 'nova',
              cssVariables: Boolean(shadcn?.cssVariables ?? true),
              rtl: Boolean(shadcn?.rtl ?? false),
            },
          }
        : {
            provider: 'none',
          },
    },
  }
}

export function isReactTsScaffold(spec: ScaffoldSpec): boolean {
  return spec.framework === 'react' && spec.language === 'typescript'
}
