import { render, cleanup } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Incentives from './Incentives'
import IncentivesItem from './IncentivesItem'

const TestIncentives = () => {
  return (
    <Incentives>
      <IncentivesItem>
        <span>Item title</span>
        <span>Item description</span>
      </IncentivesItem>
      <IncentivesItem>
        <span>Another item title</span>
        <span>Another item description</span>
      </IncentivesItem>
    </Incentives>
  )
}

describe('Incentives', () => {
  let incentives: HTMLElement
  let incentivesItems: HTMLElement[]
  let incentivesPure: Element | null

  beforeEach(() => {
    const { getByTestId, getAllByTestId, container } = render(
      <TestIncentives />
    )

    incentives = getByTestId('store-incentives')
    incentivesItems = getAllByTestId('store-incentives-item')
    incentivesPure = container.querySelector('section')
  })

  afterEach(cleanup)

  describe('Data attributes', () => {
    it('`Incentives` component should have `data-store-incentives` attribute', () => {
      expect(incentives).toHaveAttribute('data-store-incentives')
    })

    it('`IncentivesItem` component should have `data-store-incentives-item` attribute', () => {
      for (const item of incentivesItems) {
        expect(item).toHaveAttribute('data-store-incentives-item')
      }
    })
  })

  describe('Accessibility', () => {
    it('should not have violations', async () => {
      expect(await axe(document.body)).toHaveNoViolations()
    })

    it('ensures section tag is being rendered', () => {
      expect(incentivesPure).toBeInTheDocument()
    })
  })
})
