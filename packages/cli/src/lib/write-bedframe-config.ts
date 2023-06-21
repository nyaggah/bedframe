import fs from 'fs-extra'
import path from 'node:path'
import { Answers } from 'prompts'

// might need to return a function ??
// then takes in the {command,mode} ??
//
// ^^^ why ??
// eventually all this will be a
// vite / rollup plugin. prolly more efficient +
// more type safe + extend utilzed plugins'
// functionality vs potentially crippling

const getOverridePage = (overridePage: string): string => {
  return `${overridePage}: resolve(root, 'pages', '${overridePage}', 'index.html'),`
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

  const fileContent = `import { resolve } from 'node:path'
  import { crx } from '@crxjs/vite-plugin'
  import react from '@vitejs/plugin-react'
  ${
    styledComponents
      ? `import macrosPlugin from 'vite-plugin-babel-macros'`
      : ''
  }
  import { getCustomFonts, getManifest } from '@bedframe/core'
  import { manifests } from './src/manifests'
  
  export function createBedframeConfig(command?: any, mode?: any) {
    const root = resolve(__dirname, './src')
  
    return  {
        root,
        resolve: {
          alias: {
            '@': resolve(__dirname, './src'),
          },
        },
        plugins: [
          react(),
          crx({
            manifest: getManifest({ command, mode }, manifests),
          }),
          ${styledComponents ? 'macrosPlugin(),' : ''},
          getCustomFonts([
            {
              name: 'Inter',
              local: 'Inter',
              src: './src/assets/fonts/inter/*.ttf',
              weights: {
                'Inter-Regular': 400,
                'Inter-SemiBold': 600,
                'Inter-Bold': 700,
                'Inter-ExtraBold': 800,
              },
            },
          ]),
        ],
        build: {
          outDir: resolve(__dirname, 'dist', mode), // 'dist/chrome', 'dist/edge', etc
          emptyOutDir: true,
          rollupOptions: {
            input: {
              ${
                extensionType === 'sidepanel'
                  ? `welcome: resolve(root, 'sidepanels', 'welcome', 'index.html'),
              main: resolve(root, 'sidepanels', 'main', 'index.html'),`
                  : ''
              }
              ${
                extensionType === 'devtools'
                  ? `devtools: resolve(root, 'pages', 'devtools', 'sidepanel.html'),`
                  : ''
              }
              ${overridePage !== 'none' ? getOverridePage(overridePage) : ''}
            },
            },
          },
        },
        ${
          hasTests
            ? `test: {
          globals: true,
          setupFiles: ['./vitest/vitest.setup.ts'],
          environment: 'jsdom', // 'jsdom' | 'edge-runtime' | 'happy-dom' | 'jsdom'
          coverage: {
            provider: 'istanbul', // 'c8' | 'custom' | 'istanbul'
            reporter: ['default', 'text', 'json', 'html'],
          },
          watch: false,
        },
        `
            : ''
        }
  }
  `

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
