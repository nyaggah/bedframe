// https://github.com/vitejs/vite/discussions/6198#discussioncomment-3621433
import type { Plugin } from 'vite'
import { externals } from 'rollup-plugin-node-externals'

export function nodeExternals(): Plugin {
  return {
    enforce: 'pre',
    ...externals(),
  }
}
