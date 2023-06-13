import { resolve } from 'node:path'
import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest/vitest.setup.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'istanbul', // or 'custom' | 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
    watch: false,
  },
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
})
