import { execa } from 'execa'
import { chdir, cwd } from 'node:process'
import { PromptsResponse } from './prompts'

export async function initializeGitProject(response: PromptsResponse) {
  const projectPath = response.extension.name.path ?? cwd()
  const projectName = response.extension.name.name ?? 'bedframe-project'

  try {
    chdir(projectPath)
    await execa('git', ['init'])
    await execa('git', ['add', '.'])

    const commitMessage = `feat(${projectName}): initial commit. configure bedframe`
    const childProcess = execa('git', ['commit', '-am', commitMessage])

    // if (childProcess.stdout) {
    //   console.log('childProcess.stdout', childProcess.stdout)
    //   childProcess.stdout.on('data', (data) => {
    //     // Handle the output data here
    //     console.log(data)
    //   })
    // }

    // console.log(childProcess)
    // Wait for the child process to complete
    // await childProcess
    return await childProcess
  } catch (error) {
    console.error(error)
  }
  console.groupEnd()
}
