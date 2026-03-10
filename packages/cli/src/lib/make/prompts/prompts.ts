import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'
import {
  type AnyCase,
  type Bedframe,
  type Browser,
  type BuildTarget,
  createBedframe,
  createManifest,
} from '@bedframe/core/scaffold'
import { dim, italic, red, yellow } from 'kolorist'
import prompts, { type PromptObject } from 'prompts'
import type {
  BrowserPrompts,
  DevelopmentPrompts,
  ExtensionPrompts,
} from './prompts.type'
import {
  browsers,
  frameworks,
  languages,
  packageManagers,
  stylingOptions,
} from './prompts-utils'

export function promptInstructions(_type = 'multiselect'): string {
  return `
${dim('- - - - - - - - - - - - ')}
${yellow('[ ↑/↓ ]')}  ${dim(' - navigate')}
${yellow('[ ←/→ ]')}  ${dim(' - select')}
${yellow('[  A  ]')}  ${dim(' - toggle all')}
${dim('- - - - - - - - - - - -')}
${yellow('[ space ]')}${dim(' - select')}
${yellow('[ enter ]')}${dim(' - submit')} 
${dim('- - - - - - - - - - - -')}
`
}
export const browserPrompts = (
  // biome-ignore lint:  @typescript-eslint/no-explicit-any
  options: any,
): PromptObject<keyof BrowserPrompts>[] => {
  const initialValue = options.browser ? options.browser : 0

  return [
    {
      type: 'multiselect',
      name: 'browsers',
      message: 'Browser(s):',
      initial: initialValue,
      warn: red(' - Currently unavailable'),
      choices: browsers,
      min: 1,
      instructions: promptInstructions('multiselect'),
    },
  ]
}

export const extensionPrompts = (
  name: { name: string; path: string } | undefined,
  // biome-ignore lint:  @typescript-eslint/no-explicit-any
  options: any,
): PromptObject<keyof ExtensionPrompts>[] => {
  const initialValue = {
    name: 'bedframe-project',
    version: options.version ? options.version : '0.0.1',
  }

  if (name !== undefined) {
    options.name = name
  }

  return [
    {
      type: () => (!options.name ? 'text' : null),
      name: 'name',
      message: 'Project name:',
      initial: options.name ? options.name : initialValue.name,
      hint: `— Where would you like to create your project? ${yellow(
        italic(name?.path ? name.path : './bedframe-project'),
      )}`,
      format: (answer: string) => {
        if (answer === '.') {
          return {
            name: basename(cwd()),
            path: cwd(),
          }
        }
        return {
          name: basename(answer),
          path: resolve(answer),
        }
      },
    },
    {
      type: () => (!options.version ? 'text' : null),
      name: 'version',
      message: 'Project version:',
      initial: initialValue.version,
    },
    {
      type: () => (!options.description ? 'text' : null),
      name: 'description',
      message: 'Description:',
      initial: '',
    },
    {
      type: () => (!options.author ? 'list' : null),
      name: 'author',
      message: `Author ${dim('(name, email, url)')}:`,
      initial: '',
      separator: ',',
      format: (value) => {
        return {
          name: value[0] ?? '',
          email: value[1] ?? '',
          url: value[2] ?? '',
        }
      },
    },
    {
      type: () => (!options.license ? 'text' : null),
      name: 'license',
      message: 'License:',
      initial: 'MIT',
    },
    {
      type: () => (!options.private ? 'toggle' : null),
      name: 'private',
      message: 'Private:',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!options.type ? 'select' : null),
      name: 'type',
      message: 'Type:',
      initial: 0,
      choices: [
        {
          title: 'Popup',
          value: 'popup',
          description: dim('(default) - no user permissions needed'),
          selected: true,
        },
        {
          title: 'Overlay',
          value: 'overlay',
          description: dim('content script - needs user permissions'),
        },
        {
          title: 'Side Panel',
          value: 'sidepanel',
          description: dim(
            'requires "sidePanel" permission (for Chrome Beta 114+)',
          ),
        },
        {
          title: 'DevTools',
          value: 'devtools',
          description: dim('requires "devtools" permission'),
        },
      ],
    },
    {
      type: () => (!options.override ? 'select' : null),
      name: 'override',
      message: 'Override page:',
      hint: dim('you can override one of these pages'),
      choices: [
        {
          title: 'New Tab',
          value: 'newtab',
          description: dim('overrides `chrome://newtab` page'),
        },
        {
          title: 'History',
          value: 'history',
          description: dim('overrides `chrome://history` page'),
        },
        {
          title: 'Bookmarks',
          value: 'bookmarks',
          description: dim('overrides `chrome://bookmarks` page'),
        },
        {
          title: 'None',
          value: 'none',
          description: dim('no page overrides'),
          selected: true,
        },
      ],
    },
    {
      type: () => (!options.options ? 'select' : null),
      name: 'options',
      message: 'Options page:',
      initial: 0,
      choices: [
        {
          title: 'Embedded',
          value: 'embedded',
          description: dim(
            "options in browser-native embedded box on extension's management page",
          ),
          selected: true,
        },
        {
          title: 'Full Page',
          value: 'full-page',
          description: dim('options displayed in a new tab'),
        },
        {
          title: 'None',
          value: 'none',
          description: dim(
            'no extension options. note: consider giving users options',
          ),
        },
      ],
    },
  ]
}

