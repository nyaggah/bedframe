import fs from 'fs-extra'
import path from 'node:path'
import { Answers } from 'prompts'

/**
 * construct override page url to resolve in vite/bedfframe configs
 *
 * @param {string} overridePage
 * @return {*}  {string}
 */
const getOverridePage = (overridePage: string): string => {
  return `${overridePage}: resolve(src, 'pages', '${overridePage}', 'index.html'),\n`
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
    tests,
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

  const styledComponents = style === 'Styled Components'

  const fileContent = `import { manifests } from './src/manifests'

export const bedframeConfig = {
  browser: manifests.map((target) => target.browser),
  extension: {
    type: '${extensionType}',
    ${position ? `position: '${position}',` : ''}
    ${overridePage !== 'none' ? `overrides: '${overridePage}',` : ''}
    options: '${optionsPage}',
    manifest: manifests.map((target) => {
      return {
        [target.browser]: target.manifest
      }
    })
  },
  development: {
    template: {
      config: {
        framework: '${framework.toLowerCase()}',
        language: '${language.toLowerCase()}',
        packageManager: '${packageManager.toLowerCase()}',
        style: '${style.toLowerCase()}',
        lintFormat: ${lintFormat},
        tests: ${tests},
        git: ${git},
        gitHooks: ${gitHooks},
        commitLint: ${commitLint},
        changesets: ${changesets},
      },
    },
  },
}

`

  try {
    const rootDir = path.resolve(name.path)
    fs.ensureDir(rootDir).catch(console.error)
    fs.outputFile(
      path.join(rootDir, 'bedframe.config.ts'),
      fileContent + '\n',
    ).catch((error) => console.error(error))
  } catch (error) {
    console.error(error)
  }
}
