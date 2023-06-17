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
    // override: overridePage,
    // options: optionsPage,
    type,
    name,
  } = response.extension
  const { name: extensionType /* position */ } = type

  const fileContent = `import { getManifest } from '@bedframe/core'
  import Unfonts from 'unplugin-fonts/vite'
  import { crx } from '@crxjs/vite-plugin'
  import { resolve } from 'node:path'
  import { manifests } from './src/manifests'
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  export function bedframeConfig(command?: any, mode?: any) {
    const root = resolve(__dirname, './src')
    return {
      root,
      manifest: crx({
        manifest: getManifest({ command, mode }, manifests),
      }),
      build: {
        outDir: resolve(__dirname, 'dist', mode), // 'dist/chrome', 'dist/edge', etc
        emptyOutDir: true,
        pages: {
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
          reporter: ['text', 'json', 'html'],
        },
        watch: false,
      },`
          : ''
      }
      resolve: {
        alias: {
          '@': resolve(__dirname, './src'),
        },
      },
      fonts: getCustomFonts([
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
    }
  }
  
  // - - - - - - - - - - - - - - - - - -
  
  type FontWeight = {
    [key: string]: number
  }
  
  // extend or use directly from 'CustomFontFamily'
  // from unplugin-fonts
  // so object can accept all options
  // ^^^ don't cripple plugin functionality, boi boi!
  type CustomFontOptions = {
    name: string
    local: string | string[]
    src: string | string[]
    weights?: FontWeight
  }
  
  function getCustomFonts(fonts: CustomFontOptions[]) {
    return Unfonts({
      custom: {
        families: fonts.map((f) => {
          const fontWeights = f.weights
          return {
            name: f.name,
            local: f.local,
            src: f.src,
            transform(font) {
              if (font.basename in fontWeights) {
                font.weight = fontWeights[font.basename]
              }
              return font
            },
          }
        }),
      },
    })
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
