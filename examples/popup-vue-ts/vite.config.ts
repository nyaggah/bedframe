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
  }
})
