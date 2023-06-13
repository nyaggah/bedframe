import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

export function viteConfig(response: prompts.Answers<string>): string {
  const styledComponents =
    response.development.template.config.style === 'Styled Components'

  return `import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import { crx } from '@crxjs/vite-plugin'
import react from '@vitejs/plugin-react'
${styledComponents ? `import macrosPlugin from 'vite-plugin-babel-macros'` : ''}
import { getManifest } from '@bedframe/core'
import { manifest } from './src/manifest'

export default defineConfig(async ({ command, mode }) => {
  return {
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      react(),
      crx({
        manifest: getManifest({ command, mode }, manifest),
      }),
      ${styledComponents ? 'macrosPlugin()' : ''},
    ],
    build: {
      outDir: \`dist/\${mode}\`,
    },
  }
})

`
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
