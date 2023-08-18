import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

export default defineConfig(({ command }) => {
  return {
    build: {
      emptyOutDir: true,
    },
    plugins: [
      dts({
        insertTypesEntry: true,
      }),
    ],
  }
})
