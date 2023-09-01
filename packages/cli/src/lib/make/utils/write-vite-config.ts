import path from 'node:path'
import prompts from 'prompts'
import { ensureFile, outputFile } from './utils.fs'

/**
 * construct override page url to resolve in vite/bedfframe configs
 *
 * @param {string} overridePage
 * @return {*}  {string}
 */
const getOverridePage = (overridePage: string): string => {
  return `${overridePage}: resolve(src, 'pages', '${overridePage}', 'index.html'),\n`
}

export function viteConfig(response: prompts.Answers<string>): string {
  const { tests: hasTests } = response.development.template.config
  const {
    override: overridePage,
    // options: optionsPage,
    type,
    name,
  } = response.extension
  const { name: extensionType /* position */ } = type
  const styledComponents =
    response.development.template.config.style === 'Styled Components'

  return `import { getFonts, getManifest } from '@bedframe/core'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
${styledComponents ? `import macrosPlugin from 'vite-plugin-babel-macros'` : ''}
import { fonts, manifest as manifests, pages${
    hasTests ? `, tests` : ''
  } } from './src/_config/bedframe.config'

export default defineConfig(({ command, mode }) => {
  return {
    root: resolve(__dirname, './src'),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      getManifest({ command, mode }, manifests),
      getFonts(fonts),
      react(),
      ${styledComponents ? `macrosPlugin(),` : ''}
    ],
    build: {
      outDir: resolve(__dirname, 'dist', mode),
      emptyOutDir: true,
      rollupOptions: {
        input: pages,
      },
    },
    ${hasTests ? `test: tests,` : ''}
  }
})
`
}

export function writeViteConfig(response: prompts.Answers<string>): void {
  const rootDir = path.resolve(response.extension.name.path)
  const viteConfigPath = path.resolve(path.join(rootDir, `vite.config.ts`))
  ensureFile(viteConfigPath)
    .then(() =>
      outputFile(viteConfigPath, viteConfig(response) + '\n').catch((error) =>
        console.error(error),
      ),
    )
    .catch((error) => console.error(error))
}
