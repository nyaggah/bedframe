import { execSync } from 'node:child_process'
import path, { resolve } from 'node:path'
import url from 'node:url'

/**
 * Standalone `@bedframe/cli` Make command
 * exposes the `create-bedfame` executable
 * Lets you run perform undelying `npm init bedframe`
 *
 * ```bash
 * npx create bedframe
 * ```
 *
 */
export function createBedframeCommand(): void {
  const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
  const bedframeScriptPath = resolve(__dirname, './bedframe.js')

  try {
    execSync(`node ${bedframeScriptPath} make`, { stdio: 'inherit' })
  } catch (error) {
    console.error('Failed to execute [bedframe make] command:', error)
  }
}

createBedframeCommand()
