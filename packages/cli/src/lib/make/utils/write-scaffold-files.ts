import { promises as fs } from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { execa } from 'execa'
import { isReactTsScaffold, resolveScaffoldSpec } from '../features/scaffold-spec'
import type { PromptsResponse } from '../prompts'
import {
  codemodPackageJson,
  codemodTsconfigFiles,
  codemodViteConfig,
} from './codemod-upstream-files'
import { copyFolder } from './copy-folder'
import { getAssetsDir } from './degit-assets-dir'
import { ensureDir } from './utils.fs'
import { installProjectSkills, writeAgentContract } from './write-agent-contract'
import { writeBedframeConfig } from './write-bedframe-config'
import { writeLefthookYml } from './write-lefhook'
import { writeManifests } from './write-manifests'
import { writeMVPworkflow } from './write-mvp-workflow'
import { writeReadMe } from './write-readme'
import { writeServiceWorker } from './write-service-worker'

type Stubs = {
  misc: { viteClientTypes: string }
  pages: Record<string, string>
  messages: string
  scripts: string
  lintFormat: string
  github: string
  changesets: string
  testConfig: string
  tests: { app: string }
  components: Record<string, string>
}

function getStubsPath(): string {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  return path.resolve(path.join(__dirname, 'stubs'))
}

function getStubs(): Stubs {
  const stubsPath = getStubsPath()
  return {
    misc: {
      viteClientTypes: path.join(stubsPath, 'misc'),
    },
    pages: {
      main: path.join(stubsPath, 'pages', 'main.html'),
      devtools: path.join(stubsPath, 'pages', 'devtools.html'),
      devtoolsPanel: path.join(stubsPath, 'pages', 'devtools-panel.html'),
      sidepanelWelcome: path.join(stubsPath, 'pages', 'sidepanel-welcome.html'),
      sidepanelMain: path.join(stubsPath, 'pages', 'sidepanel-main.html'),
      options: path.join(stubsPath, 'pages', 'options.html'),
      newtab: path.join(stubsPath, 'pages', 'newtab.html'),
      history: path.join(stubsPath, 'pages', 'history.html'),
      bookmarks: path.join(stubsPath, 'pages', 'bookmarks.html'),
    },
    messages: path.join(stubsPath, 'messages'),
    scripts: path.join(stubsPath, 'scripts'),
    lintFormat: path.join(stubsPath, 'lint-format'),
    github: path.join(stubsPath, 'github'),
    changesets: path.join(stubsPath, 'changesets'),
    testConfig: path.join(stubsPath, 'test-config'),
    tests: {
      app: path.join(stubsPath, 'tests', 'app.test.tsx'),
    },
    components: {
      app: path.join(stubsPath, 'components', 'app.tsx'),
      bookmarks: path.join(stubsPath, 'components', 'bookmarks.tsx'),
      devtools: path.join(stubsPath, 'components', 'devtools.tsx'),
      history: path.join(stubsPath, 'components', 'history.tsx'),
      intro: path.join(stubsPath, 'components', 'intro.tsx'),
      layout: path.join(stubsPath, 'components', 'layout.tsx'),
      main: path.join(stubsPath, 'components', 'main.tsx'),
      newtab: path.join(stubsPath, 'components', 'newtab.tsx'),
      options: path.join(stubsPath, 'components', 'options.tsx'),
      pageRoot: path.join(stubsPath, 'components', 'page-root.tsx'),
      sidepanelMain: path.join(stubsPath, 'components', 'sidepanel-main.tsx'),
      sidepanelWelcome: path.join(stubsPath, 'components', 'sidepanel-welcome.tsx'),
      themeProvider: path.join(stubsPath, 'components', 'theme-provider.tsx'),
    },
  }
}

function overridePagePath(overridePage: string, stubs: Stubs): string {
  switch (overridePage) {
    case 'history':
      return stubs.pages.history
    case 'newtab':
      return stubs.pages.newtab
    case 'bookmarks':
      return stubs.pages.bookmarks
    default:
      return ''
  }
}

