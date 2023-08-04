import fs from 'fs-extra'
import { join, resolve } from 'node:path'
import prompts from 'prompts'

export function writeReadMe(response: prompts.Answers<string>): void {
  const { name: projectName, path: projectPath } = response.extension.name
  const readMePath = resolve(join(projectPath, 'README.md'))

  const readMeContent = `
  <div>
  >_<br />
  <br />
  <span style="color:#c792e9">B R O W S E R</span><br />
  <span style="color: #c3e88d">E X T E N S I O N</span><br />
  <span style="color: #8addff">D E V E L O P M E N T</span><br />
  <span style="color: #ffcb6b">F R A M E W O R K</span><br />
</div>

<br />

## ${projectName}

  `

  fs.ensureFile(readMePath)
    .then(() =>
      fs
        .outputFile(readMePath, readMeContent)
        .catch((error) => console.error(error))
    )
    .catch((error) => console.error(error))
}
