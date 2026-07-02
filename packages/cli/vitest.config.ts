import { existsSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
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
        if (
          id.endsWith('discovery.config.js') ||
          id.includes('discovery.config.js')
        ) {
          return id
        }
        return null
      },
      load(id) {
        if (
          !id.endsWith('discovery.config.js') &&
          !id.includes('discovery.config.js')
        ) {
          return null
        }

        try {
          const filePath = id.startsWith('file:') ? fileURLToPath(id) : id
          if (existsSync(filePath)) {
            return null
          }
        } catch {
          // fall through to virtual default
        }

        return `
          module.exports = {
            contentSource: {
              project: 'faststore-3',
            }
          }`
      },
    },
  ],
})
