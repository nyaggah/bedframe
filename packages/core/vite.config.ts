import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { nodeExternals } from './node-externals'

export default defineConfig({
  build: {
    lib: {
      entry: {
        bedframe: resolve(__dirname, 'src/index.ts'),
        scaffold: resolve(__dirname, 'src/scaffold.ts'),
      },
      name: 'bedframe',
      fileName: (_format, entryName) => entryName,
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: (id) => {
        if (id.startsWith('.') || id.startsWith('/') || id.startsWith('\0')) {
          return false
        }
        return true
      },
    },
  },
  plugins: [
    externalizeDeps() as any,
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
  ],
})
