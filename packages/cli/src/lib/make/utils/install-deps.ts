import { chdir } from 'node:process'
import { execa } from 'execa'
import { projectInstall } from 'pkg-install'
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
    chdir(projectPath)
    if (packageManager.toLowerCase() === 'bun') {
      await execa('bun', ['install']).then(async () => {
        if (lintFormat) {
          await execa('bun', ['run', 'lint:format'])
        }

        await execa('git', ['init'])
        await execa('git', ['add', '.'])
        await execa('git', ['commit', '-am', 'feat: initial commit. make BED!'])
      })
    } else {
      await projectInstall({
        prefer: packageManager.toLowerCase(),
        cwd: projectPath,
      }).then(async () => {
        if (lintFormat) {
          await execa(packageManager, ['run', 'lint:format'])
        }
        await execa('git', ['init'])
        await execa('git', ['add', '.'])
        await execa('git', ['commit', '-am', 'feat: initial commit. make BED!'])
      })
    }
  } catch (err) {
    console.error(err)
  }
}