async function cleanupViteStarterFiles(projectPath: string): Promise<void> {
  const candidates = [
    path.join(projectPath, 'src', 'assets', 'react.svg'),
    path.join(projectPath, 'public', 'vite.svg'),
    path.join(projectPath, 'eslint.config.js'),
    path.join(projectPath, 'eslint.config.mjs'),
  ]

  for (const filePath of candidates) {
    await fs.rm(filePath, { force: true, recursive: true })
  }
}

async function initGitRepo(projectPath: string): Promise<void> {
  await execa('git', ['init'], { cwd: projectPath })
}

async function installLefthook(projectPath: string): Promise<void> {
  await execa('lefthook', ['install'], {
    cwd: projectPath,
    preferLocal: true,
  })
}

async function resolveMainEntry(projectPath: string): Promise<string> {
  const candidates = ['main.tsx', 'main.ts', 'main.jsx', 'main.js']
  for (const candidate of candidates) {
    const candidatePath = path.join(projectPath, 'src', candidate)
    try {
      await fs.access(candidatePath)
      return candidate
    } catch {
      // keep checking
    }
  }
  return 'main.ts'
}

async function starterHtmlTemplate(
  projectPath: string,
  title: string,
): Promise<string> {
  const indexPath = path.join(projectPath, 'index.html')
  const mainEntry = await resolveMainEntry(projectPath)

  let html = ''
  try {
    html = await fs.readFile(indexPath, 'utf8')
  } catch {
    html = `<!doctype html>
<html>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${title}</title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
`
  }

  if (/<title>[\s\S]*<\/title>/.test(html)) {
    html = html.replace(/<title>[\s\S]*<\/title>/, `<title>${title}</title>`)
  } else {
    html = html.replace('</head>', `  <title>${title}</title>\n</head>`)
  }

  const relMain = `../${mainEntry}`
  if (/src=["']\/?src\/main\.[^"']+["']/.test(html)) {
    html = html.replace(/src=["']\/?src\/main\.[^"']+["']/, `src="${relMain}"`)
  } else if (/src=["']\.\/src\/main\.[^"']+["']/.test(html)) {
    html = html.replace(/src=["']\.\/src\/main\.[^"']+["']/, `src="${relMain}"`)
  } else if (!/src=["']\.\.\/main\.[^"']+["']/.test(html)) {
    html = html.replace(
      '</body>',
      `    <script type="module" src="${relMain}"></script>\n  </body>`,
    )
  }

  return html
}

async function writePageFromStarter(
  projectPath: string,
  fileName: string,
  title: string,
): Promise<void> {
  const pagesDir = path.join(projectPath, 'src', 'pages')
  await ensureDir(pagesDir)
  const pagePath = path.join(pagesDir, fileName)
  const html = await starterHtmlTemplate(projectPath, title)
  await fs.writeFile(pagePath, `${html.replace(/\n+$/, '')}\n`)
}

async function ensureJsScaffoldTsconfig(projectPath: string): Promise<void> {
  const tsconfigPath = path.join(projectPath, 'tsconfig.json')
  const tsconfigAppPath = path.join(projectPath, 'tsconfig.app.json')
  const tsconfigNodePath = path.join(projectPath, 'tsconfig.node.json')

  try {
    await fs.access(tsconfigPath)
  } catch {
    await fs.writeFile(
      tsconfigPath,
      `${JSON.stringify(
        {
          extends: './tsconfig.app.json',
        },
        null,
        2,
      )}\n`,
    )
  }

  try {
    await fs.access(tsconfigAppPath)
  } catch {
    await fs.writeFile(
      tsconfigAppPath,
      `${JSON.stringify(
        {
          compilerOptions: {
            target: 'ES2020',
            module: 'ESNext',
            moduleResolution: 'Bundler',
            allowJs: true,
            checkJs: false,
            jsx: 'react-jsx',
            baseUrl: '.',
            paths: {
              '@/*': ['./src/*'],
            },
          },
          include: ['src'],
        },
        null,
        2,
      )}\n`,
    )
  }

  try {
    await fs.access(tsconfigNodePath)
  } catch {
    await fs.writeFile(
      tsconfigNodePath,
      `${JSON.stringify(
        {
          compilerOptions: {
            module: 'ESNext',
            moduleResolution: 'Bundler',
            allowJs: true,
            checkJs: false,
          },
          include: ['vite.config.js'],
        },
        null,
        2,
      )}\n`,
    )
  }
}

