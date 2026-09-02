import { existsSync } from 'node:fs'
import { createRequire } from 'node:module'
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
    // graphql ships both CJS and ESM builds and checks `instanceof` across
    // them. Externalized deps (@graphql-tools/*) load the CJS build, so make
    // the code under test use the same one instead of Vite's ESM pick.
    alias: [
      {
        find: /^graphql$/,
        replacement: createRequire(import.meta.url).resolve('graphql'),
      },
    ],
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
