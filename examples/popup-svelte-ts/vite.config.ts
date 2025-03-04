import { resolve } from 'node:path'
import { type FontFamily, getFonts, getManifest } from '@bedframe/core'
import { svelte } from '@sveltejs/vite-plugin-svelte'
import { defineConfig } from 'vite'
import bedframeConfig from './src/bed.config/bedframe.config'

const { manifest, pages } = bedframeConfig.extension
const {
  style: { fonts },
  tests,
} = bedframeConfig.development.template.config

export default defineConfig(({ command, mode }) => {
  return {
    root: resolve(__dirname, './src'),
    publicDir: resolve(__dirname, './public'),
    resolve: {
      alias: {
        '@': resolve(__dirname, './src'),
      },
    },
    plugins: [
      getManifest({ command, mode }, manifest, {
        browser: mode,
      }),
      getFonts(fonts as FontFamily[]),
      svelte(),
    ],
    build: {
      outDir: resolve(__dirname, 'dist', mode),
      emptyOutDir: true,
      rollupOptions: {
        input: pages,
      },
    },
    test: tests,
    legacy: {
      skipWebSocketTokenCheck: true,
    },
    // Temporary workaround for upstream (crxjs) issue:
    // change to Vite CORS policies in the dev server
    //
    // ^^^ https://github.com/crxjs/chrome-extension-tools/issues/971#issuecomment-2605520184
    //     https://github.com/vitejs/vite/blob/9654348258eaa0883171533a2b74b4e2825f5fb6/packages/vite/src/node/config.ts#L535
  }
})
