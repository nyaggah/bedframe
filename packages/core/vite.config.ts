import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { nodeExternals } from './node-externals'

export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bedframe',
      fileName: 'bedframe',
      formats: ['es', 'cjs'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: ['@crxjs/vite-plugin'],
    },
  },
  plugins: [
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  // optimizeDeps: {
  //   include: ['@crxjs/vite-plugin'],
  // },
})
