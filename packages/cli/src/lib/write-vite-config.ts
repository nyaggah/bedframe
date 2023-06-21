import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

export function viteConfig(response: prompts.Answers<string>): string {
  const { tests: hasTests } = response.development.template.config
  return `import { defineConfig } from 'vite'
import { createBedframeConfig } from './bedframe.config'

export default defineConfig(({ command, mode }) => {
  const config = createBedframeConfig(command, mode)

  return {
    root: config.root,
    resolve: config.resolve,
    plugins: config.plugins,
    build: config.build,
    ${hasTests ? `test: config.test,` : ''}
  }
})\n`
}

export function writeViteConfig(response: prompts.Answers<string>): void {
  const rootDir = path.resolve(response.extension.name.path)
  const viteConfigPath = path.resolve(path.join(rootDir, `vite.config.ts`))
  fs.ensureFile(viteConfigPath)
    .then(() =>
      fs
        .outputFile(viteConfigPath, viteConfig(response) + '\n')
        .catch((error) => console.error(error))
    )
    .catch((error) => console.error(error))
}