export const developmentPrompts = (
  // biome-ignore lint:  @typescript-eslint/no-explicit-any
  options: any,
): PromptObject<keyof DevelopmentPrompts>[] => {
  const optionProvided = (key: string) =>
    Object.prototype.hasOwnProperty.call(options, key) &&
    options[key] !== undefined

  const isShadcnCompatible = (values: {
    framework?: string
    language?: string
    style?: string
  }): boolean => {
    return (
      String(values.framework ?? '').toLowerCase() === 'react' &&
      String(values.language ?? '').toLowerCase() === 'typescript' &&
      String(values.style ?? '').toLowerCase() === 'tailwind'
    )
  }

  const initialValue = {
    packageManager: 0,
    framework: 0,
    language: 0,
    style: 0,
    shadcnBase: 0,
    shadcnPreset: 0,
    shadcnCssVariables: true,
    shadcnRtl: false,
    lintFormat: true,
    tests: true,
    git: true,
    gitHooks: true,
    commitLint: true,
    changesets: true,
    installDeps: true,
  }

  return [
    {
      type: () => (!optionProvided('packageManager') ? 'select' : null),
      name: 'packageManager',
      message: 'Package manager:',
      choices: packageManagers,
      initial: initialValue.packageManager,
    },
    {
      type: () => (!optionProvided('framework') ? 'select' : null),
      name: 'framework',
      message: 'Framework:',
      warn: yellow('currently unavailable'),
      choices: frameworks,
      initial: initialValue.framework,
    },
    {
      type: () => (!optionProvided('language') ? 'select' : null),
      name: 'language',
      message: 'Programming language:',
      warn: yellow('currently unavailable'),
      choices: languages,
      initial: initialValue.language,
    },
    {
      type: () => (!optionProvided('style') ? 'select' : null),
      name: 'style',
      message: 'CSS framework:',
      choices: stylingOptions,
      initial: initialValue.style,
    },
    {
      type: (_prev, answers) =>
        !optionProvided('shadcnBase') && isShadcnCompatible(answers) ? 'select' : null,
      name: 'shadcnBase',
      message: 'shadcn base library:',
      initial: initialValue.shadcnBase,
      choices: [
        { title: 'radix', value: 'radix' },
        { title: 'base', value: 'base' },
      ],
    },
    {
      type: (_prev, answers) =>
        !optionProvided('shadcnPreset') && isShadcnCompatible(answers) ? 'select' : null,
      name: 'shadcnPreset',
      message: 'shadcn preset:',
      initial: initialValue.shadcnPreset,
      choices: [
        { title: 'nova', value: 'nova' },
        { title: 'vega', value: 'vega' },
        { title: 'maia', value: 'maia' },
        { title: 'lyra', value: 'lyra' },
        { title: 'mira', value: 'mira' },
        { title: 'custom', value: 'custom' },
      ],
    },
    {
      type: (_prev, answers) =>
        !optionProvided('shadcnCssVariables') && isShadcnCompatible(answers)
          ? 'toggle'
          : null,
      name: 'shadcnCssVariables',
      message: 'shadcn css variables:',
      initial: initialValue.shadcnCssVariables,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) =>
        !optionProvided('shadcnRtl') && isShadcnCompatible(answers) ? 'toggle' : null,
      name: 'shadcnRtl',
      message: 'shadcn RTL support:',
      initial: initialValue.shadcnRtl,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!optionProvided('lintFormat') ? 'toggle' : null),
      name: 'lintFormat',
      message: 'Add linting & formatting:',
      initial: initialValue.lintFormat,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!optionProvided('tests') ? 'toggle' : null),
      name: 'tests',
      message: 'Add unit tests:',
      initial: initialValue.tests,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!optionProvided('git') ? 'toggle' : null),
      name: 'git',
      message: 'Add git',
      initial: initialValue.git,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (prev) => (prev && !optionProvided('gitHooks') ? 'toggle' : null),
      name: 'gitHooks',
      message: 'Add git hooks:',
      initial: initialValue.gitHooks,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) =>
        answers.git && !optionProvided('commitLint') ? 'toggle' : null,
      name: 'commitLint',
      message: 'Add commit linting:',
      initial: initialValue.commitLint,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) =>
        answers.git && !optionProvided('changesets') ? 'toggle' : null,
      name: 'changesets',
      message: 'Add changesets:',
      initial: initialValue.changesets,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!optionProvided('installDeps') ? 'toggle' : null),
      name: 'installDeps',
      message: 'Install dependencies:',
      initial: initialValue.installDeps,
      active: 'Yes',
      inactive: 'No',
    },
  ]
}

