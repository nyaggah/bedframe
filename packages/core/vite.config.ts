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
      external: [
        'fs',
        'path',
        'url',
        'constants',
        'os',
        'util',
        'stream',
        'events',
      ],
      output: {
        globals: {
          // kolorist: 'kolorist',
          '@crxjs/vite-plugin': '@crxjs/vite-plugin',
          fs: 'fs',
          path: 'node:path',
          url: 'node:url',
          constants: 'node:constants',
          os: 'node:os',
          util: 'node:util',
          stream: 'node:stream',
          events: 'node:events',
        },
      },
    },
  },
  plugins: [
    externalizeDeps({
      deps: true,
    }),
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
  ],
  // optimizeDeps: {
  //   include: ['@crxjs/vite-plugin'],
  // },
})
