import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { axe } from 'jest-axe'
import React from 'react'

import Button from '../../atoms/Button'
import Input from '../../atoms/Input'
import Label from '../../atoms/Label'
import Newsletter from './Newsletter'

const SimpleNewsletter = () => (
  <Newsletter title="Newsletter" message="Notify me when available">
    <Label>
      Email
      <Input />
    </Label>
    <Button>Notify me</Button>
  </Newsletter>
)

const ComposingNewsletter = () => (
  <Newsletter
    title={<h1>Head Newsletter</h1>}
    message={<span>Span Newsletter</span>}
  >
    <Label>
      Email
      <Input />
    </Label>
    <Button>Notify me</Button>
  </Newsletter>
)

describe('Newsletter', () => {
  it('`Newsletter` components should have corrects attributes', () => {
    render(<SimpleNewsletter />)

    const newsletter = screen.getByTestId('store-newsletter')
    const newsletterTitle = screen.getByTestId('store-newsletter-title')
    const newsletterMessage = screen.getByTestId('store-newsletter-message')
    const newsletterForm = screen.getByTestId('store-newsletter-form')

    expect(newsletter).toHaveAttribute('data-store-newsletter')
    expect(newsletterForm).toHaveAttribute('data-store-newsletter-form')
    expect(newsletterTitle).toHaveAttribute('data-store-newsletter-title')
    expect(newsletterMessage).toHaveAttribute('data-store-newsletter-message')
  })

  it('Should emit event', () => {
    const onSubmitMock = jest.fn((e) => e.preventDefault())

    render(
      <Newsletter onSubmit={onSubmitMock} title="Newsletter">
        <Input name="email" />
        <Button type="submit">Notify me</Button>
      </Newsletter>
    )

    const newsletterEventButton = screen.getByTestId('store-button')

    userEvent.click(newsletterEventButton)

    expect(onSubmitMock).toHaveBeenCalledTimes(1)
  })

  it('Should not render message', () => {
    render(
      <Newsletter title="Newsletter">
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

  it('`newsletter` component should be an `section`', () => {
    render(<SimpleNewsletter />)
    const newsletter = screen.getByTestId('store-newsletter')

    expect(newsletter.tagName).toEqual('SECTION')
  })

  it('`newsletterMessage` component should be an `paragraph`', () => {
    render(<SimpleNewsletter />)
    const newsletterMessage = screen.getByTestId('store-newsletter-message')

    expect(newsletterMessage.tagName).toEqual('P')
  })

  it('`newsletterTitle` component should be an `paragraph`', () => {
    render(<SimpleNewsletter />)
    const newsletterTitle = screen.getByTestId('store-newsletter-title')

    expect(newsletterTitle.tagName).toEqual('P')
  })

  it('`newsletterMessage` component should be an `div`', () => {
    render(<ComposingNewsletter />)
    const newsletterMessage = screen.getByTestId('store-newsletter-message')

    expect(newsletterMessage.tagName).toEqual('DIV')
  })

  it('`newsletterTitle` component should be an `div`', () => {
    render(<ComposingNewsletter />)
    const newsletterTitle = screen.getByTestId('store-newsletter-title')

    expect(newsletterTitle.tagName).toEqual('DIV')
  })
})
