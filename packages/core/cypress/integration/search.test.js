// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for Search Input
 */

import { options } from '../global'
import { cypress } from '../../store.config'

const { pages } = cypress

describe('Search input', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  context('when search for generic term', () => {
    it('opens the search page', () => {
      const term = 'shirt'

      cy.visit(pages.home, options)
      cy.waitForHydration()

      cy.getById('store-input-mobile-button').click({ force: true })

      cy.getById('store-input-mobile')
        .click()
        .type(term)
        .within(() => {
          cy.getById('store-button').click()
        })

      cy.location('search').should((loc) => {
        expect(loc).to.include(`q=${term}`)
      })
    })
  })
})
