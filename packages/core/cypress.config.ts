import { defineConfig } from 'cypress'

export default defineConfig({
  retries: 0,
  video: true,
  trashAssetsBeforeRuns: true,
  screenshotOnRunFailure: true,
  viewportWidth: 1000,
  viewportHeight: 600,
  e2e: {
    // We've imported your old cypress plugins here.
    // You may want to clean this up later by importing these.
    setupNodeEvents(on, config) {
      return require('./cypress/plugins/index.js')(on, config)
    },
    baseUrl: 'http://localhost:3000/',
    experimentalRunAllSpecs: true,
  },
})
