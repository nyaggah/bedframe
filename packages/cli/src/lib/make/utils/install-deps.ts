import { execa } from 'execa'
import type { PromptsResponse } from '../prompts'
/**
 * install dependencies, initialize git and
 * make first commit
 *
 * todo: the install should be separate from the git
 *
 * @export
 * @param {PromptsResponse} response
 * @return {*}  {Promise<void>}
 */
export async function installDependencies(
  response: PromptsResponse,
): Promise<void> {
  const { path: projectPath } = response.extension.name
  const { packageManager, lintFormat } = response.development.template.config

  try {
    if (packageManager.toLowerCase() === 'bun') {
      await execa('bun', ['install'], {
        cwd: projectPath,
      }).then(async () => {
        if (lintFormat) {
          await execa('bun', ['run', 'lint:format'], {
            cwd: projectPath,
          })
        }
      })
    } else {
      const pm = packageManager.toLowerCase()
      // const pmRun = pm !== 'yarn' ? `${pm} run` : pm
      await execa(pm, ['install', '--force'], {
        cwd: projectPath,
      }).then(async () => {
        if (lintFormat) {
          await execa(pm, ['run', 'lint:format'], {
            cwd: projectPath,
          })
        }
      })
    }
  } catch (err) {
    console.error(err)
  }
}
