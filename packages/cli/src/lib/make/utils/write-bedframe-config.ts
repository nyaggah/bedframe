import path from 'node:path'
import { Answers } from 'prompts'
import { ensureDir, ensureFile, outputFile } from './utils.fs'

/**
 * construct override page url to resolve in vite/bedfframe configs
 *
 * @param {string} overridePage
 * @return {*}  {string}
 */
const getOverridePage = (overridePage: string): string => {
  // return `${overridePage}: resolve(src, 'pages', '${overridePage}', 'index.html'),\n`
  return `${overridePage}: 'src/pages/${overridePage}/index.html',\n`
}

/**
 * create the bedframe.config.ts based on prompt responses
 *
 * @export
 * @param {Answers<string>} response
 * @return {*}  {string}
 *
 */
export function writeBedframeConfig(response: Answers<string>): void {
  const {
    framework,
    language,
    packageManager,
    style,
    lintFormat,
    tests: hasTests,
    git,
    gitHooks,
    commitLint,
    changesets,
  } = response.development.template.config
  const {
    override: overridePage,
    options: optionsPage,
    type,
    name,
  } = response.extension
  const { name: extensionType, position } = type

  const isTailwind = style === 'Tailwind'

  const fileContent = `import { createBedframe } from '@bedframe/core'
import { manifests } from '../manifests'

export default createBedframe({
  browser: manifests.map((target) => target.browser),
  extension: {
    type: '${extensionType}',
    ${position ? `position: '${position}',` : ''}
    ${overridePage !== 'none' ? `overrides: '${overridePage}',` : ''}
    options: '${optionsPage}',
    manifest: manifests,
    pages: {
      ${
        extensionType === 'sidepanel'
          ? `welcome: 'src/sidepanels/welcome/index.html',
        main: 'src/sidepanels/main/index.html',`
          : ''
      }${
        extensionType === 'devtools'
          ? `devtools: 'src/pages/devtools/panel.html',`
          : ''
      }${overridePage !== 'none' ? getOverridePage(overridePage) : ''}
    },    
  },
  development: {
    template: {
      config: {
        framework: '${framework.toLowerCase()}',
        language: '${language.toLowerCase()}',
        packageManager: '${packageManager.toLowerCase()}',
        style: {
          framework: '${style.toLowerCase()}',
          ${
            isTailwind
              ? `components: 'shadcn',
          theme: 'new-york',`
              : ''
          }
          fonts: [
            {
              name: 'Inter',
              local: 'Inter',
              src: './assets/fonts/inter/*.ttf',
              weights: {
                'Inter-Regular': 400,
                'Inter-SemiBold': 600,
                'Inter-Bold': 700,
                'Inter-ExtraBold': 800,
              },
            },
          ],
        },
        lintFormat: ${lintFormat},
        ${
          hasTests
            ? `tests: {
          globals: true,
          setupFiles: ['./_config/tests.config.ts'],
          environment: 'happy-dom',
          coverage: {
            provider: 'istanbul',
            reporter: ['text', 'json', 'html'],
            reportsDirectory: '../coverage',
          },
          watch: false,
        },`
            : ''
        }        
        git: ${git},
        gitHooks: ${gitHooks},
        commitLint: ${commitLint},
        changesets: ${changesets},
      },
    },
  },
})

`

  try {
    const rootDir = path.resolve(name.path)
    const configDir = path.join(rootDir, 'src', '_config')
    const configFilePath = path.join(configDir, 'bedframe.config.ts')
    ensureDir(configDir)
      .then(() => {
        ensureFile(configFilePath).then(() =>
          outputFile(configFilePath, fileContent + '\n'),
        )
      })
      .catch((error) => console.error(error))
  } catch (error) {
    console.error(error)
  }
}
