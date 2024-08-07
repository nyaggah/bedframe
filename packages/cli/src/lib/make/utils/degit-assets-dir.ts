import path from 'node:path'
import type { AnyCase, PackageManager } from '@bedframe/core'
import { execa } from 'execa'
import { ensureDir } from './utils.fs'

/**
 *
 * Degit assets directory
 * removing assets (icons, fonts, etc) from cli
 * to reduce package size
 *
 * @export
 * @param {string} projectPath
 * @param {AnyCase<PackageManager>} [packageManager='npm']
 */
export async function getAssetsDir(
  projectPath: string,
  packageManager: AnyCase<PackageManager> = 'npm',
) {
  const srcDir = path.join(projectPath, 'src')
  const assetsDir = path.join(projectPath, 'src', 'assets')
  ensureDir(srcDir)
  const pm = packageManager.toLowerCase()
  const repo = 'https://github.com/nyaggah/bedframe/assets'
  const dest = assetsDir

  let command: string
  let args: string[]

  switch (pm) {
    case 'yarn':
      command = 'yarn'
      args = ['dlx', 'degit', repo, dest]
      break
    case 'bun':
      command = 'bunx'
      args = ['degit', repo, dest]
      break
    case 'npm':
      command = 'npx'
      args = ['degit', repo, dest]
      break
    case 'pnpm':
      command = 'pnpm'
      args = ['dlx', 'degit', repo, dest]
      break
    default:
      throw new Error(`Unknown package manager: ${pm}`)
  }

  try {
    const { stdout } = await execa(command, args)
    console.log(stdout)
    // biome-ignore lint:  @typescript-eslint/no-explicit-any
  } catch (error: any) {
    console.error(`Failed to run degit command: ${error.message}`)
  }
}