async function writeNonReactScaffoldFiles(
  response: PromptsResponse,
  stubs: Stubs,
): Promise<void> {
  const { path: projectPath } = response.extension.name
  const { installDeps } = response.development.config
  const {
    language,
    lintFormat,
    git,
    gitHooks,
    changesets,
    packageManager,
  } = response.development.template.config
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  if (git) {
    await initGitRepo(projectPath)
    await copyFolder(stubs.github, projectPath)
    await writeMVPworkflow(response)
  }

  if (changesets && !installDeps) {
    await copyFolder(stubs.changesets, projectPath)
  }

  if (gitHooks) {
    await writeLefthookYml(response)
  }

  await writeAgentContract(response)
  await installProjectSkills(response)
  await copyFolder(stubs.misc.viteClientTypes, path.join(projectPath, 'src'))
  await writeBedframeConfig(response)
  await getAssetsDir(projectPath, packageManager)
  await writeManifests(response)

  if (extensionType === 'popup' || extensionType === 'overlay') {
    await writePageFromStarter(projectPath, 'main.html', 'Main Page')
  }
  if (extensionType === 'sidepanel') {
    await writePageFromStarter(projectPath, 'sidepanel-main.html', 'Sidepanel Main')
    await writePageFromStarter(
      projectPath,
      'sidepanel-welcome.html',
      'Sidepanel Welcome',
    )
  }
  if (extensionType === 'devtools') {
    await writePageFromStarter(projectPath, 'devtools.html', 'DevTools')
    await writePageFromStarter(projectPath, 'devtools-panel.html', 'DevTools Panel')
  }
  if (overridePage !== 'none') {
    await writePageFromStarter(
      projectPath,
      `${overridePage}.html`,
      `${overridePage} Page`,
    )
  }
  if (optionsPage !== 'none') {
    await writePageFromStarter(projectPath, 'options.html', 'Options')
  }

  await writeServiceWorker(response)
  if (extensionType === 'overlay') {
    await copyFolder(stubs.messages, path.join(projectPath, 'src', 'messages'))
    await copyFolder(stubs.scripts, path.join(projectPath, 'src', 'scripts'))
  }

  if (lintFormat) {
    await copyFolder(stubs.lintFormat, projectPath)
  }

  await codemodPackageJson(response)
  await writeReadMe(response)
  if (language.toLowerCase() === 'typescript') {
    await codemodTsconfigFiles(response)
  } else {
    await ensureJsScaffoldTsconfig(projectPath)
  }
  await codemodViteConfig(response)

  if (gitHooks && installDeps) {
    await installLefthook(projectPath)
  }
}

