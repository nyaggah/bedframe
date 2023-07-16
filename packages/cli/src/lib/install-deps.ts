import { execa } from 'execa'
import { chdir } from 'node:process'
import { projectInstall } from 'pkg-install'
import { PromptsResponse } from './prompts'

export async function installDependencies(
  response: PromptsResponse
): Promise<void> {
  const projectPath = response.extension.name.path
  const { packageManager } = response.development.template.config
  const projectName = response.extension.name.name ?? 'bedframe-project'

  try {
    chdir(projectPath)
    await execa('git', ['init'])
    await projectInstall({
      prefer: packageManager.toLowerCase(),
      cwd: projectPath,
    }).then(async () => {
      await execa('git', ['add', '.']).then(async () => {
        await execa('git', [
          'commit',
          '-am',
          `feat(${projectName}): initial commit. configure bedframe`,
        ])
      })
    })
  } catch (err) {
    console.error(err)
  }
}
