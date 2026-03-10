import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { bedframe, getFonts } from '@bedframe/core'
import bedframeConfig from './src/_config/bedframe.config'

const { manifest, pages } = bedframeConfig.extension
const {
  style: { fonts },
  tests,
} = bedframeConfig.development.template.config

export default defineConfig({
  root: 'src',
  publicDir: '../public',
  resolve: {
    alias: {
      '@': 'src',
    },
  },
  plugins: [
    vue(),
    bedframe(manifest),
    getFonts(fonts as any[]),
  ],
  build: {
    outDir: `${__dirname}/dist`,
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
