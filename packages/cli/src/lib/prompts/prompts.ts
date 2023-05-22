import { yellow, dim, italic, red } from 'kolorist'
import prompts, { PromptObject } from 'prompts'
import {
  BrowserPrompts,
  DevelopmentPrompts,
  ExtensionPrompts,
} from './prompts.type'
import { Bedframe, Browser, createBedframe } from '@bedframe/core'
import {
  browsers,
  formatTargetDir,
  packageManagers,
  frameworks,
  languages,
  stylingOptions,
} from './prompts-utils'

export function promptInstructions(_type: string = 'multiselect'): string {
  return `
${yellow('[ ↑/↓ ]')}${dim(' - navigate')}${dim(' | ')}${yellow('[ ←/→ ]')}${dim(
    ' - select'
  )}${dim(' | ')}${yellow('[ A ]')} ${dim('- toggle all')}
${yellow('[ space ]')}${dim(' - select')}${dim(' | ')}${yellow(
    '[ enter ]'
  )}${dim(' - submit')} 
`
}
export const browserPrompts: PromptObject<keyof BrowserPrompts>[] = [
  {
    type: 'multiselect',
    name: 'browsers',
    message: 'Browser(s):',
    initial: 0,
    warn: red(' - Currently unavailable'),
    choices: browsers,
    min: 1,
    // hint: `- ${yellow('[ space ]')} - select. ${yellow('[ return ]')} - submit`,
    instructions: promptInstructions('multiselect'),
  },
]

export function extensionPositionPrompts(
  prev: string
): PromptObject<keyof ExtensionPrompts> {
  const choices = () => {
    if (prev === 'sidebar') {
      return [
        { title: `Left`, value: 'left' },
        { title: `Right`, value: 'right' },
      ]
    }
    if (prev === 'overlay') {
      return [
        { title: `Center`, value: 'center' },
        { title: `Left`, value: 'left' },
        { title: `Right`, value: 'right' },
      ]
    }
  }

  return {
    type: (prev) =>
      prev === 'sidebar' || prev === 'overlay' ? 'select' : null,
    name: 'position',
    message: 'Position:',
    choices: choices(),
  }
}

