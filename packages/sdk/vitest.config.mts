import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    setupFiles: ['fake-indexeddb/auto'],
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
