import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import AggregateRating from './AggregateRating'

const fillCheck = (value: number) => {
  if (value >= 1) {
    return 'full'
  }

  if (0 < value && value < 1) {
    return 'half'
  }

  return 'empty'
}

describe('Breadcrumb', () => {
  it('`data-store-aggregate-rating` is present', () => {
    const { getByTestId } = render(
      <AggregateRating value={2}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </AggregateRating>
    )

    expect(getByTestId('store-aggregate-rating')).toHaveAttribute(
      'data-store-aggregate-rating'
    )
  })

  it('has the correct aggregate rating item data attribute', () => {
    const { queryAllByTestId, rerender } = render(
      <AggregateRating value={2}>
        <span />
      </AggregateRating>
    )

    // Test 5 random values and sizes in Aggregate Rating component.
    for (let i = 1; i <= 5; i += 1) {
      // Random value between 1 and 10
      const numberOfElements = Math.ceil(Math.random() * 10)
      const value = parseFloat((Math.random() * numberOfElements).toFixed(1))

      rerender(
        <AggregateRating value={value}>
          {Array.from({ length: numberOfElements })}
        </AggregateRating>
      )

      const ratingItems = queryAllByTestId('store-aggregate-rating-item')

      // Validate if it's rendering with the correct number of ratings.
      expect(ratingItems).toHaveLength(numberOfElements)

      // Validate if each rating element has the correct attribute.
      for (
        let currentItemNumber = 0;
        currentItemNumber < numberOfElements;
        currentItemNumber += 1
      ) {
        expect(ratingItems[currentItemNumber]).toHaveAttribute(
          'data-store-aggregate-rating-item',
          fillCheck(value - (currentItemNumber + 1))
        )
      }
    }
  })

  it('AXE Test', async () => {
    render(
      <AggregateRating value={3}>
        <span />
        <span />
        <span />
        <span />
        <span />
      </AggregateRating>
    )

    expect(await axe(document.body)).toHaveNoViolations()
  })
})
