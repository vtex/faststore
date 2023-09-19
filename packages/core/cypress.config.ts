import { defineConfig } from 'cypress'

export default defineConfig({
  retries: 0,
  video: true,
  trashAssetsBeforeRuns: true,
  screenshotOnRunFailure: true,
  viewportWidth: 1000,
  viewportHeight: 600,
  e2e: {
    supportFile: 'cypress/support/index.{js,jsx,ts,tsx}',
    specPattern: 'cypress/integration/**/*.test.{js,jsx,ts,tsx}',
    setupNodeEvents(on, config) {
      return require('cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/',
    experimentalRunAllSpecs: true,
  },
})
