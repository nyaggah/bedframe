// https://github.com/vitejs/vite/discussions/6198#discussioncomment-3621433
import { Plugin } from 'vite'
// import { createRequire } from 'module'

// following 2 lines are because the types from `rollup-plugin-node-externals` seems not working
// const require = createRequire(import.meta.url)
import { externals } from 'rollup-plugin-node-externals'

export function nodeExternals(): Plugin {
  return {
    enforce: 'pre',
    ...externals(),
  }
}
