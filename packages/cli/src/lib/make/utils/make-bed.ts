import type { Browser } from '@bedframe/core'
import { execa } from 'execa'
import { bold, dim, lightGray, green as lightGreen } from 'kolorist'
import Listr, { type ListrTask } from 'listr'
import { promises as fs } from 'node:fs'
import path, { basename } from 'node:path'
import url from 'node:url'
import type { PromptsResponse } from '../prompts'
import { copyFolder } from './copy-folder'
import { getAssetsDir } from './degit-assets-dir'
import { installDependencies } from './install-deps'
import { ensureDir } from './utils.fs'
import { writeBedframeConfig } from './write-bedframe-config'
import { writeManifests } from './write-manifests'
import { writeMVPworkflow } from './write-mvp-workflow'
import { writePackageJson } from './write-package-json'
import { writeReadMe } from './write-readme'
import { writeServiceWorker } from './write-service-worker'
import { writeTsConfig } from './write-tsconfig'
import { writeViteConfig } from './write-vite-config'
import { writeEslintConfig } from './write-eslint-config'

export async function makeBed(response: PromptsResponse) {
  const { browser } = response
  const { name: projectName, path: projectPath } = response.extension.name
  const { language, lintFormat, tests, git, gitHooks, changesets } =
    response.development.template.config
  const { installDeps } = response.development.config

  const {
    override: overridePage,
    options: optionsPage,
    type,
  } = response.extension
  const { name: extensionType } = type

  if (projectPath) {
    try {
      ensureDir(projectPath).catch(console.error)
      // execa('cd', [`${projectPath}`]).catch(console.error)

      const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
      const stubsPath = path.resolve(path.join(__dirname, 'stubs'))

      const stubs = {
        base: path.join(stubsPath, 'base'),
        misc: {
          viteClientTypes: path.join(stubsPath, 'misc'),
        },
        pages: {
          main: path.join(stubsPath, 'pages', 'main.html'),
          devtools: path.join(stubsPath, 'pages', 'devtools.html'),
          devtoolsPanel: path.join(stubsPath, 'pages', 'devtools-panel.html'),
          sidepanelWelcome: path.join(
            stubsPath,
            'pages',
            'sidepanel-welcome.html',
          ),
          sidepanelMain: path.join(stubsPath, 'pages', 'sidepanel-main.html'),
          options: path.join(stubsPath, 'pages', 'options.html'),
          newtab: path.join(stubsPath, 'pages', 'newtab.html'),
          history: path.join(stubsPath, 'pages', 'history.html'),
          bookmarks: path.join(stubsPath, 'pages', 'bookmarks.html'),
        },
        messages: path.join(stubsPath, 'messages'),
        tsconfig: path.join(stubsPath, 'tsconfig'),
        style: {
          base: path.join(stubsPath, 'style', 'styles'),
          config: path.join(stubsPath, 'style', 'config'),
          shadcn: path.join(stubsPath, 'style', 'shadcn'),
        },
        scripts: path.join(stubsPath, 'scripts'),
        lintFormat: path.join(stubsPath, 'lint-format'),
        github: path.join(stubsPath, 'github'),
        gitHooks: path.join(stubsPath, 'git-hooks'),
        testConfig: path.join(stubsPath, 'test-config'),
        tests: {
          app: path.join(stubsPath, 'tests', 'app.test.tsx'),
        },
        changesets: path.join(stubsPath, 'changesets'),
        vscode: path.join(stubsPath, 'vscode'),
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
          sidepanelMain: path.join(
            stubsPath,
            'components',
            'sidepanel-main.tsx',
          ),
          sidepanelWelcome: path.join(
            stubsPath,
            'components',
            'sidepanel-welcome.tsx',
          ),
        },
      }

      const copyOverridePage = async (
        overridePage: string,
        stubSrc: string,
      ): Promise<void> => {
        const pagesDir = path.join(projectPath, 'src', 'pages')
        ensureDir(pagesDir)
          .then(() =>
            fs.copyFile(stubSrc, path.join(pagesDir, `${overridePage}.html`)),
          )
          .catch(console.error)
      }

      const getOverridePage = (
        overridePage: string,
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
      // biome-ignore lint:  @typescript-eslint/no-explicit-any
      const manifestTasksFrom = (browser: Browser[]): ListrTask<any>[] => {
        return browser.map((b, i) => {
          const isLast = b.length - 1 === i
          const leader = isLast ? '│ │ └ ○' : '│ │ ├ ○'
          return {
            title: `  ${dim(leader)} ${b.toLowerCase()}${dim('.ts')}`,
            task: () => {},
          }
        })
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
            task: async () => {
              await execa('git', ['init'], {
                cwd: projectPath,
              })
            },
          },
          {
            title: `  ${dim('├ .')}github${dim('/')}`,
            enabled: () => git,
            task: () => {
              copyFolder(stubs.github, projectPath)
              writeMVPworkflow(response)
            },
          },
          {
            title: `  ${dim('│ ├ ○')} workflows${dim('/')}`,
            enabled: () => git,
            task: () => {},
          },
          {
            title: `  ${dim('│ │ └ ○')} mvp${dim('.yml')} ${dim(
              '👈 the M V P of your B E D !',
            )}`,
            enabled: () => git,
            task: () => {},
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
            title: `  ${dim('├ ○')} src${dim('/')}`,
            task: () =>
              copyFolder(
                stubs.misc.viteClientTypes,
                path.join(projectPath, 'src'),
              ),
          },
          {
            title: `  ${dim('│ ├ ○')} _config${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ │ ├ ○')} bedframe.config${dim('.ts')}`,
            task: () => writeBedframeConfig(response),
          },
          {
            title: `  ${dim('│ │ ├ ○')} shadcn.config${dim('.ts')}`,
            task: () =>
              copyFolder(
                stubs.style.shadcn,
                path.join(projectPath, 'src', '_config'),
              ),
          },
          {
            title: `  ${dim('│ │ └ ○')} tests.config${dim('.ts')}`,
            enabled: () => tests,
            task: async () => {
              copyFolder(
                stubs.testConfig,
                path.join(projectPath, 'src', '_config'),
              )

              try {
                const testDir = path.join(projectPath, 'src', '__tests__')
                const destinationPath = path.join(testDir, 'app.test.tsx')
                ensureDir(testDir)
                  .then(() => fs.copyFile(stubs.tests.app, destinationPath))
                  .catch(console.error)
              } catch (error) {
                console.error(error)
              }
            },
          },
          {
            title: `  ${dim('│ ├ ○')} assets${dim('/')}`,
            task: () => {
              const { packageManager } = response.development.template.config
              getAssetsDir(projectPath, packageManager)
            },
          },
          {
            title: `  ${dim('│ │ └ ○')} fonts${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ │ └ ○')} icons${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ ├ ○')} components${dim('/')}`,
            task: () => {
              const componentsDir = path.join(projectPath, 'src', 'components')
              try {
                ensureDir(componentsDir)
                  .then(() => {
                    fs.copyFile(
                      stubs.components.app,
                      path.join(componentsDir, 'app.tsx'),
                    )
                    fs.copyFile(
                      stubs.components.layout,
                      path.join(componentsDir, 'layout.tsx'),
                    )
                    fs.copyFile(
                      stubs.components.intro,
                      path.join(componentsDir, 'intro.tsx'),
                    )
                    if (overridePage === 'newtab') {
                      fs.copyFile(
                        stubs.components.newtab,
                        path.join(componentsDir, 'newtab.tsx'),
                      )
                    }
                    if (overridePage === 'history') {
                      fs.copyFile(
                        stubs.components.history,
                        path.join(componentsDir, 'history.tsx'),
                      )
                    }
                    if (overridePage === 'bookmarks') {
                      fs.copyFile(
                        stubs.components.bookmarks,
                        path.join(componentsDir, 'bookmarks.tsx'),
                      )
                    }
                    if (extensionType === 'sidepanel') {
                      fs.copyFile(
                        stubs.components.sidepanelMain,
                        path.join(componentsDir, 'sidepanel-main.tsx'),
                      )
                      fs.copyFile(
                        stubs.components.sidepanelWelcome,
                        path.join(componentsDir, 'sidepanel-welcome.tsx'),
                      )
                    }
                    if (extensionType === 'devtools') {
                      fs.copyFile(
                        stubs.components.devtools,
                        path.join(componentsDir, 'devtools.tsx'),
                      )
                    }
                    if (optionsPage !== 'none') {
                      fs.copyFile(
                        stubs.components.options,
                        path.join(componentsDir, 'options.tsx'),
                      )
                    }
                  })
                  .catch(console.error)
              } catch (error) {
                console.error(error)
              }
            },
          },
          {
            title: `  ${dim('│ ├ ○')} manifests${dim('/')}`,
            task: () => writeManifests(response),
          },
          ...manifestTasksFrom(browser),
          {
            title: `  ${dim('│ ├ ○')} messages${dim('/')}`,
            enabled: () => extensionType === 'overlay',
            task: () =>
              copyFolder(
                stubs.messages,
                path.join(projectPath, 'src', 'messages'),
              ),
          },
          {
            title: `  ${dim('│ ├ ○')} pages${dim('/')}`,
            task: () => {
              const pagesDir = path.join(projectPath, 'src', 'pages')
              const componentsDir = path.join(projectPath, 'src', 'components')
              if (extensionType === 'popup' || extensionType === 'overlay') {
                ensureDir(pagesDir)
                  .then(() => {
                    fs.copyFile(
                      stubs.pages.main,
                      path.join(pagesDir, 'main.html'),
                    )
                    fs.copyFile(
                      stubs.components.main,
                      path.join(componentsDir, 'main.tsx'),
                    )
                  })
                  .catch(console.error)
              }
              if (extensionType === 'sidepanel') {
                ensureDir(pagesDir)
                  .then(() => {
                    fs.copyFile(
                      stubs.pages.sidepanelMain,
                      path.join(pagesDir, 'sidepanel-main.html'),
                    )
                    fs.copyFile(
                      stubs.pages.sidepanelWelcome,
                      path.join(pagesDir, 'sidepanel-welcome.html'),
                    )
                  })
                  .catch(console.error)
              }
              if (extensionType === 'devtools') {
                ensureDir(pagesDir)
                  .then(() => {
                    fs.copyFile(
                      stubs.pages.devtools,
                      path.join(pagesDir, 'devtools.html'),
                    )
                    fs.copyFile(
                      stubs.pages.devtoolsPanel,
                      path.join(pagesDir, 'devtools-panel.html'),
                    )
                  })
                  .catch(console.error)
              }
              if (overridePage !== 'none') {
                copyOverridePage(
                  overridePage,
                  getOverridePage(overridePage).path,
                )
              }
              if (optionsPage !== 'none') {
                ensureDir(pagesDir)
                  .then(() => {
                    fs.copyFile(
                      stubs.pages.options,
                      path.join(pagesDir, 'options.html'),
                    )
                  })
                  .catch(console.error)
              }
            },
          },
          {
            title: `  ${dim('│ ├ ○')} scripts${dim('/')}`,
            task: () => {},
          },
          {
            title: `  ${dim('│ ├ ├ ○')} service-worker${dim('.ts')}`,
            task: () => writeServiceWorker(response),
          },
          {
            title: `  ${dim('│ ├ ├ ○')} content${dim('.ts')}`,
            enabled: () => extensionType === 'overlay',
            task: () =>
              copyFolder(
                stubs.scripts,
                path.join(projectPath, 'src', 'scripts'),
              ),
          },
          {
            title: `  ${dim('│ └ ○')} styles${dim('/')}`,
            task: () => {
              copyFolder(
                stubs.style.base,
                path.join(projectPath, 'src', 'styles'),
              )
            },
          },
          {
            title: `  ${dim('├ .')}gitignore`,
            enabled: () => git,
            task: () => copyFolder(stubs.base, projectPath),
          },
          {
            title: `  ${dim('├ .')}prettierignore`,
            enabled: () => lintFormat,
            task: () => copyFolder(stubs.lintFormat, projectPath),
          },
          {
            title: `  ${dim('├ ○')} eslint.config.js`,
            enabled: () => lintFormat,
            task: () => writeEslintConfig(response),
          },
          {
            title: `  ${dim('├ ○')} components${dim('.json')}`,
            task: () => {},
          },
          {
            title: `  ${dim('├ ○')} postcss.config${dim('.ts')}`,
            task: () => {},
          },
          {
            title: `  ${dim('├ ○')} package${dim('.json')}`,
            task: () => writePackageJson(response),
          },
          {
            title: `  ${dim('├ ○')} README${dim('.md')}`,
            task: () => writeReadMe(response),
          },
          {
            title: `  ${dim('├ ○')} tailwind.config${dim('.ts')}`,
            task: () => {
              copyFolder(stubs.style.config, projectPath)
            },
          },
          {
            title: `  ${dim('├ ○')} tsconfig${dim('.json')}`,
            enabled: () => language.toLowerCase() === 'typescript',
            task: () => writeTsConfig(response),
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
          {
            title: 'Initial git commit',
            enabled: () => git,
            task: async () => {
              await execa('git', ['add', '.'], {
                cwd: projectPath,
              })
              await execa(
                'git',
                ['commit', '-am', 'feat: initial commit. make BED!'],
                {
                  cwd: projectPath,
                },
              )
            },
          },
        ],
        { concurrent: false },
      )

      await tasks.run().finally(() => {
        const { packageManager } = response.development.template.config
        const { installDeps } = response.development.config

        const browserList = browser
          .slice(0, 3)
          .map((a: Browser) => a)
          .join(',')

        const pm = packageManager.toLowerCase()
        const pmRun = pm !== 'yarn' ? `${pm} run` : pm

        console.log(`
  ${bold(dim('>_'))}  ${lightGreen('your BED is made! 🚀')}      
      
      created ${lightGreen(projectName)} at ${lightGreen(projectPath)}
      
      inside that directory, you can run several commands:

      ${dim('development:')}
        ${pmRun} dev                         ${dim(
          'start dev server for all browsers',
        )}
        ${pmRun} dev ${browser[0]}                  ${dim(
          `start dev server for ${lightGray(browser[0])}`,
        )}
        ${
          browser.length > 1
            ? `${pmRun} dev ${browserList}      ${dim(
                `start dev servers for ${lightGray(browserList)}`,
              )}`
            : browser
        }
        
      ${dim('production:')}
        ${pmRun} build                       ${dim(
          `generate prod builds for all browsers (${lightGray(
            './dist/<browser>',
          )})`,
        )}        
        ${pmRun} build ${lightGray(browser[0])}                ${dim(
          `generate prod build for ${lightGray(browser[0])} (${lightGray(
            `./dist/${lightGray(browser[0])}`,
          )})`,
        )}
        ${
          browser.length > 1
            ? `${pmRun} build ${browserList}    ${dim(
                `generate prod builds for ${lightGray(browserList)}`,
              )}`
            : browser
        }         
        
      ${dim('- - -')} 

      suggested next steps:
        ${dim('1.')} cd ${basename(projectPath)}
        ${
          !installDeps
            ? `${dim('2.')} ${pm} install`
            : `${dim('2.')} ${pmRun} dev ${browser[0]}`
        }
        ${!installDeps ? `${dim('3.')} ${pmRun} dev ${browser[0]}` : ''}
        `)
      })
    } catch (error) {
      console.error(error)
    }
  }
}
