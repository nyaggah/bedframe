import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { viteStaticCopy } from 'vite-plugin-static-copy'

export default defineConfig({
  build: {
    lib: {
      entry: {
        bedframe: resolve(__dirname, 'src/index.ts'),
        'create-bedframe': resolve(__dirname, 'src/create-bedframe.ts'),
      },
      formats: ['es'],
    },
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      external: (id) => {
        if (id === '@bedframe/core/scaffold') {
          return false
        }
        if (id.startsWith('.') || id.startsWith('/') || id.startsWith('\0')) {
          return false
        }
        return true
      },
      output: {
        banner: (chunk) => {
          if (
            chunk.name === 'bedframe' ||
            chunk.name === 'create-bedframe'
          ) {
            return '#!/usr/bin/env node\n'
          }
          return ''
        },
      },
    },
  },
  plugins: [
    dts({
      insertTypesEntry: true,
    }),
    viteStaticCopy({
      targets: [
        { src: 'public/stubs', dest: '.' },
      ],
    }),
  ],
})
