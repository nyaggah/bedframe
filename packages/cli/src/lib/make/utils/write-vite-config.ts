import path from 'node:path'
import type prompts from 'prompts'
import { ensureFile, outputFile } from './utils.fs'

export function viteConfig(response: prompts.Answers<string>): string {
  const { tests: hasTests } = response.development.template.config
  const { type } = response.extension

  return `import { getFonts, getManifest } from '@bedframe/core'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import bedframeConfig from "./src/_config/bedframe.config"

const { manifest, pages } = bedframeConfig.extension
const {
	style: { fonts },
  ${hasTests ? 'tests,' : ''}
} = bedframeConfig.development.template.config  

export default defineConfig(({ command, mode }) => {
  return {
    root: resolve(__dirname, './src'),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      getManifest({ command, mode }, manifest),
      getFonts(fonts),
      react(),
    ],
    build: {
      outDir: resolve(__dirname, 'dist', mode),
      emptyOutDir: true,
      rollupOptions: {
        input: pages,
      },
    },
    ${hasTests ? 'test: tests,' : ''}
  }
})
`
}

export function writeViteConfig(response: prompts.Answers<string>): void {
  const rootDir = path.resolve(response.extension.name.path)
  const viteConfigPath = path.resolve(path.join(rootDir, 'vite.config.ts'))
  ensureFile(viteConfigPath)
    .then(() =>
      outputFile(viteConfigPath, `${viteConfig(response)}\n`).catch((error) =>
        console.error(error),
      ),
    )
    .catch((error) => console.error(error))
}
