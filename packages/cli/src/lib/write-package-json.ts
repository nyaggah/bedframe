import { Browser, Manifest } from '@bedframe/core'
import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

export type PackageJsonType = Record<string, any> & {
  name: string
  version: string
}
export type ScriptCommand = {
  [key: string]: string
}
export type Dependency = {
  name: string
  version?: string
}
export type DependencyType = {
  dependencies?: Dependency[]
  devDependencies?: Dependency[]
}

export type ConfigType<K extends string = string> = {
  [key in K]?: Record<string, any>
}

/**
 *
 * convertArrayToObject()
 *
 * @export
 * @param {ScriptCommand[]} arr - each member in shape of package.json script command
 * @return {*}  {@link ScriptCommand}
 *
 */
export function convertArrayToObject(arr: ScriptCommand[]): ScriptCommand {
  let obj: ScriptCommand = {}
  for (const item of arr) {
    obj = { ...obj, ...item }
  }

  return obj
}
/**
 * create the `[key, value]` for a `package.json` script
 *
 * @param {string} key
 * @param {string} value
 * @return {*}  {ScriptCommand}
 */
const createScriptCommand = (key: string, value: string): ScriptCommand => {
  return {
    [key.toString()]: value.toString(),
  }
}

export function createPackageJson(
  packageJson: PackageJsonType,
): PackageJsonType {
  return packageJson
}

/**
 * Conditionally generate the requisite scripts
 * to handle the functionality opted into via
 * `@bedframe/cli` `Make` command args, flags & prompts
 *
 * @export
 * @param {prompts.Answers<string>} response
 * @return {*}  {@link ScriptCommand}
 */
