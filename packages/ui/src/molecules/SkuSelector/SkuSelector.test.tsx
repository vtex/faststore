import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import SkuSelector from './SkuSelector'

describe('SkuSelector', () => {
  it('should have `data-fs-sku-selector` attribute', () => {
    const { getByTestId } = render(<SkuSelector variant={'label'} options={[]} activeValue={''}>Testing</SkuSelector>)

    expect(getByTestId('store-sku-selector')).toHaveAttribute('data-fs-sku-selector')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<SkuSelector variant={'label'} options={[]} activeValue={''}>Testing</SkuSelector>)

      expect(await axe(getByTestId('store-sku-selector'))).toHaveNoViolations()
    })
  })
})
