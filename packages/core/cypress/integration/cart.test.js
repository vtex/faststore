// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for testing the Cart module
 */

import { options } from '../global'
import { cypress } from '../../faststore.config'

const { pages } = cypress

describe('Cart Sidebar', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  it.skip('toggles cart sidebar', () => {
    cy.visit(pages.home, options)
    cy.waitForHydration()

    cy.getById('cart-toggle').first().click()
    cy.getById('fs-cart-sidebar').should('exist')
    cy.getById('fs-cart-sidebar-button-close').first().click()
    cy.getById('fs-cart-sidebar').should('not.exist')
  })

  context('when opening the cart sidebar', () => {
    it.skip('should not scroll the background page', () => {
      cy.visit(pages.home, options)
      cy.waitForHydration()

      // window scrolls to keep cart-toggle on the screen initially
      cy.getById('cart-toggle').click()
      cy.getById('fs-cart-sidebar').should('exist')

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
    it.skip('successfully adds the product', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      let skuId, sellerId

      // Add to cart
      cy.getById('buy-button')
        .scrollIntoView({ duration: 500 })
        .then(($btn) => {
          cy.getById('buy-button').click({
            timeout: 5000,
            waitForAnimations: true,
          })

          skuId = $btn.attr('data-sku')
          sellerId = $btn.attr('data-seller')
        })

      // Wait for optimistic cart to kick in
      cy.getById('checkout-button')
        .should('be.visible')
        .should('be.enabled')
        .then(() => {
          cy.getById('fs-cart-item').should(($item) => {
            expect($item.attr('data-sku')).to.eq(skuId)
            expect($item.attr('data-seller')).to.eq(sellerId)
          })
          cy.itemsInCart(1)
        })
    })
  })

  context('when removing a product from cart', () => {
    it.skip('successfully removes the product', () => {
      cy.visit(pages.pdp, options)
      cy.waitForHydration()

      cy.itemsInCart(0)

      // Add to cart
      cy.getById('buy-button')
        .scrollIntoView({ duration: 500 })
        .then(() => {
          cy.getById('buy-button').click({ force: true })
          cy.getById('checkout-button')
            .should('be.visible')
            .should('be.enabled')

          cy.itemsInCart(1)
        })

      cy.getById('remove-from-cart-button')
        .scrollIntoView({ duration: 500 })
        .then(() => {
          cy.getById('remove-from-cart-button').click({ force: true })
          cy.getById('fs-cart-item').should('not.exist')
          cy.getById('checkout-button').should('not.exist')

          cy.itemsInCart(0)
        })
    })
  })
})
