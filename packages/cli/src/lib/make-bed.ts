import { execa } from 'execa'
import fs from 'fs-extra'
import { dim, green } from 'kolorist'
import Listr from 'listr'
import path, { basename } from 'node:path'
import { chdir } from 'node:process'
import url from 'node:url'
import { copyFolder } from './copy-folder'
import { initializeGitProject } from './initialize-git'
import { installDependencies } from './install-deps'
import { PromptsResponse } from './prompts'
import { writeBedframeConfig } from './write-bedframe-config'
import { writeManifests } from './write-manifests'
import { writePackageJson } from './write-package-json'
import { writeServiceWorker } from './write-service-worker'
import { writeSidePanels } from './write-sidepanels'
import { writeViteConfig } from './write-vite-config'
import { Style } from '@bedframe/core'

export async function makeBed(response: PromptsResponse) {
  const projectPath = response.extension.name.path

  const destination = {
    root: path.resolve(response.extension.name.path),
  }

  const { tests: hasTests, style } = response.development.template.config
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType /* position */ } = type
  const styledComponents = style === 'Styled Components'
  const tailwindComponents = style === 'Tailwind'

  if (projectPath) {
    try {
      fs.ensureDir(projectPath).catch(console.error)
      execa('cd', [`${projectPath}`]).catch(console.error)

      const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
      const stubsPath = path.resolve(path.join(__dirname, 'stubs'))

      const stubs = {
        base: path.join(stubsPath, 'base'),
        public: path.join(stubsPath, 'public'),
        pages: {
          popup: path.join(stubsPath, 'pages', 'popup'),
          newtab: path.join(stubsPath, 'pages', 'newtab'),
          options: path.join(stubsPath, 'pages', 'options'),
          history: path.join(stubsPath, 'pages', 'history'),
          devtools: path.join(stubsPath, 'pages', 'devtools'),
          bookmarks: path.join(stubsPath, 'pages', 'bookmarks'),
        },
        sidepanels: path.join(stubsPath, 'sidepanels'),
        tsconfig: path.join(stubsPath, 'tsconfig'),
        style: {
          styledComponents: path.join(stubsPath, 'style', 'styled-components'),
          tailwind: path.join(stubsPath, 'style', 'tailwind'),
        },
        scripts: path.join(stubsPath, 'scripts'),
        lintFormat: path.join(stubsPath, 'lint-format'),
        github: path.join(stubsPath, 'github'),
        gitHooks: path.join(stubsPath, 'git-hooks'),
        tests: path.join(stubsPath, 'tests'),
        changesets: path.join(stubsPath, 'changesets'),
        vscode: path.join(stubsPath, 'vscode'),
        components: (style: Style) => {
          return {
            app: path.join(
              stubsPath,
              'components',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'App'
            ),
            iframe: path.join(
              stubsPath,
              'components',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'Iframe'
            ),
            intro: path.join(
              stubsPath,
              'components',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'Intro'
            ),
            layout: path.join(
              stubsPath,
              'components',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'Layout'
            ),
          }
        },
      }

      const copyOverridePage = async (
        overridePage: string,
        stubSrc: string
      ): Promise<void> => {
        await copyFolder(
          stubSrc,
          path.join(destination.root, 'src', 'pages', overridePage)
        )
      }

      const getOverridePage = (overridePage: string): string => {
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

      const tasks = new Listr([
        {
          title: 'Creating package.json...',
          task: () => writePackageJson(response),
        },
        {
          title: 'Creating vite.config.ts...',
          task: () => writeViteConfig(response),
        },
        {
          title: 'Creating manifests...',
          task: () => writeManifests(response),
        },
        {
          title: 'Creating public assets (icons, custom fonts, etc)...',
          task: () =>
            copyFolder(stubs.public, path.join(destination.root, 'public')),
        },
        {
          title: 'Creating base project...',
          task: () => copyFolder(stubs.base, destination.root),
        },
        {
          title: 'Creating project components...',
          task: () => {
            const component = stubs.components(style)
            copyFolder(
              component.app,
              path.join(destination.root, 'src', 'components', 'App')
            )
            copyFolder(
              component.intro,
              path.join(destination.root, 'src', 'components', 'Intro')
            )
            copyFolder(
              component.layout,
              path.join(destination.root, 'src', 'components', 'Layout')
            )
            extensionType === 'overlay'
              ? copyFolder(
                  component.iframe,
                  path.join(destination.root, 'src', 'components', 'Iframe')
                )
              : Promise.resolve()
          },
        },
        {
          title: 'Creating extension popup...',
          enabled: () => extensionType === 'popup',
          task: () =>
            copyFolder(
              stubs.pages.popup,
              path.join(destination.root, 'src', 'pages', 'popup')
            ),
        },
        {
          title: 'Creating extension side panels...',
          enabled: () => extensionType === 'sidepanel',
          task: () => writeSidePanels(response),
        },
        {
          title: 'Creating extension devtools panels...',
          enabled: () => extensionType === 'devtools',
          task: () =>
            copyFolder(
              stubs.pages.devtools,
              path.join(destination.root, 'src', 'pages', 'devtools')
            ),
        },
        {
          title: 'Creating options page...',
          enabled: () =>
            optionsPage === 'full-page' || optionsPage === 'embedded',
          task: () =>
            copyFolder(
              stubs.pages.options,
              path.join(destination.root, 'src', 'pages', 'options')
            ),
        },
        {
          title: 'Creating override page...',
          enabled: () => overridePage !== 'none',
          task: () =>
            copyOverridePage(overridePage, getOverridePage(overridePage)),
        },
        {
          title: 'Creating content script...',
          enabled: () => extensionType === 'overlay',
          task: () =>
            copyFolder(
              stubs.scripts,
              path.join(destination.root, 'src', 'scripts')
            ),
        },
        {
          title: 'Creating service worker (background script)...',
          task: () => writeServiceWorker(response),
        },
        {
          title: 'Creating project Typescript configurations...',
          enabled: () =>
            response.development.template.config.language === 'TypeScript',
          task: () => copyFolder(stubs.tsconfig, destination.root),
        },
        {
          title: 'Creating style (w/ Tailwind CSS) configurations...',
          enabled: () =>
            response.development.template.config.style === 'Tailwind',
          task: () => copyFolder(stubs.style.tailwind, destination.root),
        },
        {
          title: 'Creating style (w/ Styled Components) configurations...',
          enabled: () =>
            response.development.template.config.style === 'Styled Components',
          task: () =>
            copyFolder(
              stubs.style.styledComponents,
              path.join(destination.root, 'src')
            ),
        },
        {
          title:
            'Creating lint & format (w/ ESLint + Prettier) configurations...',
          enabled: () =>
            response.development.template.config.lintFormat ||
            response.language === 'TypeScript',
          task: () => copyFolder(stubs.lintFormat, destination.root),
        },
        {
          title: 'Creating unit test (w/ Vitest) configurations...',
          enabled: () => hasTests,
          task: () =>
            copyFolder(stubs.tests, path.join(destination.root, 'src')),
        },
        {
          title: 'Creating git (w/ Github) workflows...',
          enabled: () => response.development.template.config.git,
          task: () => copyFolder(stubs.github, destination.root),
        },
        {
          title: 'Creating git hooks (w/ Husky) configurations...',
          enabled: () => response.development.template.config.gitHooks,
          task: () => copyFolder(stubs.gitHooks, destination.root),
        },
        {
          title:
            'Creating project versioning + changelog (w/ Changesets) configurations...',
          enabled: () => response.development.template.config.changesets,
          task: () => copyFolder(stubs.changesets, destination.root),
        },
        {
          title: 'Installing dependencies...',
          enabled: () => response.development.config.installDeps,
          task: async () => await installDependencies(response),
        },
      ])

      await tasks.run().finally(() => {
        const { packageManager } = response.development.template.config
        const { installDeps } = response.development.config

        console.log(`
    >_
        
    ${green('Your BED is made! 🚀')}

    ${dim('1.')} cd ${basename(projectPath)}
    ${
      !installDeps
        ? `${dim('2.')} ${packageManager.toLowerCase()} ${
            packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
          }`
        : ``
    }${dim(
          installDeps ? `2.` : `3.`
        )} ${packageManager.toLowerCase()} dev ${dim(
          `or ${packageManager.toLowerCase()} dev:all`
        )}
        `)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
