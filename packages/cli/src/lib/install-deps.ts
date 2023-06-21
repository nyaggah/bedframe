import { execa } from 'execa'
import { green, dim } from 'kolorist'
import path, { basename } from 'path'
import { projectInstall } from 'pkg-install'
import { PromptsResponse } from './prompts'
import fs from 'fs-extra'

export async function installDependencies(response: PromptsResponse) {
  const projectPath = response.extension.name.path
  const { packageManager } = response.development.template.config
  const packageJson = path.join(projectPath, 'package.json')

  fs.readFile(packageJson, 'utf8', async (err, _data) => {
    if (err) {
      console.error(err)
      return
    }

    await execa('cd', [`${projectPath}`])
      .then(async () => {
        const { stdout } = await projectInstall({
          prefer: packageManager.toLowerCase(),
          cwd: projectPath,
        })
        console.log(stdout)

        console.log(`
        >_
        
        ${green('Your BED is made! 🚀')}
        
        ${dim('1.')} cd ${basename(projectPath)}
        ${dim('2.')} ${packageManager.toLowerCase()} dev ${dim(
          `or ${packageManager.toLowerCase()} dev:all`
        )}
      `)
      })
      .catch(console.error)
  })
}
