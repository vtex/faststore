import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Slider from './Slider'

const props = {
  min: {
    absolute: 0,
    selected: 0,
  },
  max: {
    absolute: 100,
    selected: 100,
  },
}

describe('Slider', () => {
  it('`data-store-slider` is present', () => {
    const { getByTestId } = render(<Slider {...props} />)

    expect(getByTestId('store-slider')).toHaveAttribute('data-store-slider')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Slider {...props} />)

      expect(await axe(getByTestId('store-slider'))).toHaveNoViolations()
    })
  })
})
