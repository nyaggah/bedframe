import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import copy from 'rollup-plugin-copy'
import dts from 'rollup-plugin-dts'
import { string } from 'rollup-plugin-string'
import json from '@rollup/plugin-json'

const name = `build/index`

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
  plugins: [
    nodeResolve(),
    typescript(),
    json(),
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
        respectExternal: false,
      }),
    ],
    output: {
      file: `${name}.d.ts`,
      format: 'es',
      sourcemap: true,
    },
  }),
]
