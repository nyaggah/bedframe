import { resolve } from 'node:path'
import { defineConfig } from 'vite'
// import dts from 'vite-plugin-dts'

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'create-bedframe',
      fileName: 'create-bedframe',
    },
    outDir: 'dist',
  },
  plugins: [
    // dts({
    //   insertTypesEntry: true,
    // }),
  ],
})
