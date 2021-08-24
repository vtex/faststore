import { render } from '@testing-library/react'
import React from 'react'

import Slider from './Slider'

describe('Slider', () => {
  it('`data-store-slider` is present', () => {
    const { getByTestId } = render(<Slider min={0} max={100} />)

    expect(getByTestId('store-slider')).toHaveAttribute('data-store-slider')
  })
})