export function createScriptCommandsFrom(
  response: prompts.Answers<string>,
): ScriptCommand {
  const { development, browser: browsers } = response
  const {
    packageManager,
    tests: hasTests,
    lintFormat,
    gitHooks,
    changesets,
  } = development.template.config
  // const { language, lintFormat, style, tests, git, gitHooks, changesets } =
  //   response.development.template.config

  const devBuildScripts = () => {
    const devScript = createScriptCommand('dev', 'vite')
    const devForScript = createScriptCommand('dev:for', 'vite --mode')
    const devAllScript =
      browsers.length > 1
        ? createScriptCommand(
            `dev:all`,
            `concurrently ${browsers
              .map((browser: Browser) => `\"vite --mode ${browser}\"`)
              .join(' ')}`,
          )
        : {}

    const buildScript = createScriptCommand('build', 'tsc && vite build')
    const buildForScript = createScriptCommand(
      'build:for',
      'tsc && vite build --mode',
    )
    const buildAllScript =
      browsers.length > 1
        ? createScriptCommand(
            `build:all`,
            `concurrently ${browsers
              .map(
                (browser: Browser) => `\"tsc && vite build --mode ${browser}\"`,
              )
              .join(' ')}`,
          )
        : {}

    return convertArrayToObject(
      [
        devScript,
        devForScript,
        devAllScript,
        buildScript,
        buildForScript,
        buildAllScript,
      ].filter(Boolean),
    )
  }

  const lintFormatScripts = () => {
    const lintScript = createScriptCommand(
      'lint',
      `eslint . --report-unused-disable-directives --max-warnings 0`,
    )

    const prettierWriteScript = createScriptCommand(
      'format',
      `${packageManager.toLowerCase()} prettier --write .`,
    )

    return lintFormat
      ? convertArrayToObject([prettierWriteScript, lintScript])
      : null
  }

  const testScripts = () => {
    const testScript = createScriptCommand('test', 'vitest run --coverage')
    return hasTests ? convertArrayToObject([testScript]) : null
  }

  const gitHooksScripts = () => {
    const czScript = createScriptCommand('cz', `cz`)
    const postInstallScript = createScriptCommand(
      'postinstall',
      'husky install',
    )

    return gitHooks ? convertArrayToObject([czScript, postInstallScript]) : null
  }

  const releaseScripts = () => {
    const releaseScript = createScriptCommand(
      'release',
      `${
        lintFormat ? 'pnpm format && pnpm lint &&' : ''
      } build:all && changeset version`,
    )

    return changesets ? convertArrayToObject([releaseScript]) : null
  }

  return {
    ...devBuildScripts(),
    ...lintFormatScripts(),
    ...testScripts(),
    ...gitHooksScripts(),
    ...releaseScripts(),
  }
}
/**
 * Conditionally generate the `package.json` dependencies
 * opted into via `@bedframe/cli` `Make` command args,
 * flags & prompts
 *
 * @export
 * @param {prompts.Answers<string>} response
 * @return {*}
 * ```typescript
 * {{
 *   dependencies?: Partial<DependencyType>
 *   devDependencies?: Partial<DependencyType>
 *   config?: Partial<ConfigType>
 * }}
 * ```
 */
export function createDependenciesFrom(response: prompts.Answers<string>): {
  dependencies?: Partial<DependencyType>
  devDependencies?: Partial<DependencyType>
  config?: Partial<ConfigType>
} {
  const base: Partial<DependencyType>[] = [
    {
      dependencies: [
        { name: 'react', version: '^18.2.0' },
        { name: 'react-dom', version: '^18.2.0' },
        { name: 'react-chrome-extension-router', version: '^1.4.0' },
        { name: 'react-frame-component', version: '^5.2.6' },
      ].sort((a, b) => a.name.localeCompare(b.name)),
    },
    {
      devDependencies: [
        { name: '@bedframe/core', version: '^0.0.26' },
        { name: '@types/chrome', version: '^0.0.243' },
        { name: '@types/react', version: '^18.2.9' },
        { name: '@types/react-dom', version: '^18.2.7' },
        { name: '@types/react-frame-component', version: '^4.1.3' },
        { name: '@vitejs/plugin-react', version: '^4.0.4' },
        { name: 'concurrently', version: '^8.2.0' },
        { name: 'typescript', version: '^5.1.6' },
        { name: 'unplugin-fonts', version: '^1.0.3' },
        { name: 'vite', version: '^4.4.9' },
      ].sort((a, b) => a.name.localeCompare(b.name)),
    },
  ]

  const lintFormat: Partial<DependencyType>[] = response.development.template
    .config.lintFormat
    ? [
        {
          devDependencies: [
            { name: '@typescript-eslint/eslint-plugin', version: '^6.2.0' },
            { name: 'eslint', version: '^8.46.0' },
            { name: 'eslint-plugin-import', version: '^2.28.0' },
            { name: 'eslint-plugin-n', version: '^16.0.1' },
            { name: 'eslint-plugin-promise', version: '^6.1.1' },
            { name: 'eslint-config-prettier', version: '^9.0.0' },
            { name: 'eslint-plugin-react', version: '^7.33.1' },
            { name: 'eslint-plugin-react-hooks', version: '^4.6.0' },
            { name: 'eslint-plugin-react-refresh', version: '^0.4.3' },
            { name: 'prettier', version: '^3.0.1' },
          ].sort((a, b) => a.name.localeCompare(b.name)),
        },
      ]
    : []
  const style: Partial<DependencyType>[] =
    response.development.template.config.style === 'Styled Components'
      ? [
          { dependencies: [{ name: 'styled-components', version: '^6.0.5' }] },
          {
            devDependencies: [
              { name: '@types/styled-components', version: '^5.1.26' },
              { name: 'babel-plugin-styled-components', version: '^2.1.4' },
              { name: 'vite-plugin-babel-macros', version: '^1.0.6' }, // <-- if vite + styled-components
            ].sort((a, b) => a.name.localeCompare(b.name)),
          },
        ]
      : [
          {
            devDependencies: [
              { name: 'autoprefixer', version: '^10.4.14' },
              { name: 'postcss', version: '^8.4.27' },
              { name: 'tailwindcss', version: '^3.3.3' },
            ].sort((a, b) => a.name.localeCompare(b.name)),
          },
        ]

  const tests: Partial<DependencyType>[] = response.development.template.config
    .tests
    ? [
        {
          devDependencies: [
            { name: '@testing-library/react', version: '^14.0.0' },
            { name: '@testing-library/user-event', version: '^14.4.3' },
            { name: '@testing-library/jest-dom', version: '^5.14.9' },
            { name: '@types/jest', version: '^29.5.3' },
            { name: '@types/testing-library__jest-dom', version: '^5.14.6' },
            { name: '@vitest/coverage-istanbul', version: '^0.34.1' },
            { name: 'jsdom', version: '^22.1.0' },
            { name: 'vitest', version: '^0.34.1' },
          ].sort((a, b) => a.name.localeCompare(b.name)),
        },
      ]
    : []

  const gitHooks: Partial<DependencyType>[] = response.development.template
    .config.gitHooks
    ? [
        {
          devDependencies: [
            { name: 'husky', version: '^8.0.3' },
            { name: 'lint-staged', version: '^13.2.3' },
          ].sort((a, b) => a.name.localeCompare(b.name)),
        },
      ]
    : []

  const commitLint: Partial<DependencyType>[] = response.development.template
    .config.commitLint
    ? [
        {
          devDependencies: [
            { name: '@commitlint/cli', version: '^17.6.7' },
            { name: '@commitlint/config-conventional', version: '^17.6.7' },
            { name: 'cz-conventional-changelog', version: '^3.3.0' },
            { name: 'commitizen', version: '^4.3.0' },
          ].sort((a, b) => a.name.localeCompare(b.name)),
        },
      ]
    : []

  const changesets: Partial<DependencyType & ConfigType>[] = response
    .development.template.config.changesets
    ? [{ devDependencies: [{ name: '@changesets/cli', version: '^2.26.2' }] }]
    : []

  /**
   * Generate `package.json` compliant field (object)
   * from `(key, value)` pair from passed in
   *
   * This function is suuuper liberal, innit?!
   * TO diddly DO: tighten typing on
   * the expected `value`
   *
   * @param {string} key
   * @param {*} value
   * @return {*}  {Partial<ConfigType>}
   */
  const packageJsonField = (
    key: string,
    value: any, // Partial<ConfigType> // Record<string, any> | string | any[]
  ): Partial<ConfigType> => {
    if (key === '') {
      return value
    }

    return { [key]: value }
  }
  /**
   * Generate the packageJsonField()s for the
   * other non-standard/ free-form-ish package.json
   * fields / configs
   *
   * @return {*}
   */
  const getConfigs = () => {
    const eslintConfig = response.development.template.config.lintFormat
      ? packageJsonField('eslintConfig', {
          globals: {
            JSX: true,
          },
          env: {
            browser: true,
            es2020: true,
            webextensions: true,
          },
          extends: [
            'eslint:recommended',
            'plugin:@typescript-eslint/recommended',
            'plugin:react-hooks/recommended',
            'prettier',
          ],
          settings: {
            react: {
              version: 'detect',
            },
          },
          parser: '@typescript-eslint/parser',
          parserOptions: {
            ecmaVersion: 'latest',
            sourceType: 'module',
            project: ['tsconfig.json', 'tsconfig.node.json'],
          },
          plugins: ['react-refresh'],
          rules: {
            'react-refresh/only-export-components': 'warn',
            'react/react-in-jsx-scope': 'off',
            'space-before-function-paren': 'off',
          },
          ignorePatterns: ['dist', 'node_modules', 'coverage'],
        })
      : {}
    const lintStagedConfig: Partial<ConfigType> = response.development.template
      .config.lintFormat
      ? packageJsonField('lint-staged', {
          '*.{css,html,json,js}': ['prettier --write .'],
          '*{js,ts}': 'eslint . --fix',
        })
      : {}

    const prettierConfig: Partial<ConfigType> = response.development.template
      .config.lintFormat
      ? packageJsonField('prettier', {
          tabWidth: 2,
          semi: false,
          singleQuote: true,
        })
      : {}

    const commitLintConfig: Partial<ConfigType> = response.development.template
      .config.lintFormat
      ? packageJsonField('', {
          commitlint: {
            extends: ['@commitlint/config-conventional'],
          },
          config: {
            commitizen: {
              path: './node_modules/cz-conventional-changelog',
            },
          },
        })
      : {}
    const gitHooksConfig: Partial<ConfigType> = response.development.template
      .config.lintFormat
      ? packageJsonField('husky', {
          hooks: {
            'commit-msg': 'commitlint --edit',
            'pre-commit': `${
              response.development.template.config.packageManager.toLowerCase() ??
              'yarn'
            } lint-staged`,
            'prepare-commit-msg':
              'exec < /dev/tty && node_modules/.bin/cz --hook || true',
          },
        })
      : {}

    const configs = {
      ...eslintConfig,
      ...lintStagedConfig,
      ...prettierConfig,
      ...commitLintConfig,
      ...gitHooksConfig,
    }

    return { ...configs }
  }

  const deps: Partial<DependencyType>[] = [
    ...base,
    ...lintFormat,
    ...style,
    ...tests,
    ...gitHooks,
    ...commitLint,
    ...changesets,
  ]

  const dependencies: Partial<DependencyType> = {}
  const devDependencies: Partial<DependencyType> = {}

  for (const dep of deps) {
    if (dep.dependencies) {
      for (const dependency of dep.dependencies as Dependency[]) {
        ;(dependencies as any)[dependency.name] = dependency.version
      }
    }

    if (dep.devDependencies) {
      for (const dependency of dep.devDependencies as Dependency[]) {
        ;(devDependencies as any)[dependency.name] = dependency.version
      }
    }
  }

  let configs = { ...getConfigs() }
  return { dependencies, devDependencies, ...configs }
}
/**
 * For BEDs with multiple Manifests (Browser targets)
 * set by selecting multiple Browsers in cli prompts,
 * return the Manifest for the first of these
 *
 * @param {*} response
 * @return {*}  {@link Manifest}
 */
function getFirstManifestDetails(response: any): Manifest {
  for (const browserKey in response) {
    const browser = response[browserKey] as Manifest
    return browser
  }

  throw new Error('Invalid JSON object: No valid Manifest object found')
}
/**
 * Compose the project's `package.json` from the
 * prompt response & configurations therein
 *
 * @export
 * @param {prompts.Answers<string>} response
 * @return {*}  {@link PackageJsonType}
 */
export function createPackageJsonFrom(
  response: prompts.Answers<string>,
): PackageJsonType {
  return createPackageJson({
    name: getFirstManifestDetails(response.extension.manifest[0]).name,
    version: getFirstManifestDetails(response.extension.manifest[0]).version,
    description: getFirstManifestDetails(response.extension.manifest[0])
      .description,
    author: {
      name: response.extension.author.name,
      email: response.extension.author.email,
      url: response.extension.author.url,
    },
    license: response.extension.license ?? 'MIT',
    private: Boolean(response.private) ?? 'true',
    type: 'module',
    scripts: createScriptCommandsFrom(response),
    ...createDependenciesFrom(response),
  })
}
/**
 * Write the composed package.json (from `createPackageJsonFrom` method)
 * to the project's root
 *
 * @export
 * @param {prompts.Answers<string>} response
 */
export function writePackageJson(response: prompts.Answers<string>): void {
  const packageJson = JSON.stringify(createPackageJsonFrom(response), null, 2)
  const destinationRoot = path.resolve(response.extension.name.path)
  const destinationPackageJson = path.join(destinationRoot, 'package.json')
  fs.writeFile(destinationPackageJson, packageJson + '\n').catch(console.error)
}
