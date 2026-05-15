import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**'],
      exclude: [
        'src/**/*.{test,spec}.{ts,tsx}',
        'src/**/__generated__/**',
        'src/**/*.d.ts',
        'dist/**',
      ],
    },
  },
  resolve: {
    // https://github.com/vitest-dev/vitest/issues/4605
    alias: {
      'graphql/language/printer': 'graphql/language/printer.js',
      'graphql/language': 'graphql/language/index.js',
      graphql: 'graphql/index.js',
    },
  },
})
