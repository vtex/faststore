import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
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
