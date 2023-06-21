import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { resolve } from 'path'

export default defineConfig(({ command }) => {
  // const isProduction = command === 'build'

  return {
    // server: {
    //   proxy: {
    //     '/api': isProduction
    //       ? 'https://your-production-api.com'
    //       : 'http://localhost:3000',
    //   },
    // },
    build: {
      // outDir: 'dist/client',
      emptyOutDir: true,
      rollupOptions: {
        input: {
          // main: resolve(__dirname, isProduction ? 'index.ts' : 'local.ts'),
          server: resolve(__dirname, 'src', 'server.ts'),
        },
      },
    },
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
  }
})
