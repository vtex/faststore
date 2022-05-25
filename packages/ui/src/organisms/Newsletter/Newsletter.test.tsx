import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React from 'react'

import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'
import Newsletter from './Newsletter'

const SimpleNewsletter = () => (
  <Newsletter title="Out of Stock" message="Notify me when available">
    <Label>
      Email
      <Input />
    </Label>
    <Button>Notify me</Button>
  </Newsletter>
)

describe('Newsletter', () => {
  it('`Out Of Stock` components should have corrects attributes', () => {
    render(<SimpleNewsletter />)

    const outOfStock = screen.getByTestId('store-newsletter')
    const outOfStockTitle = screen.getByTestId('store-newsletter-title')
    const outOfStockMessage = screen.getByTestId('store-newsletter-message')
    const outOfStockForm = screen.getByTestId('store-newsletter-form')

    expect(outOfStock).toHaveAttribute('data-store-newsletter')
    expect(outOfStockForm).toHaveAttribute('data-store-newsletter-form')
    expect(outOfStockTitle).toHaveAttribute('data-store-newsletter-title')
    expect(outOfStockMessage).toHaveAttribute('data-store-newsletter-message')
  })

  it('Should emit event', () => {
    const onSubmitMock = jest.fn((e) => e.preventDefault())

    render(
      <Newsletter onSubmit={onSubmitMock} title="Out of Stock">
        <Input name="email" />
        <Button type="submit">Notify me</Button>
      </Newsletter>
    )

    const outOfStockEventButton = screen.getByTestId('store-button')

    userEvent.click(outOfStockEventButton)

    expect(onSubmitMock).toHaveBeenCalledTimes(1)
  })

  it('Should not render message', () => {
    render(
      <Newsletter title="Out of Stock">
        <Input name="email" />
        <Button type="submit">Notify me</Button>
      </Newsletter>
    )

    const message = screen.queryByTestId('store-newsletter-message')

    expect(message).not.toBeInTheDocument()
  })
})

describe('Accessibility', () => {
  it('should not have violations or incompletes', async () => {
    const { container } = render(<SimpleNewsletter />)

    expect(await axe(container)).toHaveNoViolations()
    expect(await axe(container)).toHaveNoIncompletes()
  })

  it('`outOfStock` component should be an `section`', () => {
    render(<SimpleNewsletter />)
    const outOfStock = screen.getByTestId('store-newsletter')

    expect(outOfStock.tagName).toEqual('SECTION')
  })

  it('`outOfStockMessage` component should be an `paragraph`', () => {
    render(<SimpleNewsletter />)
    const outOfStockMessage = screen.getByTestId('store-newsletter-message')

    expect(outOfStockMessage.tagName).toEqual('P')
  })

  it('`outOfStockTitle` component should be an `paragraph`', () => {
    render(<SimpleNewsletter />)
    const outOfStockTitle = screen.getByTestId('store-newsletter-title')

    expect(outOfStockTitle.tagName).toEqual('P')
  })
})
