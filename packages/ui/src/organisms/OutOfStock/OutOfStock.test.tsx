import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React from 'react'

import { OutOfStockMessage, OutOfStockTitle } from '.'
import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'
import OutOfStock from './OutOfStock'

const SimpleOutOfStock = () => (
  <OutOfStock>
    <OutOfStockTitle>
      Text <span>icon</span>
    </OutOfStockTitle>
    <OutOfStockMessage>Notify me when available</OutOfStockMessage>
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
    expect(outOfStockForm).toHaveAttribute('data-out-of-stock-form')
    expect(outOfStockTitle).toHaveAttribute('data-out-of-stock-title')
    expect(outOfStockMessage).toHaveAttribute('data-out-of-stock-message')
  })

  it('Should emit event', () => {
    const onSubmitMock = jest.fn((e) => e.preventDefault())

    render(
      <OutOfStock onSubmit={onSubmitMock}>
        <OutOfStockTitle>Out of Stock</OutOfStockTitle>
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
      <OutOfStock>
        <OutOfStockTitle>Out of Stock</OutOfStockTitle>
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

  it('Out of Stock component should be a `section`', () => {
    render(<SimpleOutOfStock />)
    const outOfStock = screen.getByTestId('store-out-of-stock')

    expect(outOfStock.tagName).toEqual('SECTION')
  })

  it('Out of Stock `title` component should be a `heading 2` as default', () => {
    render(<SimpleOutOfStock />)
    const outOfStockTitle = screen.getByTestId('store-out-of-stock-title')

    expect(outOfStockTitle.tagName).toEqual('H2')
  })

  it('Out of Stock `message` should be a `paragraph` as default', () => {
    render(<SimpleOutOfStock />)
    const outOfStockMessage = screen.getByTestId('store-out-of-stock-message')

    expect(outOfStockMessage.tagName).toEqual('P')
  })

  it('Out of Stock should render `title` as heading 1 and `message` as span', () => {
    render(
      <OutOfStock>
        <OutOfStockTitle as="h1">Head Out Os Stock</OutOfStockTitle>
        <OutOfStockMessage as="span">Head Out Os Stock</OutOfStockMessage>
        <Label>
          Email
          <Input />
        </Label>
        <Button>Notify me</Button>
      </OutOfStock>
    )

    const outOfStockMessage = screen.getByTestId('store-out-of-stock-message')
    const outOfStockTitle = screen.getByTestId('store-out-of-stock-title')

    expect(outOfStockTitle.tagName).toEqual('H1')
    expect(outOfStockMessage.tagName).toEqual('SPAN')
  })
})
