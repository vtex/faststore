import { render, cleanup } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import ProductCard from './ProductCard'
import ProductCardInfo from './ProductCardInfo'
import ProductCardImage from './ProductCardImage'
import ProductCardTitle from './ProductCardTitle'
import ProductCardPrice from './ProductCardPrice'
import ProductCardTags from './ProductCardTags'
import ProductCardLink from './ProductCardLink'

const TestProductCard = () => {
  return (
    <ProductCard>
      <ProductCardImage>
        <div>An image</div>
      </ProductCardImage>
      <ProductCardInfo>
        <ProductCardTitle>
          <h3>A title</h3>
        </ProductCardTitle>
        <ProductCardPrice>89.90</ProductCardPrice>
        <ProductCardTags>
          <div>A tag</div>
        </ProductCardTags>
      </ProductCardInfo>
      <ProductCardLink>
        <a href="/">A link</a>
      </ProductCardLink>
    </ProductCard>
  )
}

describe('ProductCard', () => {
  let productCard: HTMLElement
  let productCardInfo: HTMLElement
  let productCardImage: HTMLElement
  let productCardTitle: HTMLElement
  let productCardPrice: HTMLElement
  let productCardTags: HTMLElement
  let productCardLink: HTMLElement
  let productCardContainer: HTMLElement

  beforeEach(() => {
    const { getByTestId, container } = render(<TestProductCard />)

    productCard = getByTestId('store-product-card')
    productCardInfo = getByTestId('store-product-card-info')
    productCardImage = getByTestId('store-product-card-image')
    productCardTitle = getByTestId('store-product-card-title')
    productCardPrice = getByTestId('store-product-card-price')
    productCardTags = getByTestId('store-product-card-tags')
    productCardLink = getByTestId('store-product-card-link')
    productCardContainer = container
  })

  afterEach(cleanup)

  describe('Data attributes', () => {
    it('`ProductCard` component should have `data-store-product-card` attribute', () => {
      expect(productCard).toHaveAttribute('data-store-product-card')
    })

    it('`ProductCardInfo` component should have `data-store-product-card-info` attribute', () => {
      expect(productCardInfo).toHaveAttribute('data-store-product-card-info')
    })

    it('`ProductCardImage` component should have `data-store-product-card-image` attribute', () => {
      expect(productCardImage).toHaveAttribute('data-store-product-card-image')
    })

    it('`ProductCardTitle` component should have `data-store-product-card-title` attribute', () => {
      expect(productCardTitle).toHaveAttribute('data-store-product-card-title')
    })

    it('`ProductCardPrice` component should have `data-store-product-card-price` attribute', () => {
      expect(productCardPrice).toHaveAttribute('data-store-product-card-price')
    })

    it('`ProductCardTags` component should have `data-store-product-card-tags` attribute', () => {
      expect(productCardTags).toHaveAttribute('data-store-product-card-tags')
    })

    it('`ProductCardLink` component should have `data-store-product-card-link` attribute', () => {
      expect(productCardLink).toHaveAttribute('data-store-product-card-link')
    })
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      expect(await axe(productCardContainer)).toHaveNoViolations()
    })
  })
})
