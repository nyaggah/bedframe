import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { nodeExternals } from './node-externals'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bedframe',
      fileName: 'bedframe',
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@crxjs/vite-plugin'],
    },
  },
  plugins: [
    externalizeDeps(),
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
  ],
})
