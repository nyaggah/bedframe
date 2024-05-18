import { nodeExternals as externals } from 'rollup-plugin-node-externals'
// https://github.com/vitejs/vite/discussions/6198#discussioncomment-3621433
import type { Plugin } from 'vite'

export function nodeExternals(): Plugin {
  return {
    enforce: 'pre',
    ...externals(),
  }
}
