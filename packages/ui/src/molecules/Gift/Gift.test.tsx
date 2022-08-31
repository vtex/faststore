import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Gift from './Gift'
import GiftImage from './GiftImage'
import GiftContent from './GiftContent'

const GiftTest = () => {
  return (
    <Gift>
      <GiftImage>
        <div>An image</div>
      </GiftImage>
      <GiftContent>
        <h3>Product Name</h3>
        <p>89.90</p>
        <span>Free</span>
      </GiftContent>
    </Gift>
  )
}

describe('Gift', () => {
  describe('Data attributes', () => {
    const { getByTestId } = render(<GiftTest />)

    const gift = getByTestId('store-gift')
    const giftImage = getByTestId('store-gift-image')
    const giftContent = getByTestId('store-gift-content')

    it('`Gift` component should have `data-fs-gift` attribute', () => {
      expect(gift).toHaveAttribute('data-fs-gift')
    })

    it('`GiftImage` component should have `data-fs-gift-image` attribute', () => {
      expect(giftImage).toHaveAttribute('data-fs-gift-image')
    })

    it('`GiftContent` component should have `data-fs-gift-content` attribute', () => {
      expect(giftContent).toHaveAttribute('data-fs-gift-content')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<GiftTest />)

      expect(await axe(getByTestId('store-gift'))).toHaveNoViolations()
      expect(await axe(getByTestId('store-gift'))).toHaveNoIncompletes()
    })
  })
})
