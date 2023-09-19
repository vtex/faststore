// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
// ***********************************************************
// This example plugins/index.js can be used to load plugins
//
// You can change the location of this file or turn off loading
// the plugins file with the 'pluginsFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/plugins-guide
// ***********************************************************
const codeCoveragePlugin = require('@cypress/code-coverage/task')

// This function is called when a project is opened or re-opened (e.g. due to
// the project's config changing)

/**
 * @type {Cypress.PluginConfig}
 */
module.exports = (on, config) => {
  codeCoveragePlugin(on, config)

  on('task', {
    log(message) {
      // eslint-disable-next-line no-console
      console.log(message)

      return null
    },
    table(message) {
      // eslint-disable-next-line no-console
      console.table(message)

      return null
    },
  })

  // Chromium-based browsers
  on('before:browser:launch', (browser = {}, launchOptions) => {
    if (browser.family === 'chromium') {
      launchOptions.args.push('--disable-dev-shm-usage')
    }

    return launchOptions
  })

  // Chrome browser
  on('before:browser:launch', (browser = {}, args) => {
    if (browser.family === 'chrome') {
      args.push('--disable-dev-shm-usage')
    }

    return args
  })

  // `on` is used to hook into various events Cypress emits
  // `config` is the resolved Cypress config
  return config
}
