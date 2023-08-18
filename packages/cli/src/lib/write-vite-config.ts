import fs from 'fs-extra'
import path from 'node:path'
import prompts from 'prompts'

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
import { manifests } from './src/manifests'

export default defineConfig(({ command, mode }) => {
  const root = __dirname
  const src = resolve(root, './src')
  const outDir = resolve(root, 'dist', mode)

  return {
    root,
    resolve: {
      alias: {
        '@': src,
      },
    },
    plugins: [
      getManifest({ command, mode }, manifests),
      getFonts([
        {
          name: 'Inter',
          local: 'Inter',
          src: './assets/fonts/inter/*.ttf',
          weights: {
            'Inter-Regular': 400,
            'Inter-SemiBold': 600,
            'Inter-Bold': 700,
            'Inter-ExtraBold': 800,
          },
        },
      ]),
      react(),
      ${styledComponents ? `macrosPlugin(),` : ''}
    ],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {${
          extensionType === 'sidepanel'
            ? `welcome: resolve(src, 'sidepanels', 'welcome', 'index.html'),
            main: resolve(src, 'sidepanels', 'main', 'index.html'),`
            : ''
        }${
          extensionType === 'devtools'
            ? `devtools: resolve(src, 'pages', 'devtools', 'panel.html'),`
            : ''
        }${overridePage !== 'none' ? getOverridePage(overridePage) : ''}
        },
      },
    },
    ${
      hasTests
        ? `test: {
      globals: true,
      setupFiles: ['./src/_config/tests.config.ts'],
      environment: 'jsdom',
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
      },
      watch: false,
    },`
        : ''
    }
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
        .catch((error) => console.error(error)),
    )
    .catch((error) => console.error(error))
}
