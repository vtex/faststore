import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import Price from './Price'

describe('Price', () => {
  it('`data-store-price` is present', () => {
    const { getByTestId } = render(<Price value={32.5} />)

    expect(getByTestId('store-price')).toHaveAttribute('data-store-price')
  })

  it('`data-selling` is present if no variant is defined', () => {
    const { getByTestId } = render(<Price value={32.5} />)

    expect(getByTestId('store-price')).toHaveAttribute('data-selling')
  })

  it('`data-listing` is present if variant is listing', () => {
    const { getByTestId } = render(<Price value={32.5} variant="listing" />)

    expect(getByTestId('store-price')).toHaveAttribute('data-listing')
  })

  it('returns unaltered value if no formatter is provided', () => {
    const { getByTestId } = render(<Price value={32.5} />)

    expect(getByTestId('store-price')).toHaveTextContent('32.5')
  })

  it('returns empty content if formatter returns null', () => {
    const { getByTestId } = render(
      <Price value={32.5} formatter={() => null} />
    )

    expect(getByTestId('store-price')).toBeEmptyDOMElement()
  })

  it('returns formatter result as content', () => {
    const formatterResult = 'Formatter result'

    const { getByTestId } = render(
      <Price value={32.5} formatter={() => formatterResult} />
    )

    expect(getByTestId('store-price')).toHaveTextContent(formatterResult)
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<Price value={32.2} />)

      expect(await axe(getByTestId('store-price'))).toHaveNoViolations()
    })
  })
})
