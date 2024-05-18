import { chdir } from 'node:process'
import { execa } from 'execa'
import type { PromptsResponse } from '../prompts'

export async function initializeGitProject(
  response: PromptsResponse,
): Promise<void> {
  const { name: projectName, path: projectPath } = response.extension.name

  try {
    chdir(projectPath)
    await execa('git', ['init'])
    await execa('git', ['add', '.'])
    await execa('git', [
      'commit',
      '-am',
      `feat(${projectName}): initial commit. configure BEDframe`,
    ])
    const commitMessage = `feat(${projectName}): initial commit. configure bedframe`
    const childProcess = execa('git', ['commit', '-am', commitMessage])

    console.log(childProcess)

    await childProcess
  } catch (error) {
    console.error(error)
  }
  console.groupEnd()
}
