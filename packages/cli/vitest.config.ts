import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
    coverage: {
      provider: 'v8',
      reporter: ['text', 'lcov'],
      reportsDirectory: './coverage',
      include: ['src/**'],
      exclude: ['src/**/*.{test,spec}.{ts,tsx}', 'src/**/*.d.ts', 'dist/**'],
    },
  },
  resolve: {
    alias: {},
  },
  plugins: [
    {
      name: 'virtual-module',
      resolveId(id) {
        if (id.endsWith('discovery.config.js')) {
          return id
        }
        return null
      },
      load(id) {
        if (id.endsWith('discovery.config.js')) {
          return `
          module.exports = {
            contentSource: {
              project: 'faststore-3',
            }
          }`
        }
        return null
      },
    },
  ],
})
