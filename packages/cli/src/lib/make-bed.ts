import { Style } from '@bedframe/core'
import { execa } from 'execa'
import fs from 'fs-extra'
import { bold, dim, green, lightGray } from 'kolorist'
import Listr from 'listr'
import path, { basename } from 'node:path'
import url from 'node:url'
import { copyFolder } from './copy-folder'
import { installDependencies } from './install-deps'
import { PromptsResponse } from './prompts'
import { writeBedframeConfig } from './write-bedframe-config'
import { writeManifests } from './write-manifests'
import { writePackageJson } from './write-package-json'
import { writeServiceWorker } from './write-service-worker'
import { writeSidePanels } from './write-sidepanels'
import { writeViteConfig } from './write-vite-config'
import { writeReadMe } from './write-readme'

export async function makeBed(response: PromptsResponse) {
  const { browser } = response
  const { name: projectName, path: projectPath } = response.extension.name
  const { language, lintFormat, style, tests, git, gitHooks, changesets } =
    response.development.template.config
  const { installDeps } = response.development.config

  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType /* position */ } = type

  if (projectPath) {
    try {
      fs.ensureDir(projectPath).catch(console.error)
      execa('cd', [`${projectPath}`]).catch(console.error)

      const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
      const stubsPath = path.resolve(path.join(__dirname, 'stubs'))

      const stubs = {
        base: path.join(stubsPath, 'base'),
        public: path.join(stubsPath, 'public'),
        pages: (style: Style) => {
          return {
            popup: path.join(
              stubsPath,
              'pages',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'popup'
            ),
            newtab: path.join(
              stubsPath,
              'pages',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'newtab'
            ),
            options: path.join(
              stubsPath,
              'pages',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'options'
            ),
            history: path.join(
              stubsPath,
              'pages',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'history'
            ),
            devtools: path.join(
              stubsPath,
              'pages',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'devtools'
            ),
            bookmarks: path.join(
              stubsPath,
              'pages',
              style === 'Styled Components' ? 'styled-components' : 'tailwind',
              'bookmarks'
            ),
          }
        },
        sidepanels: path.join(stubsPath, 'sidepanels'),
        tsconfig: path.join(stubsPath, 'tsconfig'),
        style: {
          styledComponents: path.join(stubsPath, 'style', 'styled-components'),
          tailwind: {
            base: path.join(stubsPath, 'style', 'tailwind', 'styles'),
            config: path.join(
              stubsPath,
              'style',
              'tailwind',
              'config'
              // 'tailwind.config.cjs'
            ),
            // postCss: path.join(
            //   stubsPath,
            //   'style',
            //   'tailwind',
            //   'postcss.config.cjs'
            // ),
          },
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
          path.join(projectPath, 'src', 'pages', overridePage)
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
            return { name: 'history', path: stubs.pages(style).history }
          case 'newtab':
            return { name: 'newtab', path: stubs.pages(style).newtab }
          case 'bookmarks':
            return { name: 'bookmarks', path: stubs.pages(style).bookmarks }
          default:
            return { name: '', path: '' }
        }
      }

      const tasks = new Listr(
        [
          {
            title: `${dim('>_ ')}${projectName}${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('├ .')}git${dim('/')}`,
            enabled: () => git,
            task: () => {},
          },
          {
            title: `  ${dim('├ .')}github${dim('/')}`,
            enabled: () => git,
            task: () => copyFolder(stubs.github, projectPath),
          },
          {
            title: `  ${dim('├ .')}changeset${dim('/')}`,
            enabled: () => changesets,
            task: () => copyFolder(stubs.changesets, projectPath),
          },
          {
            title: `  ${dim('├ .')}husky${dim('/')}`,
            enabled: () => gitHooks,
            task: () => copyFolder(stubs.gitHooks, projectPath),
          },
          {
            title: `  ${dim('├ ○')} public${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ ├ ○')} assets${dim('/')}`,
            task: () =>
              copyFolder(stubs.public, path.join(projectPath, 'public')),
          },
          {
            title: `  ${dim('├ ○')} src${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ ├ ○')} components${dim('/')}`,
            task: () => {
              const component = stubs.components(style)
              copyFolder(
                component.app,
                path.join(projectPath, 'src', 'components', 'App')
              )
              copyFolder(
                component.intro,
                path.join(projectPath, 'src', 'components', 'Intro')
              )
              copyFolder(
                component.layout,
                path.join(projectPath, 'src', 'components', 'Layout')
              )
              extensionType === 'overlay'
                ? copyFolder(
                    component.iframe,
                    path.join(projectPath, 'src', 'components', 'Iframe')
                  )
                : Promise.resolve()
            },
          },
          {
            title: `  ${dim('│ ├ ○')} manifests${dim('/')}`,
            task: () => writeManifests(response),
          },
          {
            title: `  ${dim('│ ├ ○')} pages${dim('/')}`,
            enabled: () => extensionType === 'popup',
            task: () =>
              copyFolder(
                stubs.pages(style).popup,
                path.join(projectPath, 'src', 'pages', 'popup')
              ),
          },
          {
            title: `  ${dim('│ ├ ○')} pages${dim('/')}`,
            enabled: () => extensionType !== 'popup',
            task: () => {},
          },
          {
            title: `  ${dim('│ │ ├ ○')} devtools${dim('/')}`,
            enabled: () => extensionType === 'devtools',
            task: () =>
              copyFolder(
                stubs.pages(style).devtools,
                path.join(projectPath, 'src', 'pages', 'devtools')
              ),
          },
          {
            title: `  ${dim('│ │ ├ ○')} ${
              getOverridePage(overridePage).name
            }${dim('/')}`,
            enabled: () => overridePage !== 'none',
            task: () =>
              copyOverridePage(
                overridePage,
                getOverridePage(overridePage).path
              ),
          },
          {
            title: `  ${dim('│ │ ├ ○')} options${dim('/')}`,
            enabled: () => optionsPage !== 'none',
            task: () =>
              copyFolder(
                stubs.pages(style).options,
                path.join(projectPath, 'src', 'pages', 'options')
              ),
          },
          {
            title: `  ${dim('│ ├ ○')} scripts${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ ├ ├ ○')} background${dim('.ts')}`,
            task: () => writeServiceWorker(response),
          },
          {
            title: `  ${dim('│ ├ ├ ○')} content${dim('.ts')}`,
            enabled: () => extensionType === 'overlay',
            task: () =>
              copyFolder(
                stubs.scripts,
                path.join(projectPath, 'src', 'scripts')
              ),
          },
          {
            title: `  ${dim('│ ├ ○')} sidepanels${dim('/')}`,
            enabled: () => extensionType === 'sidepanel',
            task: () => writeSidePanels(response),
          },
          {
            title: `  ${dim('│ ├ ○')} styles${dim('/')}`,
            enabled: () => style === 'Styled Components',
            task: () =>
              copyFolder(
                stubs.style.styledComponents,
                path.join(projectPath, 'src')
              ),
          },
          {
            title: `  ${dim('│ ├ ○')} styles${dim('/')}`,
            enabled: () => style === 'Tailwind',
            task: () =>
              copyFolder(
                stubs.style.tailwind.base,
                path.join(projectPath, 'src', 'styles')
              ),
          },
          {
            title: `  ${dim('│ └ ○')} vitest${dim('/')}`,
            enabled: () => tests,
            task: () => copyFolder(stubs.tests, path.join(projectPath, 'src')),
          },
          {
            title: `  ${dim('├ .')}gitignore`,
            enabled: () => style === git,
            task: () => copyFolder(stubs.base, projectPath),
          },
          {
            title: `  ${dim('├ .')}prettierignore`,
            // enabled: () => lintFormat || language === 'TypeScript',
            enabled: () => lintFormat,
            task: () => copyFolder(stubs.lintFormat, projectPath),
          },
          {
            title: `  ${dim('├ ○')} bedframe.config${dim('.ts')}`,
            task: () => writeBedframeConfig(response),
          },
          {
            title: `  ${dim('├ ○')} package${dim('.json')}`,
            task: () => writePackageJson(response),
          },
          {
            title: `  ${dim('├ ○')} postcss.config${dim('.ts')}`,
            enabled: () => style === 'Tailwind',
            task: () => {},
          },
          {
            title: `  ${dim('├ ○')} README${dim('.md')}`,
            task: () => writeReadMe(response),
          },
          {
            title: `  ${dim('├ ○')} tailwind.config${dim('.ts')}`,
            enabled: () => style === 'Tailwind',
            task: () => {
              copyFolder(stubs.style.tailwind.config, projectPath)
            },
          },
          {
            title: `  ${dim('├ ○')} tsconfig${dim('.json')}`,
            enabled: () => language === 'TypeScript',
            task: () => copyFolder(stubs.tsconfig, projectPath),
          },
          {
            title: `  ${dim('└ ○')} vite.config${dim('.ts')}`,
            task: () => writeViteConfig(response),
          },
          {
            title: 'Installing dependencies...',
            enabled: () => installDeps,
            task: async () => await installDependencies(response),
          },
        ],
        { concurrent: true }
      )

      await tasks.run().finally(() => {
        const { packageManager } = response.development.template.config
        const { installDeps } = response.development.config

        console.log(`
  ${bold(dim('>_'))}  ${green('Your BED is made! 🚀')}
      
      Created ${green(projectName)} at ${green(projectPath)}

      Inside that directory, you can run several commands:

      ${dim('Development:')}
        pnpm dev                ${dim('start dev server')}
        pnpm dev:all            ${dim('opa! broken right meow. so so soweeee!')}
        pnpm dev:for ${browser[0]}     ${dim(
          `start dev server for ${lightGray(browser[0])}`
        )}
        
      ${dim('Production:')}
        pnpm build
        pnpm build:all          ${dim(
          `generate prod builds for all browsers (${lightGray(
            './dist/<browser>'
          )})`
        )}        
        pnpm build:for ${lightGray(browser[0])}   ${dim(
          `generate prod build for ${lightGray(browser[0])} (${lightGray(
            `./dist/${lightGray(browser[0])}`
          )})`
        )}    
        
      ${dim('- - -')} 

      Suggested next steps:
        ${dim('1.')} cd ${basename(projectPath)}
        ${
          !installDeps
            ? `${dim('2.')} ${packageManager.toLowerCase()} ${
                packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
              }`
            : `${dim(`2.`)} ${packageManager.toLowerCase()} dev:for ${
                browser[0]
              }`
        }
        ${
          !installDeps
            ? `${dim(`3.`)} ${packageManager.toLowerCase()} dev:for ${
                browser[0]
              }`
            : ''
        }
      `)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
