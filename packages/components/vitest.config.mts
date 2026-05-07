import { defineConfig } from 'vitest/config'

// vitest.config.js
export default defineConfig({
  test: {
    setupFiles: ['./vitest.setup.ts'],
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
