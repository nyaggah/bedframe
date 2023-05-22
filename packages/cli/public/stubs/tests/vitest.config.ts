import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    setupFiles: ['./vitest/vitest.setup.ts'],
    environment: 'jsdom',
    coverage: {
      provider: 'c8', // or 'custom' | 'istanbul'
      reporter: ['text', 'json', 'html'],
    },
  },
})
