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
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
  },
  plugins: [
    externalizeDeps({
      deps: false,
    }) as any,
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
  ],
})
