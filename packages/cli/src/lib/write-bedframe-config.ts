import fs from 'fs-extra'
import path from 'node:path'
import { Answers } from 'prompts'

/**
 * construct override page url to resolve in vite/bedfframe configs
 *
 * @param {string} overridePage
 * @return {*}  {string}
 */
const getOverridePage = (overridePage: string): string => {
  return `${overridePage}: resolve(src, 'pages', '${overridePage}', 'index.html'),\n`
}

/**
 * create the bedframe.config.ts based on prompt responses
 *
 * @export
 * @param {Answers<string>} response
 * @return {*}  {string}
 *
 */
export function writeBedframeConfig(response: Answers<string>): void {
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

  const fileContent = `${hasTests ? `/// <reference types="vitest" />` : ''}
import { UserConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
${styledComponents ? `import macrosPlugin from 'vite-plugin-babel-macros'` : ''}
import { getCustomFonts, getManifest, BuildConfig } from '@bedframe/core'
import { manifests } from './src/manifests'

export function createBedframeConfig({ command, mode }: BuildConfig): UserConfig {
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
      getCustomFonts([
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
            ? `welcome: resolve(src, 'sidepanels', 'welcome', 'index.html'),\n`
            : ''
        }${
    extensionType === 'devtools'
      ? `devtools: resolve(src, 'pages', 'devtools', 'sidepanel.html'),\n`
      : ''
  }${overridePage !== 'none' ? getOverridePage(overridePage) : ''}
        },
      },
    },
    ${
      hasTests
        ? `test: {
      globals: true,
      setupFiles: ['./vitest/vitest.setup.ts'],
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
}`

  try {
    const rootDir = path.resolve(name.path)
    fs.ensureDir(rootDir).catch(console.error)
    fs.outputFile(
      path.join(rootDir, 'bedframe.config.ts'),
      fileContent + '\n'
    ).catch((error) => console.error(error))
  } catch (error) {
    console.error(error)
  }
}
