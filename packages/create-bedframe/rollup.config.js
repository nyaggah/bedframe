import { nodeResolve } from '@rollup/plugin-node-resolve'
import typescript from '@rollup/plugin-typescript'
import dts from 'rollup-plugin-dts'
import esbuild from 'rollup-plugin-esbuild'
import { string } from 'rollup-plugin-string'

const name = {
  module: `dist/index`,
  definition: `dist/create-bedframe`,
}

const bundle = (config) => ({
  ...config,
  input: 'src/index.ts',
  external: (id) => !/^[./]/.test(id),
  plugins: [nodeResolve(), typescript()],
})

export default [
  bundle({
    plugins: [
      esbuild(),
      string({
        include: `${name.module}.js`,
      }),
    ],
    output: [
      {
        file: `${name.module}.js`,
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
      file: `${name.definition}.d.ts`,
      format: 'es',
      sourcemap: true,
    },
  }),
]
