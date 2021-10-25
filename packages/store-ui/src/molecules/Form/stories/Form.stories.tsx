import type { Story } from '@storybook/react'
import React, { useState } from 'react'

import { Button, Checkbox, Input, Label } from '../../..'
import type { FormProps } from '../Form'
import Component from '../Form'
import mdx from './Form.mdx'

const FormTemplate: Story<FormProps> = ({ testId }) => {
  const [name, setName] = useState<string>()
  const [email, setEmail] = useState<string>()

  return (
    <Component
      testId={testId}
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
    </Component>
  )
}

export const Form = FormTemplate.bind({})

export default {
  title: 'Molecules/Form',
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
