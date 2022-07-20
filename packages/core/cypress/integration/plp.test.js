/* eslint-disable cypress/no-unnecessary-waiting */
// eslint-disable-next-line spaced-comment
/// <reference types="cypress" />
/**
 * Cypress tests for PLP
 */

import { options } from '../global'
import { cypress } from '../../store.config'

const { pages } = cypress

describe('Search page Filters and Sorting options', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  it('Applies filters after click', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    // Apply filters
    cy.getById('open-filter-button')
      .click()
      .get(
        `[data-testid=mobile-store-filter-accordion-item][data-type=StoreFacetBoolean]>[data-testid=mobile-store-filter-accordion-button]`
      )
      .first()
      .click()
      .getById('mobile-store-filter-accordion-panel-checkbox')
      .should('exist')
      .first()
      .click()
      .then(($checkbox) => {
        const value = $checkbox.attr('data-value')
        // const quantity = $checkbox.attr('data-quantity')

        cy.getById('filter-slider-button-apply')
          .click()

          .then(() => {
            // Check if the filter applied actually ended up in the URL
            cy.location('href').should((loc) => {
              expect(loc).to.include(value)
            })
          })
        // TODO: This test if flaky because the facets are lazy. We should fix this in another PR
        // Check if the filter applied actually brought the number of products it said it would
        // .getById('total-product-count')
        // .should('exist')
        // .parent()
        // .then(($countDiv) => {
        //   const count = $countDiv.attr('data-count')

        //   expect(Number(count)).to.eq(Number(quantity))
        // })
      })
  })

  it('Sort products by price_asc', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    const priceId = '[data-fs-product-grid] [data-testid="price"]'

    cy.getById('product-gallery').within(() => {
      cy.getById('search-sort')
        .should('exist')
        .select('price_asc')
        .then(() => {
          cy.get(priceId).should(($prices) => {
            const prices = Cypress._.map($prices, (price) =>
              Number(price.attributes['data-value'].value)
            )

            const sorted = Cypress._.sortBy(prices, Cypress._.identity)

            expect(prices).to.have.length.gt(0)
            expect(prices).to.deep.equal(sorted)
          })
        })
    })
  })

  it('Sort products by price_desc', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()
    const priceId = '[data-fs-product-grid] [data-testid="price"]'

    cy.getById('product-gallery').within(() => {
      cy.getById('search-sort')
        .should('exist')
        .select('price_desc')
        .then(() => {
          cy.get(priceId).should(($prices) => {
            const prices = Cypress._.map($prices, (price) =>
              Number(price.attributes['data-value'].value)
            )

            const sorted = Cypress._.sortBy(prices, (x) => -x)

            expect(prices).to.have.length.gt(0)
            expect(prices).to.deep.equal(sorted)
          })
        })
    })
  })
})

describe('Infinite Scroll pagination', () => {
  beforeEach(() => {
    cy.clearIDB()
  })

  it('Shows more products when requested', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    cy.getById('product-gallery').within(() => {
      cy.getById('store-product-card')
        .should('exist')
        .should('have.length.gt', 0)
        .then(($links) => {
          const before = $links.length

          cy.getById('show-more')
            .should('exist')
            .click()
            .then(() => {
              cy.getById('store-product-card')
                .should('have.length.gte', before)
                .then(($products) => {
                  const after = $products.length

                  expect(before).to.be.lte(after)
                })
            })
        })
    })
  })

  it('Sticks to last seen page on plp pagination', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    cy.get('[data-testid=product-gallery] [data-testid=store-product-card]')
      .should('exist')
      .should('have.length.gt', 0)
      .then(($links) => {
        // Number of products before showMore is clicked
        const before = $links.length

        cy.getById('show-more')
          .should('exist')
          .click()
          // Go up the page
          .get('[data-testid=product-gallery] [data-testid=store-product-card]')
          .first()
          .scrollIntoView({ duration: 1000 })

          // Go down the page
          .get('[data-testid=product-gallery] [data-testid=store-product-card]')
          .last()
          .scrollIntoView({ duration: 1000 })
          .then(() => {
            // Ensure it waits for the new page after clicking "show more"
            cy.location('search').should('match', /page=1$/)

            // The skuId of the last product on the page
            let skuIdBeforeNavigate

            cy.get(
              '[data-testid=product-gallery] [data-testid=store-product-card]'
            )
              // Number of products after showMore is clicked should be higher
              .should('have.length.gte', before)
              .last()
              .then(($card) => {
                skuIdBeforeNavigate = $card.attr('data-fs-product-card-sku')
              })
              .click()
              .then(() => {
                // make sure we are on the pdp
                cy.location('pathname').should('match', /\/p$/)
                // make sure pdp is fully iteractive
                cy.getById('buy-button').should('exist')
              })
              .then(() => {
                cy.go('back')
                  .get(
                    '[data-testid=product-gallery] [data-testid=store-product-card]'
                  )
                  .last()
                  .then(($card) => {
                    const skuIdAfterNavigate = $card.attr(
                      'data-fs-product-card-sku'
                    )

                    expect(skuIdBeforeNavigate).to.eq(skuIdAfterNavigate)
                    expect(skuIdAfterNavigate).to.exist
                  })
              })
          })
      })
  })

  // Tests: https://developers.google.com/search/blog/2014/02/infinite-scroll-search-friendly
  it('Changes the page being viewed on scroll', () => {
    cy.visit(pages.collection, options)
    cy.waitForHydration()

    cy.getById('show-more').should('exist').click()

    cy.scrollTo('top')
      .location('search')
      .should('match', /page=0$/)

    cy.get('[data-testid=product-gallery] [data-testid=store-product-card]')
      .last()
      .scrollIntoView({ duration: 1000 })
      .location('search')
      .should('match', /page=1$/)
  })
})
