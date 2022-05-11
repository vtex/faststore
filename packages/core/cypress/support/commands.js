// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add("login", (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add("drag", { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add("dismiss", { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite("visit", (originalFn, url, options) => { ... })

import 'cypress-wait-until'

function logToTerminal(violations) {
  cy.task('log', `${violations.length} accessibility violation(s) detected`)
  cy.task(
    'table',
    violations.map(({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes.length,
    }))
  )
}

Cypress.Commands.overwrite(
  'checkA11y',
  // eslint-disable-next-line max-params
  (originalFn, context, options, callback) => {
    return originalFn(context, options, callback ?? logToTerminal)
  }
)

Cypress.Commands.add('getById', (selector, ...args) => {
  return cy.get(`[data-testid=${selector}]`, ...args)
})

Cypress.Commands.add('waitForHydration', () => {
  return cy.window().should((win) => {
    expect(
      win.performance.getEntriesByName('Next.js-hydration')
    ).to.have.length(1)
  })
})

Cypress.Commands.add('clearIDB', () => {
  return indexedDB.deleteDatabase('keyval-store')
})

Cypress.Commands.add('itemsInCart', (count) => {
  return cy.getById('cart-toggle').should(($toggle) => {
    expect($toggle.attr('data-items')).to.eq(count.toString())
  })
})
