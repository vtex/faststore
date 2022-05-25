import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React from 'react'

import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'
import OutOfStock from './OutOfStock'

const SimpleOutOfStock = () => (
  <OutOfStock title="Out of Stock" message="Notify me when available">
    <Label>
      Email
      <Input />
    </Label>
    <Button>Notify me</Button>
  </OutOfStock>
)

const ComposingOutOfStock = () => (
  <OutOfStock
    title={<h1>Head Out Os Stock</h1>}
    message={<span>Span Out of Stock</span>}
  >
    <Label>
      Email
      <Input />
    </Label>
    <Button>Notify me</Button>
  </OutOfStock>
)

describe('OutOfStock', () => {
  it('`Out Of Stock` components should have corrects attributes', () => {
    render(<SimpleOutOfStock />)

    const outOfStock = screen.getByTestId('store-out-of-stock')
    const outOfStockTitle = screen.getByTestId('store-out-of-stock-title')
    const outOfStockMessage = screen.getByTestId('store-out-of-stock-message')
    const outOfStockForm = screen.getByTestId('store-out-of-stock-form')

    expect(outOfStock).toHaveAttribute('data-store-out-of-stock')
    expect(outOfStockForm).toHaveAttribute('data-store-out-of-stock-form')
    expect(outOfStockTitle).toHaveAttribute('data-store-out-of-stock-title')
    expect(outOfStockMessage).toHaveAttribute('data-store-out-of-stock-message')
  })

  it('Should emit event', () => {
    const onSubmitMock = jest.fn((e) => e.preventDefault())

    render(
      <OutOfStock onSubmit={onSubmitMock} title="Out of Stock">
        <Input name="email" />
        <Button type="submit">Notify me</Button>
      </OutOfStock>
    )

    const outOfStockEventButton = screen.getByTestId('store-button')

    userEvent.click(outOfStockEventButton)

    expect(onSubmitMock).toHaveBeenCalledTimes(1)
  })

  it('Should not render message', () => {
    render(
      <OutOfStock title="Out of Stock">
        <Input name="email" />
        <Button type="submit">Notify me</Button>
      </OutOfStock>
    )

    const message = screen.queryByTestId('store-out-of-stock-message')

    expect(message).not.toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('should not have violations or incompletes', async () => {
    const { container } = render(<SimpleOutOfStock />)

    expect(await axe(container)).toHaveNoViolations()
    expect(await axe(container)).toHaveNoIncompletes()
  })

  it('`outOfStock` component should be a `section`', () => {
    render(<SimpleOutOfStock />)
    const outOfStock = screen.getByTestId('store-out-of-stock')

    expect(outOfStock.tagName).toEqual('SECTION')
  })

  it('`outOfStockMessage` component should be an `paragraph`', () => {
    render(<SimpleOutOfStock />)
    const outOfStockMessage = screen.getByTestId('store-out-of-stock-message')

    expect(outOfStockMessage.tagName).toEqual('P')
  })

  it('`outOfStockTitle` component should be an `paragraph`', () => {
    render(<SimpleOutOfStock />)
    const outOfStockTitle = screen.getByTestId('store-out-of-stock-title')

    expect(outOfStockTitle.tagName).toEqual('P')
  })

  it('`outOfStockMessage` component should be an `div`', () => {
    render(<ComposingOutOfStock />)
    const outOfStockMessage = screen.getByTestId('store-out-of-stock-message')

    expect(outOfStockMessage.tagName).toEqual('DIV')
  })

  it('`outOfStockTitle` component should be an `div`', () => {
    render(<ComposingOutOfStock />)
    const outOfStockTitle = screen.getByTestId('store-out-of-stock-title')

    expect(outOfStockTitle.tagName).toEqual('DIV')
  })
})
