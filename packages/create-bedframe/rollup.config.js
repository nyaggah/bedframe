import typescript from '@rollup/plugin-typescript'
import { nodeResolve } from '@rollup/plugin-node-resolve'
import esbuild from 'rollup-plugin-esbuild'
import dts from 'rollup-plugin-dts'
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
      string({
        include: `${name.module}.cjs`,
      }),
    ],
    output: [
      {
        file: `${name.module}.cjs`,
        format: 'cjs',
        sourcemap: true,
        banner: '#!/usr/bin/env node\n',
      },
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
