import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { getFonts, getManifest } from '@bedframe/core'
import bedframe from './src/_config/bedframe.config'

const { manifest, pages } = bedframe.extension
const {
  style: { fonts },
  tests,
} = bedframe.development.template.config

// https://vitejs.dev/config/
export default defineConfig(({ command, mode }) => {
  return {
    root: 'src',
    publicDir: '../public',
    resolve: {
      alias: {
        '@': 'src',
      },
    },
    plugins: [
      vue(),
      getManifest({ command, mode }, manifest, {
        browser: mode,
      }),
      getFonts(fonts as any[]),
    ],
    build: {
      outDir: `${__dirname}/dist/${mode}`,
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
