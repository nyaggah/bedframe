import path from 'node:path'
import { promises as fs } from 'node:fs'
import { execa } from 'execa'
import { resolveScaffoldSpec } from '../features/scaffold-spec'
import type { PromptsResponse } from '../prompts'

async function initChangesets(
  packageManager: string,
  projectPath: string,
): Promise<void> {
  const pm = packageManager.toLowerCase()

  if (pm === 'bun') {
    await execa('bunx', ['--bun', 'changeset', 'init'], { cwd: projectPath })
    return
  }

  if (pm === 'pnpm') {
    await execa('pnpm', ['exec', 'changeset', 'init'], { cwd: projectPath })
    return
  }

  if (pm === 'yarn') {
    await execa('yarn', ['changeset', 'init'], { cwd: projectPath })
    return
  }

  await execa('npx', ['changeset', 'init'], { cwd: projectPath })
}

export async function configureScaffold(
  response: PromptsResponse,
): Promise<void> {
  const { path: projectPath } = response.extension.name
  const { packageManager, changesets } = response.development.template.config
  const spec = resolveScaffoldSpec(response)

  if (!response.development.config.installDeps) {
    return
  }

  if (
    spec.framework === 'react' &&
    spec.style.isTailwind &&
    spec.style.ui.provider !== 'shadcn'
  ) {
    await ensureTailwindVitePrerequisites(projectPath)
  }

  if (changesets) {
    await initChangesets(packageManager, projectPath)
  }

  if (spec.style.ui.provider === 'shadcn') {
    // shadcn-compatible scaffolds are now bootstrapped directly via shadcn init
    // during bootstrap phase; configure does not re-run shadcn.
    return
  }

}

async function ensureTailwindVitePrerequisites(projectPath: string): Promise<void> {
  const viteConfigPath = path.join(projectPath, 'vite.config.ts')
  const viteConfig = `import { resolve } from 'node:path'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
`
  await fs.writeFile(viteConfigPath, `${viteConfig}\n`)

  const indexCssPath = path.join(projectPath, 'src', 'index.css')
  await fs.writeFile(indexCssPath, `@import 'tailwindcss';\n`)

  const tsconfigPath = path.join(projectPath, 'tsconfig.json')
  let tsconfigObject: Record<string, unknown> = {}
  try {
    const existing = await fs.readFile(tsconfigPath, 'utf8')
    tsconfigObject = JSON.parse(existing) as Record<string, unknown>
  } catch {
    tsconfigObject = {}
  }

  const existingCompilerOptions = (tsconfigObject.compilerOptions ??
    {}) as Record<string, unknown>
  tsconfigObject.compilerOptions = {
    ...existingCompilerOptions,
    baseUrl: '.',
    paths: {
      '@/*': ['./src/*'],
    },
  }
  if (!Array.isArray(tsconfigObject.references)) {
    tsconfigObject.references = [
      { path: './tsconfig.app.json' },
      { path: './tsconfig.node.json' },
    ]
  }

  await fs.writeFile(tsconfigPath, `${JSON.stringify(tsconfigObject, null, 2)}\n`)
}
