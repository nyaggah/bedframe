import { resolve } from 'node:path'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { externalizeDeps } from 'vite-plugin-externalize-deps'
import { nodeExternals } from './node-externals'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'

export default defineConfig({
  build: {
    // minify: false,
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'bedframe',
      fileName: 'bedframe',
      formats: ['es'],
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
        'fsevents',
        'rollup',
      ],
      output: {
        globals: {
          rollup: 'rollup',
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
      deps: false,
      except: ['@types/node', '@types/chrome', '@crxjs/vite-plugin'],
    }),
    nodeExternals(),
    dts({
      insertTypesEntry: true,
    }),
    // nodePolyfills(),
  ],
  optimizeDeps: {
    include: ['@crxjs/vite-plugin'],
  },
})

// import { join, resolve } from 'node:path'
// import { nodePolyfills } from 'vite-plugin-node-polyfills'
// import { defineConfig } from 'vite'
// import dts from 'vite-plugin-dts'
// import { externalizeDeps } from 'vite-plugin-externalize-deps'
// import { nodeExternals } from './node-externals'

// export default defineConfig({
//   build: {
//     lib: {
//       entry: resolve(__dirname, 'src/index.ts'),
//       name: 'bedframe',
//       fileName: 'bedframe',
//     },
//     outDir: 'dist',
//     emptyOutDir: true,
//     rollupOptions: {
//       external: [
//         // 'fs',
//         // 'path',
//         // 'url',
//         // 'constants',
//         // 'os',
//         // 'util',
//         // 'stream',
//         // 'events',
//         'fsevents',
//         'rollup',
//       ],
//       // output: {
//       //   globals: {
//       //     // kolorist: 'kolorist',
//       //     // rollup: 'rollup',
//       //     // '@crxjs/vite-plugin': '@crxjs/vite-plugin',
//       //     // fs: 'fs',
//       //     // path: 'node:path',
//       //     // url: 'node:url',
//       //     // constants: 'node:constants',
//       //     // os: 'node:os',
//       //     // util: 'node:util',
//       //     // stream: 'node:stream',
//       //     // events: 'node:events',
//       //   },
//       // },
//     },
//   },
//   plugins: [
//     // nodePolyfills(),
//     externalizeDeps({
//       deps: true,
//       devDeps: false,
//       except: [],
//       nodeBuiltins: true,
//       optionalDeps: true,
//       peerDeps: true,
//       useFile: join(process.cwd(), 'package.json'),
//     }),
//     nodeExternals(),
//     dts({
//       insertTypesEntry: true,
//     }),
//   ],
//   // optimizeDeps: {
//   //   include: ['@crxjs/vite-plugin'],
//   // },
// })

// // import { resolve } from 'node:path'
// // import nodePolyfills from 'rollup-plugin-polyfill-node'
// // import { defineConfig } from 'vite'
// // import dts from 'vite-plugin-dts'
// // import { externalizeDeps } from 'vite-plugin-externalize-deps'
// // import { nodeExternals } from './node-externals'

// // export default defineConfig({
// //   build: {
// //     lib: {
// //       entry: resolve(__dirname, 'src/index.ts'),
// //       name: 'bedframe',
// //       fileName: 'bedframe',
// //       formats: ['es'],
// //     },
// //     outDir: 'dist',
// //     emptyOutDir: true,
// //     rollupOptions: {
// //       external: ['fsevents'],
// //     },
// //   },
// //   plugins: [
// //     nodePolyfills(),
// //     nodeExternals(),
// //     externalizeDeps(),
// //     dts({
// //       insertTypesEntry: true,
// //     }),
// //   ],
// // })
