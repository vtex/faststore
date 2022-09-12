import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import SkuSelector from './SkuSelector'

const SkuSelectorTest = () => {
  const options = [
    { label: 'Option round', value: 'Round' },
    { label: 'Option square', value: 'Square' },
  ]

  return <SkuSelector variant="label" options={options} activeValue="Square" />
}

describe('SkuSelector', () => {
  describe('Data attributes', () => {
    it('should have `data-fs-sku-selector` attribute', () => {
      const { getByTestId } = render(<SkuSelectorTest />)

      expect(getByTestId('store-sku-selector')).toHaveAttribute(
        'data-fs-sku-selector'
      )
    })

    it('should have `data-fs-sku-selector-variant` attribute', () => {
      const { getByTestId } = render(<SkuSelectorTest />)

      expect(getByTestId('store-sku-selector')).toHaveAttribute(
        'data-fs-sku-selector-variant'
      )
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<SkuSelectorTest />)

      expect(await axe(getByTestId('store-sku-selector'))).toHaveNoViolations()
    })
  })
})
