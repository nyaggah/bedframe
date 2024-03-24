import { execa } from 'execa'
import { chdir } from 'node:process'
import { projectInstall } from 'pkg-install'
import { PromptsResponse } from '../prompts'
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
  const { packageManager } = response.development.template.config

  try {
    chdir(projectPath)
    await projectInstall({
      prefer: packageManager.toLowerCase(),
      cwd: projectPath,
    }).then(async () => {
      await execa('git', ['init'])
      await execa('git', ['add', '.'])
      await execa('git', ['commit', '-am', `feat: initial commit. make BED!`])
    })
  } catch (err) {
    console.error(err)
  }
}
