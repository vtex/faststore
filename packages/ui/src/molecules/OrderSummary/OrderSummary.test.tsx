import { render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React from 'react'

import OrderSummary from './OrderSummary'

const ELEMENT_NOT_FOUND_MESSAGE = 'Unable to find an element by:'

describe('OrderSummary', () => {
  it('should have `data-store-order-summary` attribute', () => {
    const { getByTestId } = render(<OrderSummary />)

    expect(getByTestId('store-order-summary')).toHaveAttribute(
      'data-fs-order-summary'
    )
  })

  it('should always render total labels and values elements', async () => {
    const { getByTestId } = render(<OrderSummary />)

    expect(getByTestId('store-order-summary-total-label')).toBeInTheDocument()
    expect(getByTestId('store-order-summary-total-value')).toBeInTheDocument()
  })

  it('should not render subtotal or discount labels and values if subtotalValue or discountValue are not provided', async () => {
    const { getByTestId } = render(
      <OrderSummary totalLabel="Total" totalValue="250$" />
    )

    expect(() =>
      getByTestId('store-order-summary-subtotal-label')
    ).toThrowError(ELEMENT_NOT_FOUND_MESSAGE)
    expect(() => getByTestId('store-order-summary-subtotal-value')).toThrow(
      ELEMENT_NOT_FOUND_MESSAGE
    )

    expect(() => getByTestId('store-order-summary-discount-label')).toThrow(
      ELEMENT_NOT_FOUND_MESSAGE
    )
    expect(() => getByTestId('store-order-summary-discount-value')).toThrow(
      ELEMENT_NOT_FOUND_MESSAGE
    )
  })

  it('should render subtotal label and value if subtotalValue is provided', async () => {
    const { getByTestId } = render(
      <OrderSummary
        subtotalLabel="Subtotal"
        totalLabel="Total"
        subtotalValue="300$"
        totalValue="250$"
      />
    )

    expect(
      getByTestId('store-order-summary-subtotal-label')
    ).toBeInTheDocument()
    expect(getByTestId('store-order-summary-subtotal-label')).toHaveTextContent(
      'Subtotal'
    )

    expect(
      getByTestId('store-order-summary-subtotal-value')
    ).toBeInTheDocument()
    expect(getByTestId('store-order-summary-subtotal-value')).toHaveTextContent(
      '300$'
    )
  })

  it('should render discount label and value if discountValue is provided', async () => {
    const { getByTestId } = render(
      <OrderSummary
        subtotalLabel="Subtotal"
        totalLabel="Total"
        subtotalValue="300$"
        totalValue="250$"
        discountLabel="Discount"
        discountValue="-50$"
      />
    )

    expect(
      getByTestId('store-order-summary-discount-label')
    ).toBeInTheDocument()
    expect(getByTestId('store-order-summary-discount-label')).toHaveTextContent(
      'Discount'
    )
    expect(
      getByTestId('store-order-summary-discount-value')
    ).toBeInTheDocument()
    expect(getByTestId('store-order-summary-discount-value')).toHaveTextContent(
      '-50$'
    )
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<OrderSummary />)

      expect(await axe(getByTestId('store-order-summary'))).toHaveNoViolations()
    })
  })
})