export async function writeScaffoldFiles(
  response: PromptsResponse,
): Promise<void> {
  const spec = resolveScaffoldSpec(response)
  const stubs = getStubs()
  if (!isReactTsScaffold(spec)) {
    await writeNonReactScaffoldFiles(response, stubs)
    return
  }
  const { path: projectPath } = response.extension.name
  const { installDeps } = response.development.config
  const {
    language,
    lintFormat,
    tests,
    git,
    gitHooks,
    changesets,
    packageManager,
  } = response.development.template.config
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  await cleanupViteStarterFiles(projectPath)

  if (git) {
    await initGitRepo(projectPath)
    await copyFolder(stubs.github, projectPath)
    await writeMVPworkflow(response)
  }

  if (changesets && !installDeps) {
    await copyFolder(stubs.changesets, projectPath)
  }

  if (gitHooks) {
    await writeLefthookYml(response)
  }

  await writeAgentContract(response)
  await installProjectSkills(response)

  await copyFolder(stubs.misc.viteClientTypes, path.join(projectPath, 'src'))
  await writeBedframeConfig(response)

  if (tests) {
    await copyFolder(stubs.testConfig, path.join(projectPath, 'src', '_config'))
    const testDir = path.join(projectPath, 'src', '__tests__')
    await ensureDir(testDir)
    await fs.copyFile(stubs.tests.app, path.join(testDir, 'app.test.tsx'))
  }

  await getAssetsDir(projectPath, packageManager)

  const componentsDir = path.join(projectPath, 'src', 'components')
  await ensureDir(componentsDir)
  await Promise.all([
    fs.copyFile(stubs.components.app, path.join(componentsDir, 'app.tsx')),
    fs.copyFile(stubs.components.layout, path.join(componentsDir, 'layout.tsx')),
    fs.copyFile(stubs.components.intro, path.join(componentsDir, 'intro.tsx')),
    fs.copyFile(stubs.components.pageRoot, path.join(componentsDir, 'page-root.tsx')),
  ])

  const themeProviderPath = path.join(componentsDir, 'theme-provider.tsx')
  try {
    await fs.access(themeProviderPath)
  } catch {
    await fs.copyFile(stubs.components.themeProvider, themeProviderPath)
  }

  if (overridePage === 'newtab') {
    await fs.copyFile(stubs.components.newtab, path.join(componentsDir, 'newtab.tsx'))
  }
  if (overridePage === 'history') {
    await fs.copyFile(stubs.components.history, path.join(componentsDir, 'history.tsx'))
  }
  if (overridePage === 'bookmarks') {
    await fs.copyFile(stubs.components.bookmarks, path.join(componentsDir, 'bookmarks.tsx'))
  }
  if (extensionType === 'sidepanel') {
    await Promise.all([
      fs.copyFile(
        stubs.components.sidepanelMain,
        path.join(componentsDir, 'sidepanel-main.tsx'),
      ),
      fs.copyFile(
        stubs.components.sidepanelWelcome,
        path.join(componentsDir, 'sidepanel-welcome.tsx'),
      ),
    ])
  }
  if (extensionType === 'devtools') {
    await fs.copyFile(stubs.components.devtools, path.join(componentsDir, 'devtools.tsx'))
  }
  if (optionsPage !== 'none') {
    await fs.copyFile(stubs.components.options, path.join(componentsDir, 'options.tsx'))
  }

  await writeManifests(response)

  if (extensionType === 'overlay') {
    await copyFolder(stubs.messages, path.join(projectPath, 'src', 'messages'))
  }

  const pagesDir = path.join(projectPath, 'src', 'pages')
  await ensureDir(pagesDir)
  if (extensionType === 'popup' || extensionType === 'overlay') {
    await Promise.all([
      fs.copyFile(stubs.pages.main, path.join(pagesDir, 'main.html')),
      fs.copyFile(stubs.components.main, path.join(componentsDir, 'main.tsx')),
    ])
  }
  if (extensionType === 'sidepanel') {
    await Promise.all([
      fs.copyFile(stubs.pages.sidepanelMain, path.join(pagesDir, 'sidepanel-main.html')),
      fs.copyFile(
        stubs.pages.sidepanelWelcome,
        path.join(pagesDir, 'sidepanel-welcome.html'),
      ),
    ])
  }
  if (extensionType === 'devtools') {
    await Promise.all([
      fs.copyFile(stubs.pages.devtools, path.join(pagesDir, 'devtools.html')),
      fs.copyFile(stubs.pages.devtoolsPanel, path.join(pagesDir, 'devtools-panel.html')),
    ])
  }
  if (overridePage !== 'none') {
    const overridePath = overridePagePath(overridePage, stubs)
    if (overridePath) {
      await fs.copyFile(overridePath, path.join(pagesDir, `${overridePage}.html`))
    }
  }
  if (optionsPage !== 'none') {
    await fs.copyFile(stubs.pages.options, path.join(pagesDir, 'options.html'))
  }

  await writeServiceWorker(response)
  if (extensionType === 'overlay') {
    await copyFolder(stubs.scripts, path.join(projectPath, 'src', 'scripts'))
  }

  if (lintFormat) {
    await copyFolder(stubs.lintFormat, projectPath)
  }

  await codemodPackageJson(response)
  await writeReadMe(response)
  if (language.toLowerCase() === 'typescript') {
    await codemodTsconfigFiles(response)
  }
  await codemodViteConfig(response)

  if (gitHooks && installDeps) {
    await installLefthook(projectPath)
  }
}
