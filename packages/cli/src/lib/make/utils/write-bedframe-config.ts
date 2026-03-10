import path from 'node:path'
import type { AnyCase, Browser } from '@bedframe/core'
import type { Answers } from 'prompts'
import { ensureDir, ensureWriteFile, outputFile } from './utils.fs'

/**
 * construct override page url to resolve in vite/bedfframe configs
 *
 * @param {string} overridePage
 * @return {*}  {string}
 */
const getOverridePage = (overridePage: string): string => {
  return `${overridePage}: 'src/pages/${overridePage}.html',\n`
}

/**
 * create the bedframe.config.ts based on prompt responses
 *
 * @export
 * @param {Answers<string>} response
 * @return {*}  {string}
 *
 */
export async function writeBedframeConfig(
  response: Answers<string>,
): Promise<void> {
  const { browser } = response
  const {
    framework,
    language,
    packageManager,
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
  const { name: extensionType } = type

  const browsers = browser
    .map((browser: AnyCase<Browser>) => {
      const browserName = browser.toLowerCase()
      return `import { ${browserName} } from '../manifests/${browserName}'`
    })
    .join('\n')

  const gitFeatures = {
    git: git,
    gitHooks: gitHooks,
    commitLint: commitLint,
    changesets: changesets,
  }

  const featureStrings = Object.entries(gitFeatures).map(([key, value]) => {
    return value ? `${key}: ${value},\n` : ''
  })

  const fileContent = `import { createBedframe } from '@bedframe/core'
${browsers}

export default createBedframe({
  browser: [
    ${browser
      .map((browserName: AnyCase<Browser>) => `${browserName}.browser`)
      .join(',\n')}
  ],
  extension: {
    type: '${extensionType}',${
      overridePage !== 'none' ? `overrides: '${overridePage}',` : ''
    }${
      optionsPage !== 'none' ? `options: '${optionsPage}',` : ''
    }manifest: [${browser.map((browserName: AnyCase<Browser>) => browserName)}],
    pages: {${
      extensionType === 'sidepanel'
        ? `welcome: 'src/pages/sidepanel-welcome.html',
        main: 'src/pages/sidepanel-main.html',`
        : ''
    }${extensionType === 'overlay' ? `\noverlay: 'src/pages/main.html',` : ''}${
      extensionType === 'devtools'
        ? `\ndevtools: 'src/pages/devtools.html',`
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
        ${lintFormat ? `lintFormat: ${lintFormat},` : ''}
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
        }${featureStrings.join('')}  
      },
    },
  },
})

`

  const rootDir = path.resolve(name.path)
  const configDir = path.join(rootDir, 'src', '_config')
  const configFilePath = path.join(configDir, 'bedframe.config.ts')

  await ensureDir(configDir)
  await ensureWriteFile(configFilePath)
  await outputFile(configFilePath, `${fileContent}\n`)
}
