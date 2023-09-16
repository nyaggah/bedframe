import {
  AnyCase,
  Bedframe,
  Browser,
  BuildTarget,
  createBedframe,
  createManifest,
} from '@bedframe/core'
import { dim, italic, red, yellow } from 'kolorist'
import { basename, resolve } from 'node:path'
import { cwd } from 'node:process'
import prompts, { PromptObject } from 'prompts'
import {
  browsers,
  formatTargetDir,
  frameworks,
  languages,
  packageManagers,
  stylingOptions,
} from './prompts-utils'
import {
  BrowserPrompts,
  DevelopmentPrompts,
  ExtensionPrompts,
} from './prompts.type'

export function promptInstructions(_type: string = 'multiselect'): string {
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
      // hint: `- ${yellow('[ space ]')} - select. ${yellow('[ return ]')} - submit`,
      instructions: promptInstructions('multiselect'),
    },
  ]
  // if (options.browsers) {
  //   const BrowsersArray = options.browsers
  //     .split(',')
  //     .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
  //   console.log('BrowsersArray', BrowsersArray)
  //   browsersResponse.browsers = BrowsersArray
  //   console.log('array > options.browser', options.browsers)
  //   console.log('browsersResponse.browsers', browsersResponse.browsers)
  // }
}

export const extensionPrompts = (
  name: string,
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
      // type: (name) => (name ? null : 'text'),
      type: 'text',
      name: 'name',
      message: 'Project name:',
      initial: initialValue.name,
      hint: `— Where would you like to create your project? ${yellow(
        italic(name ? name : './bedframe-project'),
      )}`,
      format: (answer: string) => formatTargetDir(answer),
    },
    {
      type: 'text',
      name: 'version',
      message: 'Project version:',
      initial: initialValue.version,
    },
    {
      type: 'text',
      name: 'description',
      message: 'Description:',
      initial: '',
    },
    {
      type: 'list',
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
      type: 'text',
      name: 'license',
      message: 'License:',
      initial: 'MIT',
    },
    {
      type: 'toggle',
      name: 'private',
      message: 'Private:',
      initial: true,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: 'select',
      name: 'type',
      message: 'Type:',
      initial: 0,
      choices: [
        {
          title: `Popup`,
          value: 'popup',
          description: dim('(default) - no user permissions needed'),
          selected: true,
        },
        {
          title: `Overlay`,
          value: 'overlay',
          description: dim('content script - needs user permissions'),
        },
        {
          title: `Side Panel`,
          value: 'sidepanel',
          description: dim(
            'requires "sidePanel" permission (for Chrome Beta 114+)',
          ),
        },
        {
          title: `DevTools`,
          value: 'devtools',
          description: dim('requires "devtools" permission'),
        },
      ],
    },
    {
      type: (prev) => (prev === 'overlay' ? 'select' : null),
      name: 'position',
      message: 'Position:',
      initial: 0,
      choices: [
        { title: `Center (default)`, value: 'center', selected: true },
        { title: `Left`, value: 'left' },
        { title: `Right`, value: 'right' },
      ],
    },
    {
      type: 'select',
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
      type: 'select',
      name: 'options',
      message: 'Options page:',
      initial: 0,
      choices: [
        {
          title: `Embedded`,
          value: 'embedded',
          description: dim(
            "options in browser-native embedded box on extension's management page",
          ),
        },
        {
          title: `Full Page`,
          value: 'full-page',
          description: dim('options displayed in a new tab'),
          selected: true,
        },
        {
          title: 'None',
          value: 'none',
          description: dim(
            'no extension options. note: consider giving users options',
          ),
          selected: true,
        },
      ],
    },
  ]
}

export const developmentPrompts = (
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
      type: 'select',
      name: 'packageManager',
      message: 'Package manager:',
      choices: packageManagers,
      initial: initialValue.packageManager,
    },
    {
      type: 'select',
      name: 'framework',
      message: 'Framework:',
      warn: yellow('currently unavailable'),
      choices: frameworks,
      initial: initialValue.framework,
    },
    {
      type: 'select',
      name: 'language',
      message: 'Programming language:',
      warn: yellow('currently unavailable'),
      choices: languages,
      initial: initialValue.language,
    },
    {
      type: 'select',
      name: 'style',
      message: 'CSS framework:',
      choices: stylingOptions,
      initial: initialValue.style,
    },
    {
      // TO diddly DO: if ts, yasiin bey lint:format
      // maybe just default to yes and don't prompt
      type: 'toggle',
      name: 'lintFormat',
      message: 'Add linting & formatting:',
      initial: initialValue.lintFormat,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: 'toggle',
      name: 'tests',
      message: 'Add unit tests:',
      initial: initialValue.tests,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: 'toggle',
      name: 'git',
      message: 'Add git',
      initial: initialValue.git,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (prev) => (prev ? 'toggle' : null),
      name: 'gitHooks',
      message: 'Add git hooks:',
      initial: initialValue.gitHooks,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) => (answers.git ? 'toggle' : null),
      name: 'commitLint',
      message: 'Add commit linting:',
      initial: initialValue.commitLint,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: (_prev, answers) => (answers.git ? 'toggle' : null),
      name: 'changesets',
      message: 'Add changesets:',
      initial: initialValue.changesets,
      active: 'Yes',
      inactive: 'No',
    },
    {
      type: 'toggle',
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
  options: any,
): Promise<Bedframe> {
  projectName === undefined ? basename(cwd()) : projectName

  let browsersResponse = options.browser
    ? options.browsers
        .toString()
        .split(',')
        .map((browser: AnyCase<Browser>) => browser.trim().toLowerCase())
    : await prompts(browserPrompts(options), {
        // onSubmit: (_prompt, answer, _answers) => console.log('browsers:', answer),
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

  let extensionResponse = await prompts(
    extensionPrompts(projectName, options),
    {
      // onSubmit: (_prompt, answer, _answers) => console.log('Work:', answer),
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
    extensionResponse.author = options.author
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
  if (options.type === 'overlay' && options.position) {
    extensionResponse.position = options.position
  }
  if (options.override) {
    extensionResponse.override = options.override
  }
  if (options.options) {
    extensionResponse.options = options.options
  }

  let developmentResponse = await prompts(developmentPrompts(options), {
    onCancel: () => {
      console.log('cancelling...')
      process.exit()
    },
  })

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
  // this is out ouput from the prompts... it's not gonna take
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
              name: extensionResponse.name.name, // ??
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
        position: extensionResponse.position, // if position === 'overlay'
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
  } as any)
  // TO diddly DO: bruuuuuh! this is a BED; not just any bed but MY BED! type me up, Joey!
  // ^^^  i think we're expecting type `PromptsResponse`

  return bedframeConfig
}