export async function bedframePrompts(
  projectName: { name: string; path: string } | undefined,
  // biome-ignore lint:  @typescript-eslint/no-explicit-any
  options: any,
): Promise<Bedframe> {
  const hasOption = (key: string) =>
    Object.prototype.hasOwnProperty.call(options, key) &&
    options[key] !== undefined

  projectName === undefined
    ? {
        name: basename(cwd()),
        path: cwd(),
      }
    : projectName

  const yesMode = Boolean(options.yes)
  const parsedBrowsers = options.browsers
    ? options.browsers
        .toString()
        .split(',')
        .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
    : ['chrome']

  const browsersResponse = yesMode
    ? { browsers: parsedBrowsers }
    : options.browsers
      ? { browsers: parsedBrowsers }
      : await prompts(browserPrompts(options), {
          onCancel: () => {
            console.log('cancelling...')
            process.exit()
          },
        })

  const extensionDefaults = {
    name:
      projectName ??
      (options.name
        ? {
            name: basename(options.name.name ?? options.name),
            path: resolve(options.name.path ?? options.name),
          }
        : { name: basename(cwd()), path: cwd() }),
    version: options.version ?? '0.0.1',
    description: options.description ?? '',
    author: options.author
      ? (() => {
          const [name, email, url] = String(options.author).split(',')
          return {
            name: (name ?? '').trim(),
            email: (email ?? '').trim(),
            url: (url ?? '').trim(),
          }
        })()
      : { name: '', email: '', url: '' },
    license: options.license ?? 'MIT',
    private: hasOption('private') ? options.private : true,
    type: options.type ?? 'popup',
    override: options.override ?? 'none',
    options: options.options ?? 'embedded',
  }

  const extensionResponse = yesMode
    ? extensionDefaults
    : await prompts(extensionPrompts(projectName, options), {
        onCancel: () => {
          console.log('cancelling...')
          process.exit()
        },
      })

  if (options.name) {
    if (options.name === '.') {
      extensionResponse.name = {
        name: basename(cwd()),
        path: cwd(),
      }
    } else {
      extensionResponse.name = {
        name: basename(options.name.name),
        path: resolve(options.name.path),
      }
    }
  }
  if (hasOption('version')) {
    extensionResponse.version = options.version
  }
  if (hasOption('description')) {
    extensionResponse.description = options.description
  }
  if (hasOption('author')) {
    const [name, email, url] = options.author.split(',')
    extensionResponse.author = {
      name: name.trim(),
      email: email.trim(),
      url: url.trim(),
    }
  }
  if (hasOption('license')) {
    extensionResponse.license = options.license
  }
  if (hasOption('private')) {
    extensionResponse.private = options.private
  }
  if (hasOption('type')) {
    extensionResponse.type = options.type
  }
  if (hasOption('override')) {
    extensionResponse.override = options.override
  }
  if (hasOption('options')) {
    extensionResponse.options = options.options
  }

  const developmentDefaults = {
    packageManager: options.packageManager ?? 'pnpm',
    framework: options.framework ?? 'react',
    language: options.language ?? 'typescript',
    style: options.style ?? 'tailwind',
    shadcnBase: options.shadcnBase ?? 'radix',
    shadcnPreset: options.shadcnPreset ?? 'nova',
    shadcnCssVariables: hasOption('shadcnCssVariables')
      ? options.shadcnCssVariables
      : true,
    shadcnRtl: hasOption('shadcnRtl') ? options.shadcnRtl : false,
    lintFormat: hasOption('lintFormat') ? options.lintFormat : true,
    tests: hasOption('tests') ? options.tests : true,
    git: hasOption('git') ? options.git : true,
    gitHooks: hasOption('gitHooks') ? options.gitHooks : true,
    commitLint: hasOption('commitLint') ? options.commitLint : true,
    changesets: hasOption('changesets') ? options.changesets : true,
    installDeps: hasOption('installDeps') ? options.installDeps : true,
    yes: yesMode,
  }

  const developmentResponse = yesMode
    ? developmentDefaults
    : await prompts(developmentPrompts(options), {
        onCancel: () => {
          console.log('cancelling...')
          process.exit()
        },
      })

  if (hasOption('packageManager')) {
    developmentResponse.packageManager = options.packageManager
  }
  if (hasOption('framework')) {
    developmentResponse.framework = options.framework
  }
  if (hasOption('language')) {
    developmentResponse.language = options.language
  }
  if (hasOption('style')) {
    developmentResponse.style = options.style
  }
  if (hasOption('shadcnBase')) {
    developmentResponse.shadcnBase = options.shadcnBase
  }
  if (hasOption('shadcnPreset')) {
    developmentResponse.shadcnPreset = options.shadcnPreset
  }
  if (hasOption('shadcnCssVariables')) {
    developmentResponse.shadcnCssVariables = options.shadcnCssVariables
  }
  if (hasOption('shadcnRtl')) {
    developmentResponse.shadcnRtl = options.shadcnRtl
  }
  if (hasOption('lintFormat')) {
    developmentResponse.lintFormat = options.lintFormat
  }
  if (hasOption('tests')) {
    developmentResponse.tests = options.tests
  }
  if (hasOption('git')) {
    developmentResponse.git = options.git
  }
  if (hasOption('gitHooks')) {
    developmentResponse.gitHooks = options.gitHooks
  }
  if (hasOption('commitLint')) {
    developmentResponse.commitLint = options.commitLint
  }
  if (hasOption('changesets')) {
    developmentResponse.changesets = options.changesets
  }
  if (hasOption('installDeps')) {
    developmentResponse.installDeps = options.installDeps
  }
  if (hasOption('yes')) {
    developmentResponse.yes = options.yes
  }

  const bedframeConfig = createBedframe({
    browser: browsersResponse.browsers,
    extension: {
      name: {
        name: extensionResponse.name.name,
        path: resolve(extensionResponse.name.path),
      },
      author: {
        name: extensionResponse.author.name,
        email: extensionResponse.author.email,
        url: extensionResponse.author.url,
      },
      manifest: browsersResponse.browsers.map(
        (browser: Browser): BuildTarget => {
          return createManifest(
            {
              name: extensionResponse.name.name,
              version: extensionResponse.version,
              manifest_version: 3,
              author: extensionResponse.author?.email,
              description: extensionResponse.description,
            },
            browser,
          )
        },
      ) as BuildTarget[],
      type: {
        name: extensionResponse.type,
      },
      override: extensionResponse.override,
      options: extensionResponse.options,
      description: extensionResponse.description,
      license: extensionResponse.license,
      version: extensionResponse.version,
      isPrivate: extensionResponse.private,
    },
    development: {
      template: {
        config: {
          framework: developmentResponse.framework,
          language: developmentResponse.language,
          packageManager: developmentResponse.packageManager,
          style: developmentResponse.style,
          shadcn: {
            base: developmentResponse.shadcnBase ?? 'radix',
            preset: developmentResponse.shadcnPreset ?? 'nova',
            cssVariables: developmentResponse.shadcnCssVariables ?? true,
            rtl: developmentResponse.shadcnRtl ?? false,
          },
          lintFormat: developmentResponse.lintFormat,
          tests: developmentResponse.tests,
          git: developmentResponse.git,
          gitHooks: developmentResponse.gitHooks,
          commitLint: developmentResponse.commitLint,
          changesets: developmentResponse.changesets,
        },
      },
      config: {
        installDeps: developmentResponse.installDeps,
      },
    },
    // biome-ignore lint:  @typescript-eslint/no-explicit-any
  } as any)

  return bedframeConfig
}
