import { resolve } from 'node:path'
import { bedframe } from '@bedframe/core'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import bedframeConfig from './src/bed.config/bedframe.config'

const { manifest, pages } = bedframeConfig.extension
const { tests } = bedframeConfig.development.template.config

export default defineConfig({
  root: resolve(__dirname, './src'),
  publicDir: resolve(__dirname, './public'),
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  plugins: [
    bedframe(manifest),
    svelte(),
  ],
  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: pages,
    },
  },
  test: tests,
  legacy: {
    skipWebSocketTokenCheck: true,
  },
})
