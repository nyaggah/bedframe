import { getFonts, getManifest } from '@bedframe/core'
import react from '@vitejs/plugin-react'
import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import bedframeConfig from './src/_config/bedframe.config'

const { manifest, pages } = bedframeConfig.extension
const {
  style: { fonts },
  tests,
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
        browser: mode,
      }),
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
    test: tests,
  }
})
