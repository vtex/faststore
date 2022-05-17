// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for testing the Cart module
 */

import { options } from '../global'
import { cypress } from '../../store.config'

const { pages } = cypress

describe('Cart Sidebar', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  it('toggles cart sidebar', () => {
    cy.visit(pages.home, options)
    cy.waitForHydration()

    cy.getById('cart-toggle').first().click()
    cy.getById('cart-sidebar').should('exist')
    cy.getById('cart-sidebar-button-close').first().click()
    cy.getById('cart-sidebar').should('not.exist')
  })

  context('when opening the cart sidebar', () => {
    it('should not scroll the background page', () => {
      cy.visit(pages.home, options)
      cy.waitForHydration()

      // window scrolls to keep cart-toggle on the screen initially
      cy.getById('cart-toggle').click()
      cy.getById('cart-sidebar').should('exist')

      // simulate touch scroll. Do not use window.scrollTo
      cy.get('[data-fs-empty-state]')
        .trigger('touchstart', 0, 50)
        .trigger('touchmove', 0, 150)
        .trigger('touchend', 0, 150)
      cy.window().its('scrollY').should('not.equal', 0)
    })
  })
})

describe('On product description pages', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  context('when adding a product to cart', () => {
    it('successfully adds the product', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      // Add to cart
      cy.getById('buy-button')
        .click()
        .then(($btn) => {
          const skuId = $btn.attr('data-sku')
          const sellerId = $btn.attr('data-seller')

          // Wait for optimistic cart to kick in
          cy.getById('checkout-button').should('be.enabled')

          cy.getById('cart-item').should(($item) => {
            expect($item.attr('data-sku')).to.eq(skuId)
            expect($item.attr('data-seller')).to.eq(sellerId)
          })

          cy.itemsInCart(1)
        })
    })
  })

  context('when removing a product from cart', () => {
    it('successfully removes the product', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      cy.getById('buy-button').click()

      cy.itemsInCart(1)

      cy.getById('checkout-button').should('be.enabled')

      cy.itemsInCart(1)

      cy.getById('remove-from-cart-button').click()
      cy.getById('cart-item').should('not.exist')
      cy.getById('checkout-button').should('not.exist')

      cy.itemsInCart(0)
    })
  })
})
