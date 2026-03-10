import path from 'node:path'
import { promises as fs } from 'node:fs'
import type prompts from 'prompts'
import { resolveDependencyPlan } from '../features/dependency-plan'
import { resolveScaffoldSpec } from '../features/scaffold-spec'
import { packageSpecifier } from '../features/versions'
import { writeFile } from './utils.fs'

/**
 * Write the composed package.json from prompt responses
 * to the project's root
 *
 * @export
 * @param {prompts.Answers<string>} response
 */
export async function writePackageJson(
  response: prompts.Answers<string>,
): Promise<void> {
  const spec = resolveScaffoldSpec(response)
  const { browsers } = spec
  const { manifest, author, license, isPrivate } = response.extension
  const projectName = manifest[0].manifest.name
  const projectAuthor = author
  const projectVersion = manifest[0].manifest.version
  const projectDescription = manifest[0].manifest.description

  const { language, packageManager } = response.development.template.config
  const { lintFormat, tests: hasTests, git, gitHooks, changesets, commitLint } =
    spec.featureFlags

  const pm = packageManager.toLowerCase()
  const pmRun = pm !== 'yarn' ? `${pm} run` : pm
  const scripts: Record<string, string> = {
    dev: 'bedframe dev',
    build: 'tsc && bedframe build',
    publish: 'bedframe publish -b',
    zip: 'bedframe zip',
  }

  if (changesets) {
    scripts.version = 'bedframe version'
  }
  if (git) {
    scripts.release =
      'gh release create $npm_package_name@$npm_package_version ./dist/*.zip --generate-notes'
  }
  if (lintFormat) {
    scripts.format = 'oxfmt .'
    scripts.lint = 'oxlint --fix .'
    scripts.fix = `${pmRun} format && ${pmRun} lint`
  }
  if (hasTests) {
    scripts.test = 'vitest run --coverage'
  }
  if (commitLint) {
    scripts.commit = `${lintFormat ? 'lint-staged && ' : ''}cz`
  }
  if (browsers.includes('safari')) {
    scripts['convert:safari'] =
      'xcrun safari-web-extension-converter dist/safari --project-location . --app-name $npm_package_name-safari'
  }

  const dependencyPlan = resolveDependencyPlan(response)
  const dependencies = Object.fromEntries(
    dependencyPlan.dependencies.map((packageName) => [
      packageName,
      packageSpecifier(packageName),
    ]),
  )
  const devDependencies = Object.fromEntries(
    dependencyPlan.devDependencies.map((packageName) => [
      packageName,
      packageSpecifier(packageName),
    ]),
  )

  let existingPackageJson: Record<string, unknown> = {}
  try {
    const raw = await fs.readFile(
      path.join(response.extension.name.path, 'package.json'),
      'utf8',
    )
    existingPackageJson = JSON.parse(raw) as Record<string, unknown>
  } catch {
    // no-op: compose from scratch
  }

  const existingDependencies = (existingPackageJson.dependencies ??
    {}) as Record<string, string>
  const existingDevDependencies = (existingPackageJson.devDependencies ??
    {}) as Record<string, string>

  const packageJsonObject: Record<string, unknown> = {
    ...existingPackageJson,
    name: parameterizeString(projectName),
    version: projectVersion,
    description: projectDescription,
    license,
    private: isPrivate,
    type: 'module',
    scripts,
    dependencies: {
      ...existingDependencies,
      ...dependencies,
    },
    devDependencies: {
      ...existingDevDependencies,
      ...devDependencies,
    },
  }

  if (projectAuthor) {
    packageJsonObject.author = {
      name: projectAuthor.name,
      email: projectAuthor.email,
      url: projectAuthor.url,
    }
  }

  if (lintFormat) {
    packageJsonObject['lint-staged'] = {
      '*.{js,jsx,ts,tsx,css,html,json}': 'oxfmt --no-error-on-unmatched-pattern',
      '*.{js,jsx,ts,tsx}': 'oxlint --fix',
    }
  }

  if (commitLint) {
    packageJsonObject.commitlint = {
      extends: ['@commitlint/config-conventional'],
    }
    packageJsonObject.config = {
      commitizen: {
        path: './node_modules/cz-conventional-changelog',
      },
    }
  }

  const packageJson = `${JSON.stringify(packageJsonObject, null, 2)}\n`

  const destinationRoot = path.resolve(response.extension.name.path)
  const destinationPackageJson = path.join(destinationRoot, 'package.json')
  await writeFile(destinationPackageJson, packageJson)
}

export const parameterizeString = (string: string, separator = '-') => {
  return string.toLowerCase().replace(/[^A-Z0-9]/gi, separator)
}
