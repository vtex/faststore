import { render, cleanup } from '@testing-library/react'
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

  afterEach(cleanup)

  describe('Data attributes', () => {
    it('should have `data-store-incentive` attribute', () => {
      expect(incentive).toHaveAttribute('data-store-incentive')
    })
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      expect(await axe(incentive)).toHaveNoViolations()
    })
  })
})