export const extensionPrompts = (
  name: string
): PromptObject<keyof ExtensionPrompts>[] => [
  {
    type: (name) => (name ? null : 'text'),
    name: 'name',
    message: 'Project name:',
    initial: name ? name : 'bedframe-project',
    hint: ` — Where would you like to create your project? ${yellow(
      italic('./bedframe-project')
    )}`,
    format: (answer: string) => formatTargetDir(answer),
  },
  {
    type: 'text',
    name: 'version',
    message: 'Project version:',
    initial: '0.0.1',
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
    message: 'Author (name, email, url):',
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
    message: 'Private?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: 'select',
    name: 'type',
    message: 'Type:',
    choices: [
      {
        title: `Popup`,
        value: 'popup',
        description: dim('(default) - no user permissions needed'),
      },
      {
        title: `Overlay`,
        value: 'overlay',
        description: dim('content script - needs user permissions'),
      },
      {
        title: `Side Panel`,
        value: 'sidepanel',
        description: dim('requires "sidePanel" permission (Chrome Beta 114+)'),
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
      { title: `Default (center)`, value: 'default', selected: true },
      { title: `Left (sidebar)`, value: 'left' },
      { title: `Right (sidebar)`, value: 'right' },
    ],
  },
  {
    type: 'select',
    name: 'override',
    message: 'Override Page:',
    hint: dim('you can override one of these pages'),
    choices: [
      {
        title: 'New Tab',
        value: 'new-tab',
        description: dim('overrides `chrome://newtab` page'),
      },
      {
        title: 'History',
        value: 'history',
        description: dim('overrides `chrome://history` page'),
      },
      {
        title: 'Bookmark Manager',
        value: 'bookmark-manager',
        description: dim('overrides `chrome://bookmarks` page'),
      },
    ],
  },
  {
    type: 'select',
    name: 'options',
    message: 'Options Page:',
    initial: 0,
    choices: [
      {
        title: `Full Page`,
        value: 'full-page',
        description: dim('options displayed in a new tab'),
        selected: true,
      },
      {
        title: `Embedded`,
        value: 'embedded',
        description: dim(
          'integrate options into extensions management page inside browser-native embedded box'
        ),
      },
    ],
  },
]

export const developmentPrompts: PromptObject<keyof DevelopmentPrompts>[] = [
  {
    type: 'select',
    name: 'packageManager',
    message: 'Package manager:',
    choices: packageManagers,
    initial: 0,
  },
  {
    type: 'select',
    name: 'framework',
    message: 'Framework:',
    warn: yellow(' - Currently unavailable'),
    choices: frameworks,
    initial: 0,
  },
  {
    type: 'select',
    name: 'language',
    message: 'Programming language:',
    warn: yellow(' - Currently unavailable'),
    choices: languages,
    initial: 0,
  },
  {
    type: 'select',
    name: 'style',
    message: 'CSS framework:',
    choices: stylingOptions,
    initial: 0,
  },
  {
    type: 'toggle',
    name: 'lintFormat',
    message: 'Add linting with formatting?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: 'toggle',
    name: 'tests',
    message: 'Add Unit tests?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: 'toggle',
    name: 'git',
    message: 'Add git?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: (prev) => (prev ? 'toggle' : null),
    name: 'gitHooks',
    message: 'Add git hooks?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: (_prev, answers) => (answers.git ? 'toggle' : null),
    name: 'commitLint',
    message: 'Add commit linting?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: (_prev, answers) => (answers.git ? 'toggle' : null),
    name: 'changesets',
    message: 'Add changesets?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
  {
    type: 'toggle',
    name: 'installDeps',
    message: 'Install Dependencies?',
    initial: true,
    active: 'Yes',
    inactive: 'No',
  },
]

export async function bedframePrompts(projectName: string): Promise<Bedframe> {
  const browsersResponse = await prompts(browserPrompts, {
    // onSubmit: (_prompt, answer, _answers) => console.log('browsers:', answer),
    onCancel: () => {
      console.log('Cancelling...')
      process.exit()
    },
  })

  const extensionResponse = await prompts(extensionPrompts(projectName), {
    // onSubmit: (_prompt, answer, _answers) => console.log('Work:', answer),
    onCancel: () => {
      console.log('Cancelling...')
      process.exit()
    },
  })

  const developmentResponse = await prompts(developmentPrompts, {
    onCancel: () => {
      console.log('Cancelling...')
      process.exit()
    },
  })

  const bedframeConfig = createBedframe({
    browser: browsersResponse.browsers,
    extension: {
      // path: extensionResponse.name.path,
      manifest: browsersResponse.browsers.map((browser: Browser) => {
        return {
          [browser.toLowerCase()]: {
            name: extensionResponse.name.name, // ??
            version: extensionResponse.version,
            manifest_version: 3,
            author: extensionResponse.author?.email,
            description: extensionResponse.description,
            /*
            include:
            - 
            - override pages
            options page
            */
          },
        }
      }),
      type: {
        name: extensionResponse.type,
        position: extensionResponse.position, // if position === 'overlay'
      },
      override: extensionResponse.override,
      pages: extensionResponse.pages,
    },
    development: {
      template: {
        // name: ,
        // version: ,
        // description: ,
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
    },
  } as any) // TO diddly DO: bruuuuuh! this is a BED; not just any bed but MY BED! type me up, Joey!

  console.log(`./${extensionResponse.name.path}/bedframe.config.json`)

  console.log(`
    this is your BED. 
    there are many like it
    but this one is yours!
    `)

  console.log(JSON.stringify(bedframeConfig, null, 2))

  return bedframeConfig
}

export default bedframePrompts
