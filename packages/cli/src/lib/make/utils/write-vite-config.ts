import path from 'node:path'
import type prompts from 'prompts'
import { ensureWriteFile, outputFile } from './utils.fs'

export function viteConfig(response: prompts.Answers<string>): string {
  const { tests: hasTests } = response.development.template.config

  return `import { getFonts, getManifest } from '@bedframe/core'
import tailwindcss from '@tailwindcss/vite'
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
      getManifest({ command, mode }, manifest, {
        browser: mode
      }),
      getFonts(fonts!),
      react(),
      tailwindcss(),
    ],
    build: {
      outDir: resolve(__dirname, 'dist', mode),
      emptyOutDir: true,
      rollupOptions: {
        input: pages,
      },
    },
    ${hasTests ? 'test: tests,' : ''}
    server: {
      cors: {
        origin: [
          /chrome-extension:\\/\\//,
        ],
      },
    },
  }
})
`
}

export function writeViteConfig(response: prompts.Answers<string>): void {
  const rootDir = path.resolve(response.extension.name.path)
  const viteConfigPath = path.resolve(path.join(rootDir, 'vite.config.ts'))
  ensureWriteFile(viteConfigPath)
    .then(() =>
      outputFile(viteConfigPath, `${viteConfig(response)}\n`).catch((error) =>
        console.error(error),
      ),
    )
    .catch(console.error)
}
