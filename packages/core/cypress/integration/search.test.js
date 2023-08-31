// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for Search Input
 */

import { options } from '../global'
import { cypress } from '../../faststore.config'

const { pages } = cypress

describe('Search input', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  context('when search for generic term', () => {
    it.skip('opens the search page', () => {
      const term = 'shirt'

      cy.visit(pages.home, options)
      cy.waitForHydration()

      cy.getById('store-input-mobile-button')
        .should('exist')
        .scrollIntoView({ duration: 0 })
        .click({ force: true })

      cy.getById('store-input-mobile')
        .should('exist')
        .scrollIntoView({ duration: 0 })
        .click({ force: true })
        .within(() => {
          cy.getById('fs-input').type(term)
          cy.getById('store-input-mobile-button').click()
        })

      cy.location('search').should((loc) => {
        expect(loc).to.include(`q=${term}`)
      })
    })
  })
})
