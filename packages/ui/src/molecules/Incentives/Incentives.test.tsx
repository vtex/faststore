import { render, cleanup } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Incentives from './Incentives'

const TestIncentives = () => {
  const incentives = [
    {
      icon: <div />,
      title: 'A title',
      description: 'A description',
    },
  ]

  return <Incentives incentives={incentives} />
}

describe('Incentives', () => {
  let incentives: HTMLElement

  beforeEach(() => {
    const { getByTestId } = render(<TestIncentives />)

    incentives = getByTestId('store-incentives')
  })

  afterEach(cleanup)

  describe('Data attributes', () => {
    it('`Incentives` component should have `data-store-incentives` attribute', () => {
      expect(incentives).toHaveAttribute('data-store-incentives')
    })
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      expect(await axe(incentives)).toHaveNoViolations()
    })
  })
})
