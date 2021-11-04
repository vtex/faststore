import React from 'react'
import { render } from '@testing-library/react'
import { axe } from 'jest-axe'

import Overlay from './Overlay'

describe('Overlay', () => {
  const testId = 'store-overlay'

  it('data-store-overlay is present', () => {
    const { getByTestId } = render(<Overlay testId={testId} />)

    expect(getByTestId(testId)).toHaveAttribute('data-store-overlay')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Overlay testId={testId} />)

      expect(await axe(getByTestId(testId))).toHaveNoViolations()
    })
  })
})
