import { execa } from 'execa'
import { resolveDependencyGroups } from '../features/dependency-plan'
import { packageSpecifier } from '../features/versions'
import type { PromptsResponse } from '../prompts'

function packageTarget(packageName: string): string {
  return `${packageName}@${packageSpecifier(packageName)}`
}

async function addPackages(
  packageManager: string,
  projectPath: string,
  packages: string[],
  dev = false,
): Promise<void> {
  if (packages.length === 0) {
    return
  }

  const targets = packages.map(packageTarget)
  const pm = packageManager.toLowerCase()

  if (pm === 'bun') {
    await execa('bun', ['add', ...(dev ? ['-d'] : []), ...targets], {
      cwd: projectPath,
    })
    return
  }

  if (pm === 'pnpm') {
    await execa('pnpm', ['add', ...(dev ? ['-D'] : []), ...targets], {
      cwd: projectPath,
    })
    return
  }

  if (pm === 'yarn') {
    await execa('yarn', ['add', ...(dev ? ['-D'] : []), ...targets], {
      cwd: projectPath,
    })
    return
  }

  await execa('npm', ['install', ...(dev ? ['-D'] : []), ...targets], {
    cwd: projectPath,
  })
}

/**
 * Install project dependencies and run scaffold follow-up tasks that require
 * local package binaries.
 *
 * @export
 * @param {PromptsResponse} response
 * @return {*}  {Promise<void>}
 */
export async function installDependencies(
  response: PromptsResponse,
): Promise<void> {
  const { path: projectPath } = response.extension.name
  const { packageManager } = response.development.template.config
  const dependencyGroups = resolveDependencyGroups(response)

  for (const group of dependencyGroups) {
    await addPackages(
      packageManager,
      projectPath,
      group.dependencies ?? [],
    )
    await addPackages(
      packageManager,
      projectPath,
      group.devDependencies ?? [],
      true,
    )
  }
}

export async function installProjectDependencies(
  packageManager: string,
  projectPath: string,
): Promise<void> {
  const pm = packageManager.toLowerCase()

  if (pm === 'bun') {
    await execa('bun', ['install'], { cwd: projectPath })
    return
  }

  if (pm === 'pnpm') {
    await execa('pnpm', ['install'], { cwd: projectPath })
    return
  }

  if (pm === 'yarn') {
    await execa('yarn', ['install'], { cwd: projectPath })
    return
  }

  await execa('npm', ['install'], { cwd: projectPath })
}
