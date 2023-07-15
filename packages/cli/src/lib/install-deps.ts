import { execa } from 'execa'
import { green, dim } from 'kolorist'
import path, { basename } from 'path'
import { projectInstall } from 'pkg-install'
import { PromptsResponse } from './prompts'
import fs from 'fs-extra'

export function installDependencies(response: PromptsResponse): void {
  const projectPath = response.extension.name.path
  const { packageManager, git: initGit } = response.development.template.config
  const packageJson = path.join(projectPath, 'package.json')

  fs.readFile(packageJson, 'utf8', async (err, _data) => {
    if (err) {
      console.error(err)
      return
    }

    execa('cd', [`${projectPath}`])
      .then(async () => {
        await projectInstall({
          prefer: packageManager.toLowerCase(),
          cwd: projectPath,
        })
          .then((installation) => {
            console.log('installation...', installation)
          })
          .finally(() => {
            if (!initGit) {
              console.log(`
          >_
          
          ${green('Your BED is made! 🚀')}
          
          ${dim('1.')} cd ${basename(projectPath)}
          ${dim('2.')} ${packageManager.toLowerCase()} dev ${dim(
                `or ${packageManager.toLowerCase()} dev:all`
              )}
        `)
            }
          })
      })
      .catch(console.error)
  })
}
