import { execa } from 'execa'
import { chdir, cwd } from 'node:process'
import { PromptsResponse } from './prompts'

export async function initializeGitProject(
  response: PromptsResponse
): Promise<void> {
  const projectPath = response.extension.name.path ?? cwd()
  const projectName = response.extension.name.name ?? 'bedframe-project'

  try {
    chdir(projectPath)
    await execa('git', ['init'])
    await execa('git', ['add', '.'])
    // await execa('git', [
    //   'commit',
    //   '-am',
    //   `feat(${projectName}): initial commit. configure BEDframe`,
    // ])
    const commitMessage = `feat(${projectName}): initial commit. configure bedframe`

    const childProcess = execa('git', ['commit', '-am', commitMessage])

    if (childProcess.stdout) {
      childProcess.stdout.on('data', (data) => {
        // Handle the output data here
        console.log(data)
      })
    }

    // Wait for the child process to complete
    await childProcess
  } catch (error) {
    console.error(error)
  }
  console.groupEnd()
}
