import path from 'node:path'
import { execa } from 'execa'
import {
  isShadcnBootstrapPath,
  resolveViteTemplate,
} from '../features/vite-template-map'
import type { PromptsResponse } from '../prompts'
import { ensureDir } from './utils.fs'

async function runViteScaffold(
  packageManager: string,
  projectParent: string,
  projectName: string,
  template: string,
): Promise<void> {
  const pm = packageManager.toLowerCase()

  if (pm === 'bun') {
    await execa(
      'bun',
      ['create', 'vite', projectName, '--template', template, '--no-interactive'],
      {
        cwd: projectParent,
      },
    )
    return
  }

  if (pm === 'pnpm') {
    await execa(
      'pnpm',
      [
        'create',
        'vite@latest',
        projectName,
        '--template',
        template,
        '--no-interactive',
      ],
      { cwd: projectParent },
    )
    return
  }

  if (pm === 'yarn') {
    await execa(
      'yarn',
      ['create', 'vite', projectName, '--template', template, '--no-interactive'],
      {
        cwd: projectParent,
      },
    )
    return
  }

  await execa(
    'npm',
    [
      'create',
      'vite@latest',
      projectName,
      '--',
      '--template',
      template,
      '--no-interactive',
    ],
    { cwd: projectParent },
  )
}

async function runShadcnScaffold(
  packageManager: string,
  projectParent: string,
  projectName: string,
  base: string,
  preset: string,
  cssVariables: boolean,
  rtl: boolean,
): Promise<void> {
  const args = [
    'shadcn@latest',
    'init',
    '--template',
    'vite',
    '--base',
    base,
    '--preset',
    preset,
    '--yes',
    '--no-monorepo',
    '--silent',
    '--cwd',
    projectParent,
    '--name',
    projectName,
    ...(cssVariables ? ['--css-variables'] : ['--no-css-variables']),
    ...(rtl ? ['--rtl'] : ['--no-rtl']),
  ]

  const pm = packageManager.toLowerCase()

  if (pm === 'bun') {
    await execa('bunx', ['--bun', ...args], { cwd: projectParent })
    return
  }

  if (pm === 'pnpm') {
    await execa('pnpm', ['dlx', ...args], { cwd: projectParent })
    return
  }

  if (pm === 'yarn') {
    await execa('yarn', ['dlx', ...args], { cwd: projectParent })
    return
  }

  await execa('npx', args, { cwd: projectParent })
}

export async function bootstrapViteProject(
  response: PromptsResponse,
): Promise<void> {
  const { packageManager } = response.development.template.config
  const { path: projectPath, name: projectName } = response.extension.name
  const projectParent = path.dirname(projectPath)

  await ensureDir(projectParent)

  if (isShadcnBootstrapPath(response)) {
    const spec = response.development.template.config
    await runShadcnScaffold(
      packageManager,
      projectParent,
      projectName,
      spec.shadcn?.base ?? 'radix',
      spec.shadcn?.preset ?? 'nova',
      spec.shadcn?.cssVariables ?? true,
      spec.shadcn?.rtl ?? false,
    )
    return
  }

  const template = resolveViteTemplate(response)
  await runViteScaffold(packageManager, projectParent, projectName, template)
}
