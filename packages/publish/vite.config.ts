import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => {
  return {
    build: {
      lib: {
        entry: resolve(__dirname, 'src/index.ts'),
        name: 'index',
        fileName: 'index',
        formats: ['es', 'cjs'],
      },
      emptyOutDir: true,
    },
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
  }
})
