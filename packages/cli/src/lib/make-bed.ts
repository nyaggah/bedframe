import { Style } from '@bedframe/core'
import { execa } from 'execa'
import fs from 'fs-extra'
import {
  bold,
  dim,
  green,
  lightCyan,
  lightGreen,
  lightMagenta,
  lightYellow,
} from 'kolorist'
import Listr from 'listr'
import path, { basename } from 'node:path'
import url from 'node:url'
import { copyFolder } from './copy-folder'
import { installDependencies } from './install-deps'
import { PromptsResponse } from './prompts'
import { writeManifests } from './write-manifests'
import { writePackageJson } from './write-package-json'
import { writeServiceWorker } from './write-service-worker'
import { writeSidePanels } from './write-sidepanels'
import { writeViteConfig } from './write-vite-config'
import { writeBedframeConfig } from './write-bedframe-config'

export async function makeBed(response: PromptsResponse) {
  const { name: projectName, path: projectPath } = response.extension.name
  const { tests: hasTests, style } = response.development.template.config
  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType /* position */ } = type

  const destination = {
    root: path.resolve(projectPath),
  }

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

      const getOverridePage = (
        overridePage: string
      ): {
        name: string
        path: string
      } => {
        switch (overridePage) {
          case 'history':
            return { name: 'history', path: stubs.pages.history }
          case 'newtab':
            return { name: 'newtab', path: stubs.pages.newtab }
          case 'bookmarks':
            return { name: 'bookmarks', path: stubs.pages.bookmarks }
          default:
            return { name: '', path: '' }
        }
      }

      const tasks = new Listr(
        [
          {
            title: `${dim('>_')}${projectName}`,
            task: () => {},
          },
          {
            title: `  ${dim('├ .')}github`,
            enabled: () => response.development.template.config.git,
            task: () => copyFolder(stubs.github, destination.root),
          },
          {
            title: `  ${dim('├ .')}changeset`,
            enabled: () => response.development.template.config.changesets,
            task: () => copyFolder(stubs.changesets, destination.root),
          },
          {
            title: `  ${dim('├ .')}husky`,
            enabled: () => response.development.template.config.gitHooks,
            task: () => copyFolder(stubs.gitHooks, destination.root),
          },
          {
            title: `  ${dim('└ ○')} src`,
            task: () => {},
          },
          {
            title: `    ${dim('├ ○')} assets`,
            task: () =>
              copyFolder(stubs.public, path.join(destination.root, 'public')),
          },
          {
            title: `    ${dim('├ ○')} components`,
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
            title: `    ${dim('├ ○')} manifests`,
            task: () => writeManifests(response),
          },
          {
            title: `    ${dim('├ ○')} pages`,
            enabled: () => extensionType === 'popup',
            task: () =>
              copyFolder(
                stubs.pages.popup,
                path.join(destination.root, 'src', 'pages', 'popup')
              ),
          },
          {
            title: `    ${dim('└ ○')} pages`,
            enabled: () => extensionType !== 'popup',
            task: () => {},
          },
          {
            title: `      ${dim('├ ○')} devtools`,
            enabled: () => extensionType === 'devtools',
            task: () =>
              copyFolder(
                stubs.pages.devtools,
                path.join(destination.root, 'src', 'pages', 'devtools')
              ),
          },
          {
            title: `      ${dim('├ ○')} ${getOverridePage(overridePage).name}`,
            enabled: () => overridePage !== 'none',
            task: () =>
              copyOverridePage(
                overridePage,
                getOverridePage(overridePage).path
              ),
          },
          {
            title: `      ${dim('└ ○')} options`,
            enabled: () =>
              optionsPage === 'full-page' || optionsPage === 'embedded',
            task: () =>
              copyFolder(
                stubs.pages.options,
                path.join(destination.root, 'src', 'pages', 'options')
              ),
          },
          {
            title: `    ${dim('└ ○')} scripts`,
            task: () => {},
          },
          {
            title: `      ${dim('├ ○')} background`,
            task: () => writeServiceWorker(response),
          },
          {
            title: `      ${dim('└ ○')} content`,
            enabled: () => extensionType === 'overlay',
            task: () =>
              copyFolder(
                stubs.scripts,
                path.join(destination.root, 'src', 'scripts')
              ),
          },
          {
            title: `    ${dim('├ ○')} sidepanels`,
            enabled: () => extensionType === 'sidepanel',
            task: () => writeSidePanels(response),
          },
          {
            title: `    ${dim('├ ○')} styles`,
            enabled: () =>
              response.development.template.config.style ===
              'Styled Components',
            task: () =>
              copyFolder(
                stubs.style.styledComponents,
                path.join(destination.root, 'src')
              ),
          },
          {
            title: `    ${dim('└ ○')} vitest`,
            enabled: () => hasTests,
            task: () =>
              copyFolder(stubs.tests, path.join(destination.root, 'src')),
          },
          {
            title: `  ${dim('├ .')}gitignore`,
            task: () => copyFolder(stubs.base, destination.root),
          },
          {
            title: `  ${dim('├ .')}prettierignore`,
            enabled: () =>
              response.development.template.config.lintFormat ||
              response.language === 'TypeScript',
            task: () => copyFolder(stubs.lintFormat, destination.root),
          },
          {
            title: `  ${dim('├ ○')} bedframe.config.ts`,
            task: () => writeBedframeConfig(response),
          },
          {
            title: `  ${dim('├ ○')} package.json`,
            task: () => writePackageJson(response),
          },
          {
            title: `  ${dim('├ ○')} tsconfig.json`,
            enabled: () =>
              response.development.template.config.language === 'TypeScript',
            task: () => copyFolder(stubs.tsconfig, destination.root),
          },
          {
            title: `  ${dim('├ ○')} tailwind.config.ts`,
            enabled: () =>
              response.development.template.config.style === 'Tailwind',
            task: () => copyFolder(stubs.style.tailwind, destination.root),
          },
          {
            title: `  ${dim('└ ○')} vite.config.ts`,
            task: () => writeViteConfig(response),
          },
          {
            title: 'Installing dependencies...',
            enabled: () => response.development.config.installDeps,
            task: async () => await installDependencies(response),
          },
        ],
        { concurrent: true }
      )

      await tasks.run().finally(() => {
        const { packageManager } = response.development.template.config
        const { installDeps } = response.development.config

        console.log(`
  ${bold(dim('>_'))}

    ${lightMagenta('B R O W S E R')} 
    ${lightGreen('E X T E N S I O N')} 
    ${lightCyan('D E V E L O P M E N T')}
    ${lightYellow('F R A M E W O R K')}
        
    ${green('Your BED is made! 🚀')}

    ${dim('1.')} cd ${basename(projectPath)}
    ${
      !installDeps
        ? `${dim('2.')} ${packageManager.toLowerCase()} ${
            packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
          }`
        : ''
    }
    ${dim(installDeps ? `2.` : `3.`)} ${packageManager.toLowerCase()} dev ${dim(
          `or ${packageManager.toLowerCase()} dev:for ${response.browser[0].toLowerCase()}`
        )}${dim(` or ${packageManager.toLowerCase()} build:all`)}
        `)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
