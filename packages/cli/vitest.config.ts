import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: false,
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
