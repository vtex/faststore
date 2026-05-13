import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['fake-indexeddb/auto'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.d.ts', 'dist/**'],
    },
    projects: [
      {
        extends: true,
        test: {
          name: 'browser',
          environment: 'jsdom',
          include: ['./test/**/*.test.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        },
      },
    ],
  },
})
