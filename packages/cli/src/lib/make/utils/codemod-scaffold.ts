import { promises as fs } from 'node:fs'
import path from 'node:path'
import url from 'node:url'
import { execa } from 'execa'
import type { PromptsResponse } from '../prompts'
import { ensureWriteFile, outputFile } from './utils.fs'

const GITIGNORE_ENTRIES = [
  '',
  '# Tests',
  'coverage',
  '',
  '# local env files',
  '.env',
  '.env*',
  '.env.local',
  '.env.development',
  '.env.production',
]

async function ensureEnvStub(projectPath: string): Promise<void> {
  const envPath = path.join(projectPath, '.env')
  try {
    await fs.access(envPath)
    return
  } catch {
    const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
    const envStubPath = path.resolve(path.join(__dirname, 'stubs', 'base', '__env'))
    const envContent = await fs.readFile(envStubPath, 'utf8')
    await ensureWriteFile(envPath)
    await outputFile(envPath, envContent)
  }
}

async function mergeGitignore(projectPath: string): Promise<void> {
  const gitignorePath = path.join(projectPath, '.gitignore')
  let content = ''
  try {
    content = await fs.readFile(gitignorePath, 'utf8')
  } catch {
    // create from scratch below
  }

  const lines = new Set(content.split('\n'))
  for (const entry of GITIGNORE_ENTRIES) {
    if (!lines.has(entry)) {
      content += `${content.endsWith('\n') || content.length === 0 ? '' : '\n'}${entry}`
      lines.add(entry)
    }
  }

  await fs.writeFile(gitignorePath, `${content.replace(/\n+$/, '')}\n`)
}

export async function runScaffoldCodemods(
  response: PromptsResponse,
): Promise<void> {
  const { path: projectPath } = response.extension.name
  const { packageManager, lintFormat } = response.development.template.config

  await ensureEnvStub(projectPath)
  await mergeGitignore(projectPath)

  if (response.development.config.installDeps && lintFormat) {
    const pm = packageManager.toLowerCase()
    await execa(pm, ['run', 'fix'], {
      cwd: projectPath,
    })
  }
}
