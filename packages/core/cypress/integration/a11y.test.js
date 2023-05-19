// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for a11y (accessibility)
 */

import { cypress } from '../../faststore.config'

const { pages } = cypress

function terminalLog(violations) {
  cy.task(
    'log',
    `${violations.length} accessibility violation${
      violations.length === 1 ? '' : 's'
    } ${violations.length === 1 ? 'was' : 'were'} detected`
  )
  // pluck specific keys to keep the table readable
  const violationData = violations.map(
    ({ id, impact, description, nodes }) => ({
      id,
      impact,
      description,
      nodes: nodes,
    })
  )

  cy.task('table', violationData)
}

describe('Accessibility tests', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  it('checks a11y for collection page', () => {
    cy.visit(pages.collection)
    cy.waitForHydration()

    // Waits for product list to be fetched and page to be interactive
    cy.getById('product-link').should('exist')

    cy.injectAxe()
    cy.checkA11y(null, null)
  })

  it('checks a11y for product page', () => {
    cy.visit(pages.pdp)
    cy.waitForHydration()

    // Wait for product to be available and page to be interactive
    cy.getById('buy-button').should('exist')

    cy.injectAxe()
    cy.checkA11y()
  })

  it('checks a11y for home page', () => {
    cy.visit(pages.home)
    cy.waitForHydration()

    cy.injectAxe()
    cy.checkA11y(null, null, terminalLog)
  })
})
