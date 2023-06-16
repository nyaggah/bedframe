// might need to return a function ??
// then takes in the {command,mode} ??
//
// ^^^ why ??
// eventually all this will be a
// vite / rollup plugin. prolly more efficient +
// more type safe + extend utilzed plugins'
// functionality vs potentially crippling

/*
import { getManifest } from '@bedframe/core'
import Unfonts from 'unplugin-fonts/vite'
import { crx } from '@crxjs/vite-plugin'
import { resolve } from 'node:path'
import { manifests } from './src/manifests'

export function bedframeConfig(command?: any, mode?: any) {
  const root = resolve(__dirname, './src')

  return {
    root,
    manifest: crx({
      manifest: getManifest({ command, mode }, manifests),
    }),
    build: {
      outDir: `dist/${mode}`, // 'dist/chrome', 'dist/edge', etc
      emptyOutDir: true,
      pages: {
        welcome: resolve(root, 'sidepanels', 'welcome', 'index.html'),
        main: resolve(root, 'sidepanels', 'main', 'index.html'),
        options: resolve(root, 'pages', 'options', 'index.html'),
      },
    },
    test: {
      globals: true,
      setupFiles: ['./vitest/vitest.setup.ts'],
      environment: 'jsdom', // 'jsdom' | 'edge-runtime' | 'happy-dom' | 'jsdom'
      coverage: {
        provider: 'istanbul', // 'c8' | 'custom' | 'istanbul'
        reporter: ['text', 'json', 'html'],
      },
      watch: false,
    },
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

// extend or use directly from `CustomFontFamily`
// from unplugin-fonts
// so object can accept all options
// ^^^ don't cripple plugin functionality, boi boi!
type CustomFontOptions = {
  name: string
  local: string | string[]
  src: string | string[]
  weights?: FontWeight
}

export function getCustomFonts(fonts: CustomFontOptions[]) {
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

*/
