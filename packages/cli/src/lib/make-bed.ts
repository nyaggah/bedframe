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

export async function makeBed(response: PromptsResponse) {
  // const projectDir = response.extension.name.name
  const projectPath = response.extension.name.path

  if (projectPath) {
    try {
      // Ensure the project directory exists
      await fs.ensureDir(projectPath).catch(console.error)

      // Change to the project directory
      await execa('cd', [`${projectPath}`]).catch(console.error)

      // Write package.json file
      // writePackageJson(response)

      // Write necessary files asynchronously
      // await Promise.all([writeManifests(response), writeViteConfig(response)])

      const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
      const stubsPath = path.resolve(path.join(__dirname, 'stubs'))

      const stubs = {
        assets: path.join(stubsPath, 'assets'),
        base: path.join(stubsPath, 'base'),
        // public: path.join(stubsPath, 'public'),
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
        components:
          response.development.template.config.style === 'Styled Components'
            ? path.join(stubsPath, 'components', 'styled-components')
            : path.join(stubsPath, 'components', 'tailwind'),
      }

      const destination = {
        root: path.resolve(response.extension.name.path),
      }

      const { tests: hasTests } = response.development.template.config
      const {
        override: overridePage,
        options: optionsPage,
        type,
      } = response.extension
      const { name: extensionType /* position */ } = type

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
          title: 'Creating project assets...',
          task: () =>
            copyFolder(
              stubs.assets,
              path.join(destination.root, 'src', 'assets')
            ),
        },
        {
          title: 'Creating base project...',
          task: () => copyFolder(stubs.base, destination.root),
        },
        {
          title: 'Creating project components...',
          task: () =>
            copyFolder(
              stubs.components,
              path.join(destination.root, 'src', 'components')
            ),
        },
        {
          title: 'Creating extension popup...',
          task: () =>
            extensionType === 'popup'
              ? copyFolder(
                  stubs.pages.popup,
                  path.join(destination.root, 'src', 'pages', 'popup')
                )
              : Promise.resolve(),
        },
        {
          title: 'Creating extension side panels...',
          task: () =>
            extensionType === 'sidepanel'
              ? writeSidePanels(response)
              : Promise.resolve(),
        },
        {
          title: 'Creating extension devtools panels...',
          task: () =>
            extensionType === 'devtools'
              ? copyFolder(
                  stubs.pages.devtools,
                  path.join(destination.root, 'src', 'pages', 'devtools')
                )
              : Promise.resolve(),
        },
        {
          title: 'Creating options page...',
          task: () =>
            optionsPage === 'full-page' || optionsPage === 'embedded'
              ? copyFolder(
                  stubs.pages.options,
                  path.join(destination.root, 'src', 'pages', 'options')
                )
              : Promise.resolve(),
        },
        {
          title: 'Creating override page...',
          task: () =>
            overridePage !== 'none'
              ? copyOverridePage(overridePage, getOverridePage(overridePage))
              : Promise.resolve(),
        },
        {
          title: 'Creating content script...',
          task: () => {
            extensionType === 'overlay'
              ? copyFolder(
                  stubs.scripts,
                  path.join(destination.root, 'src', 'scripts')
                )
              : Promise.resolve()
          },
        },
        {
          title: 'Creating service worker (background script)...',
          task: () => writeServiceWorker(response),
        },
        {
          title: 'Creating project Typescript configurations...',
          task: () =>
            response.development.template.config.language === 'TypeScript'
              ? copyFolder(stubs.tsconfig, destination.root)
              : Promise.resolve(),
        },
        {
          title: 'Creating style (w/ Tailwind CSS) configurations...',
          task: () =>
            response.development.template.config.style === 'Tailwind'
              ? copyFolder(stubs.style.tailwind, destination.root)
              : Promise.resolve(),
        },
        {
          title: 'Creating style (w/ Styled Components) configurations...',
          task: () =>
            response.development.template.config.style === 'Styled Components'
              ? copyFolder(
                  stubs.style.styledComponents,
                  path.join(destination.root, 'src')
                )
              : Promise.resolve(),
        },
        {
          title:
            'Creating Lint & Format (w/ ESLint + Prettier) configurations...',
          task: () =>
            response.development.template.config.lintFormat ||
            response.language === 'TypeScript'
              ? copyFolder(stubs.lintFormat, destination.root)
              : Promise.resolve(),
        },
        {
          title: 'Creating unit test (w/ Vitest) configurations...',
          task: () =>
            hasTests
              ? copyFolder(stubs.tests, path.join(destination.root, 'src'))
              : Promise.resolve(),
        },
        {
          title: 'Creating git (w/ Github) workflows...',
          task: () =>
            response.development.template.config.git
              ? copyFolder(stubs.github, destination.root)
              : Promise.resolve(),
        },
        {
          title: 'Creating git hooks (w/ Husky) configurations...',
          task: () =>
            response.development.template.config.gitHooks
              ? copyFolder(stubs.gitHooks, destination.root)
              : Promise.resolve(),
        },
        {
          title:
            'Creating project versioning + changelog (w/ Changesets) configurations...',
          task: () =>
            response.development.template.config.changesets
              ? copyFolder(stubs.changesets, destination.root)
              : Promise.resolve(),
        },
        {
          title: 'Creating bedframe.config.ts...',
          task: () => writeBedframeConfig(response),
        },
        {
          title: 'Installing dependencies...',
          task: () =>
            response.development.config.installDeps
              ? installDependencies(response)
              : Promise.resolve(),
        },
        //   {
        //     title: 'Initializing git repository',
        //     skip: () => !response.development.template.config.git,
        //     task: async () => {
        //       chdir(projectPath)
        //       await initializeGitProject(response)
        //       const { packageManager } = response.development.template.config
        //       const { installDeps } = response.development.config
        //       console.log(`>_

        //   ${green('Your BED is made! 🚀')}

        //   ${dim('1.')} cd ${basename(projectPath)}
        //   ${
        //     !installDeps
        //       ? `${dim('2.')} ${packageManager.toLowerCase()} ${
        //           packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
        //         }`
        //       : ``
        //   }
        //   ${dim(
        //     installDeps ? `2.` : `3.`
        //   )} ${packageManager.toLowerCase()} dev ${dim(
        //         `or ${packageManager.toLowerCase()} dev:all`
        //       )}
        // `)
        //     },
        //   },
      ])

      tasks
        .run()
        .then((anything: any) => {
          console.log('run tasks then what....', anything)
        })
        .catch((error: any) => {
          console.error('Failed to make BED ::frowny-face::', error)
        })
        .finally(async () => {
          console.log('finally the rock has come back to ..... buffalo!')
          if (response.development.template.config.git) {
            chdir(projectPath)
            await initializeGitProject(response)
            const { packageManager } = response.development.template.config
            const { installDeps } = response.development.config
            console.log(`>_
        
        ${green('Your BED is made! 🚀')}
        
        ${dim('1.')} cd ${basename(projectPath)}
        ${
          !installDeps
            ? `${dim('2.')} ${packageManager.toLowerCase()} ${
                packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
              }`
            : ``
        }
        ${dim(
          installDeps ? `2.` : `3.`
        )} ${packageManager.toLowerCase()} dev ${dim(
              `or ${packageManager.toLowerCase()} dev:all`
            )}
      `)
          }
        })

      // await Promise.all([
      //   copyFolder(stubs.assets, path.join(destination.root, 'src', 'assets')),
      //   copyFolder(stubs.base, destination.root),
      //   copyFolder(
      //     stubs.components,
      //     path.join(destination.root, 'src', 'components')
      //   ),

      //   extensionType === 'popup'
      //     ? copyFolder(
      //         stubs.pages.popup,
      //         path.join(destination.root, 'src', 'pages', 'popup')
      //       )
      //     : Promise.resolve(),

      //   extensionType === 'sidepanel'
      //     ? writeSidePanels(response)
      //     : Promise.resolve(),

      //   extensionType === 'devtools'
      //     ? copyFolder(
      //         stubs.pages.devtools,
      //         path.join(destination.root, 'src', 'pages', 'devtools')
      //       )
      //     : Promise.resolve(),

      //   optionsPage === 'full-page' || optionsPage === 'embedded'
      //     ? copyFolder(
      //         stubs.pages.options,
      //         path.join(destination.root, 'src', 'pages', 'options')
      //       )
      //     : Promise.resolve(),

      //   overridePage !== 'none'
      //     ? copyOverridePage(overridePage, getOverridePage(overridePage))
      //     : Promise.resolve(),

      //   // if we're writing  it e.g. for sidePanel
      //   // don't copy over fileses
      //   // copyFolder(
      //   //   stubs.scripts,
      //   //   path.join(destination.root, 'src', 'scripts')
      //   // ),
      //   writeServiceWorker(response),

      //   // Copy TS Config if using TypeScript
      //   response.development.template.config.language === 'TypeScript'
      //     ? copyFolder(stubs.tsconfig, destination.root)
      //     : Promise.resolve(),

      //   // Copy Tailwind CSS if selected
      //   response.development.template.config.style === 'Tailwind'
      //     ? copyFolder(stubs.style.tailwind, destination.root)
      //     : Promise.resolve(),

      //   // Copy Styled Components if selected
      //   response.development.template.config.style === 'Styled Components'
      //     ? copyFolder(
      //         stubs.style.styledComponents,
      //         path.join(destination.root, 'src')
      //       )
      //     : Promise.resolve(),

      //   // Copy Lint & Format files if required
      //   response.development.template.config.lintFormat ||
      //   response.language === 'TypeScript'
      //     ? copyFolder(stubs.lintFormat, destination.root)
      //     : Promise.resolve(),

      //   // Copy Unit Test files if required
      //   hasTests
      //     ? copyFolder(stubs.tests, path.join(destination.root, 'src'))
      //     : Promise.resolve(),

      //   // Copy Github / release workflow w/ changeset publish action
      //   response.development.template.config.git
      //     ? copyFolder(stubs.github, destination.root)
      //     : Promise.resolve(),

      //   // Copy Git Hooks with Husky if required
      //   response.development.template.config.gitHooks
      //     ? copyFolder(stubs.gitHooks, destination.root)
      //     : Promise.resolve(),

      //   // Copy Changesets if required
      //   response.development.template.config.changesets
      //     ? copyFolder(stubs.changesets, destination.root)
      //     : Promise.resolve(),

      //   writeBedframeConfig(response),

      //   response.development.config.installDeps
      //     ? installDependencies(response)
      //     : Promise.resolve(),
      // ])
      //   .then(() => {
      //     console.log('bruh ......')
      //   })
      //   .finally(() => {
      //     console.log('finally the rock has come back to ..... buffalo!')
      //     if (response.development.template.config.git) {
      //       console.log('we should be initializing the repo bruh!!!')
      //       chdir(projectPath)
      //       await initializeGitProject(response)
      //       const { packageManager } = response.development.template.config
      //       const { installDeps } = response.development.config
      //       console.log(`
      //     >_

      //     ${green('Your BED is made! 🚀')}

      //     ${dim('1.')} cd ${basename(projectPath)}
      //     ${
      //       !installDeps
      //         ? `${dim('2.')} ${packageManager.toLowerCase()} ${
      //             packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
      //           }`
      //         : ``
      //     }
      //     ${dim(
      //       installDeps ? `2.` : `3.`
      //     )} ${packageManager.toLowerCase()} dev ${dim(
      //         `or ${packageManager.toLowerCase()} dev:all`
      //       )}
      //   `)
      //     }
      //   })

      // writeBedframeConfig(response)

      // writeServiceWorker(response)

      // if (extensionType === 'sidepanel') {
      //   writeSidePanels(response)
      // }

      // if (response.development.template.config.git) {
      //   chdir(projectPath)
      //   await initializeGitProject(response)
      //   const { packageManager } = response.development.template.config
      //   const { installDeps } = response.development.config
      //   console.log(`
      //   >_

      //   ${green('Your BED is made! 🚀')}

      //   ${dim('1.')} cd ${basename(projectPath)}
      //   ${
      //     !installDeps
      //       ? `${dim('2.')} ${packageManager.toLowerCase()} ${
      //           packageManager.toLowerCase() !== 'yarn' ? 'install' : ''
      //         }`
      //       : ``
      //   }
      //   ${dim(
      //     installDeps ? `2.` : `3.`
      //   )} ${packageManager.toLowerCase()} dev ${dim(
      //     `or ${packageManager.toLowerCase()} dev:all`
      //   )}
      // `)
      // }
    } catch (error) {
      console.error(error)
    }
  }
}
