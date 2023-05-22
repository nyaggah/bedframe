import typescript from '@rollup/plugin-typescript'
import esbuild from 'rollup-plugin-esbuild'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import path, { resolve } from 'node:path'
import url from 'node:url'

import { string } from 'rollup-plugin-string'

const __dirname = path.dirname(url.fileURLToPath(import.meta.url))
const name = `build/index`

const bundle = (config) => ({
  ...config,
  input: resolve(__dirname, 'src/index.ts'),
  external: (id) => !/^[./]/.test(id),
  plugins: [
    typescript(),
    copy({
      targets: [{ src: 'public/stubs', dest: 'build' }],
    }),
  ],
})

export default [
  bundle({
    plugins: [
      esbuild(),
      string({
        include: `${name}.js`,
      }),
      string({
        include: `${name}.cjs`,
      }),
    ],
    output: [
      {
        file: `${name}.cjs`,
        format: 'cjs',
        sourcemap: true,
        banner: '#!/usr/bin/env node\n',
      },
      {
        file: `${name}.js`,
        format: 'es',
        sourcemap: true,
        banner: '#!/usr/bin/env node\n',
      },
    ],
  }),
  bundle({
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
    },
  }),
]
