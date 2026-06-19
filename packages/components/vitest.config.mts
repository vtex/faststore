import { defineConfig } from 'vitest/config'

// vitest.config.js
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/*.stories.{ts,tsx}',
        'src/**/*.d.ts',
        'dist/**',
      ],
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
  plugins: [],
})
