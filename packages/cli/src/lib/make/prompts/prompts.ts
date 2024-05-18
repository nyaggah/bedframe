import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'
import {
  type AnyCase,
  type Bedframe,
  type Browser,
  type BuildTarget,
  createBedframe,
  createManifest,
} from '@bedframe/core'
import { dim, italic, red, yellow } from 'kolorist'
import prompts, { type PromptObject } from 'prompts'
import {
  browsers,
  formatTargetDir,
  frameworks,
  languages,
  packageManagers,
  stylingOptions,
} from './prompts-utils'
import type {
  BrowserPrompts,
  DevelopmentPrompts,
  ExtensionPrompts,
} from './prompts.type'

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
  name: string,
  // biome-ignore lint:  @typescript-eslint/no-explicit-any
  options: any,
): PromptObject<keyof ExtensionPrompts>[] => {
  const initialValue = {
    name: name ? name : 'bedframe-project',
    version: options.version ? options.version : '0.0.1',
  }

  if (name) {
    options.name = name
  }

  return [
    {
      type: () => (!options.name ? 'text' : null),
      name: 'name',
      message: 'Project name:',
      initial: options.name ? options.name : initialValue.name,
      hint: `— Where would you like to create your project? ${yellow(
        italic(name ? name : './bedframe-project'),
      )}`,
      format: (answer: string) => formatTargetDir(answer),
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
  const initialValue = {
    packageManager: 0,
    framework: 0,
    language: 0,
    style: 0,
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
      type: () => (!options.packageManager ? 'select' : null),
      name: 'packageManager',
      message: 'Package manager:',
      choices: packageManagers,
      initial: initialValue.packageManager,
    },
    {
      type: () => (!options.framework ? 'select' : null),
      name: 'framework',
      message: 'Framework:',
      warn: yellow('currently unavailable'),
      choices: frameworks,
      initial: initialValue.framework,
    },
    {
      type: () => (!options.language ? 'select' : null),
      name: 'language',
      message: 'Programming language:',
      warn: yellow('currently unavailable'),
      choices: languages,
      initial: initialValue.language,
    },
    {
      type: () => (!options.style ? 'select' : null),
      name: 'style',
      message: 'CSS framework:',
      choices: stylingOptions,
      initial: initialValue.style,
    },
    {
      type: () => (!options.lintFormat ? 'toggle' : null),
      name: 'lintFormat',
      message: 'Add linting & formatting:',
      initial: initialValue.lintFormat,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!options.tests ? 'toggle' : null),
      name: 'tests',
      message: 'Add unit tests:',
      initial: initialValue.tests,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!options.git ? 'toggle' : null),
      name: 'git',
      message: 'Add git',
      initial: initialValue.git,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (prev) => (prev && !options.gitHooks ? 'toggle' : null),
      name: 'gitHooks',
      message: 'Add git hooks:',
      initial: initialValue.gitHooks,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) =>
        answers.git && !options.commitLint ? 'toggle' : null,
      name: 'commitLint',
      message: 'Add commit linting:',
      initial: initialValue.commitLint,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) =>
        answers.git && !options.changesets ? 'toggle' : null,
      name: 'changesets',
      message: 'Add changesets:',
      initial: initialValue.changesets,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: () => (!options.installDeps ? 'toggle' : null),
      name: 'installDeps',
      message: 'Install dependencies:',
      initial: initialValue.installDeps,
      active: 'Yes',
      inactive: 'No',
    },
  ]
}

export async function bedframePrompts(
  projectName: string,
  // biome-ignore lint:  @typescript-eslint/no-explicit-any
  options: any,
): Promise<Bedframe> {
  projectName === undefined ? basename(cwd()) : projectName

  const browsersResponse = options.browsers
    ? options.browsers
        .toString()
        .split(',')
        .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
    : await prompts(browserPrompts(options), {
        onCancel: () => {
          console.log('cancelling...')
          process.exit()
        },
      })

  if (options.browsers) {
    const browsersArray = options.browsers
      .toString()
      .split(',')
      .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
    browsersResponse.browsers = browsersArray
  }

  const extensionResponse = await prompts(
    extensionPrompts(projectName, options),
    {
      onCancel: () => {
        console.log('cancelling...')
        process.exit()
      },
    },
  )

  if (options.name) {
    extensionResponse.name = formatTargetDir(options.name)
  }
  if (options.version) {
    extensionResponse.version = options.version
  }
  if (options.description) {
    extensionResponse.description = options.description
  }
  if (options.author) {
    const [name, email, url] = options.author.split(',')
    extensionResponse.author = {
      name: name.trim(),
      email: email.trim(),
      url: url.trim(),
    }
  }
  if (options.license) {
    extensionResponse.license = options.license
  }
  if (options.private) {
    extensionResponse.private = options.private
  }
  if (options.type) {
    extensionResponse.type = options.type
  }
  if (options.override) {
    extensionResponse.override = options.override
  }
  if (options.options) {
    extensionResponse.options = options.options
  }

  const developmentResponse = await prompts(developmentPrompts(options), {
    onCancel: () => {
      console.log('cancelling...')
      process.exit()
    },
  })

  if (options.packageManager) {
    developmentResponse.packageManager = options.packageManager
  }
  if (options.framework) {
    developmentResponse.framework = options.framework
  }
  if (options.language) {
    developmentResponse.language = options.language
  }
  if (options.style) {
    developmentResponse.style = options.style
  }
  if (options.lintFormat) {
    developmentResponse.lintFormat = options.lintFormat
  }
  if (options.tests) {
    developmentResponse.tests = options.tests
  }
  if (options.git) {
    developmentResponse.git = options.git
  }
  if (options.gitHooks) {
    developmentResponse.gitHooks = options.gitHooks
  }
  if (options.commitLint) {
    developmentResponse.commitLint = options.commitLint
  }
  if (options.changesets) {
    developmentResponse.changesets = options.changesets
  }
  if (options.installDeps) {
    developmentResponse.installDeps = options.installDeps
  }
  if (options.yes) {
    developmentResponse.yes = options.yes
  }

  // TO diddly DO: technically this isn't the bedframe... per se
  // this is our ouput from the prompts... it's not gonna take
  // the same shape as the operational bedframe within a projek!
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
  // TO diddly DO: bruuuuuh! this is a BED; not just any bed but MY BED! type me up, Joey!
  // ^^^  i think we're expecting type `PromptsResponse`

  return bedframeConfig
}
