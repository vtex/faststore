// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for a11y (accessibility)
 */

import { cypress } from '../../store.config'

const { pages } = cypress

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
    cy.checkA11y()
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
    cy.checkA11y()
  })
})
