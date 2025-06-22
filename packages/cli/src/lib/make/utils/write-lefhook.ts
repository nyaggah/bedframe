import path from 'node:path'
import type prompts from 'prompts'
import { writeFile } from './utils.fs'

export function writeLefthookYml(response: prompts.Answers<string>): void {
  const { packageManager } = response.development.template.config
  const pm = packageManager.toLowerCase()
  const pmRun = pm !== 'yarn' ? `${pm} run` : pm

  const lefthookYml = `
commit-msg:
  parallel: false
  commands:
    commitlint:
      run: ${pm === 'bun' ? 'bunx --bun' : 'npx'} commitlint --edit {1}

pre-commit:
  parallel: true
  commands:
    lint-staged:
      run: ${pmRun} lint-staged

prepare-commit-msg:
  commands:
    commitizen:
      interactive: true
      skip_empty: true
      run: exec < /dev/tty && node_modules/.bin/cz --hook || true

`

  const destinationRoot = path.resolve(response.extension.name.path)
  const destinationLefthookYml = path.join(destinationRoot, 'lefthook.yml')
  writeFile(destinationLefthookYml, lefthookYml).catch(console.error)
}
