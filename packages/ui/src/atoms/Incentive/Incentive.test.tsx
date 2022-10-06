import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Incentive from './Incentive'

const TestIncentive = () => {
  return (
    <Incentive>
      <span>Item title</span>
      <span>Item description</span>
    </Incentive>
  )
}

describe('Incentive', () => {
  let incentive: HTMLElement

  beforeEach(() => {
    const { getByTestId } = render(<TestIncentive />)

    incentive = getByTestId('store-incentive')
  })

  describe('Data attributes', () => {
    it('should have `data-fs-incentive` attribute', () => {
      expect(incentive).toHaveAttribute('data-fs-incentive')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      expect(await axe(incentive)).toHaveNoViolations()
    })
  })
})
