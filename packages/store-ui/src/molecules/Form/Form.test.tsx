import { fireEvent, render } from '@testing-library/react'
import { axe } from 'jest-axe'
import React, { useState } from 'react'

import { Label, Input, Checkbox, Button } from '../..'
import Form from './Form'

const TestForm = () => {
  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()

  return (
    <Form
      onSubmit={(e) => {
        e.preventDefault()
        // eslint-disable-next-line no-alert
        alert(`Thank you for subscribing ${name}! Email: ${email}`)
      }}
    >
      <h1>Sign up & save 15% off your first order</h1>
      <h2>
        Be the first to hear about special offers, new product launches, gift
        ideas and more.
      </h2>
      <div>
        <Label htmlFor="name">Name:</Label>
        <Input
          id="name"
          placeholder="Enter your name"
          required
          onChange={(e) => setName(e.currentTarget.value)}
        />
      </div>
      <div>
        <Label htmlFor="email">Email:</Label>
        <Input
          id="email"
          placeholder="Enter your email"
          required
          onChange={(e) => setEmail(e.currentTarget.value)}
        />
      </div>
      <div>
        <Label>
          <Checkbox required />I agree to receive emails from Brand. View our{' '}
          <a href="/">Privacy Policy</a>.
        </Label>
      </div>
      <Button type="submit">Subscribe</Button>
    </Form>
  )
}

describe('Form', () => {
  it('should have `data-store-form` attribute', () => {
    const { getByTestId } = render(<TestForm />)

    expect(getByTestId('store-form')).toHaveAttribute('data-store-form')
  })

  describe('Accessibility', () => {
    it('should have no violations', async () => {
      const { getByTestId } = render(<TestForm />)

      expect(await axe(getByTestId('store-form'))).toHaveNoViolations()
    })

    it('should be able to submit from input', async () => {
      const mockOnSubmit = jest.fn()
      const { getByTestId } = render(
        <Form onSubmit={mockOnSubmit}>
          <Label htmlFor="name">Name</Label>
          <Input id="name" testId="test-submit-input" />
          <Button type="submit">Subscribe</Button>
        </Form>
      )

      fireEvent.submit(getByTestId('test-submit-input'))
      expect(mockOnSubmit).toHaveBeenCalled()
    })
  })
})
