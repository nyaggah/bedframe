/// <reference types="vitest" />
import { UserConfig } from 'vite'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import macrosPlugin from 'vite-plugin-babel-macros'
import { getCustomFonts } from './get-custom-fonts'
import { getManifest } from './get-manifest'
import { BuildConfig, BuildTarget } from './types'

export function createBedframeConfig(
  { command, mode = 'chrome' }: BuildConfig,
  manifests: BuildTarget[]
): UserConfig {
  const src = resolve(__dirname, '..') // `src`
  const outDir = resolve(src, '..', 'dist', mode) // 'dist/chrome', 'dist/edge', etc

  return {
    root: src,
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
          src: './src/assets/fonts/inter/*.ttf',
          weights: {
            'Inter-Regular': 400,
            'Inter-SemiBold': 600,
            'Inter-Bold': 700,
            'Inter-ExtraBold': 800,
          },
        },
      ]),
      react(),
      macrosPlugin(),
    ],
    build: {
      outDir,
      emptyOutDir: true,
      rollupOptions: {
        input: {
          welcome: resolve(src, 'sidepanels', 'welcome', 'index.html'),
          main: resolve(src, 'sidepanels', 'main', 'index.html'),
          newtab: resolve(src, 'pages', 'newtab', 'index.html'),
        },
      },
    },
    test: {
      globals: true,
      setupFiles: ['./config/vitest.config.ts'],
      environment: 'jsdom',
      coverage: {
        provider: 'istanbul',
        reporter: ['text', 'json', 'html'],
      },
      watch: false,
    },
  }
}
