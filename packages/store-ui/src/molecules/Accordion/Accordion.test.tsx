import { render } from '@testing-library/react'
import React from 'react'

import Accordion from './Accordion'

describe('Accordion', () => {
  it('should have `data-store-accordion` attribute', () => {
    const { getByTestId } = render(<Accordion>Test</Accordion>)

    expect(getByTestId('store-accordion')).toHaveAttribute(
      'data-store-accordion'
    )
  })
})
