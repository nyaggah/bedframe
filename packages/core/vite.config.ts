import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { nodeExternals } from './node-externals'

// https://vitejs.dev/guide/build.html#library-mode
export default defineConfig({
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bedframe',
      fileName: 'bedframe',
    },
    outDir: 'dist',
    emptyOutDir: true,
    // rollupOptions: {
    //   external: ['unplugin-fonts', 'kolorist', 'url', 'path'],
    //   output: {
    //     globals: {
    //       Unfonts: 'unplugin-fonts',
    //       kolorist: 'kolorist',
    //       // url: 'url',
    //       // path: 'path',
    //     },
    //   },
    // },
  },
  plugins: [
    externalizeDeps(),
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  optimizeDeps: {
    include: ['unplugin-fonts/vite'],
  },
})
