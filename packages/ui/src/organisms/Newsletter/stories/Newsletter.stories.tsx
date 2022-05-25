import type { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'

import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import Label from '../../../atoms/Label'
import type { NewsletterProps } from '../Newsletter'
import Component from '../Newsletter'
import mdx from './Newsletter.mdx'

export const Newsletter: Story<NewsletterProps> = ({ ...props }) => {
  const [value, setValue] = useState('')

  const handlerSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // eslint-disable-next-line no-alert
    alert(value)
  }

  return (
    <Component onSubmit={handlerSubmitForm} {...props}>
      <Label htmlFor="input">Input Form</Label>
      <Input
        id="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button>Notify me</Button>
    </Component>
  )
}

export const ComposingNewsletter: Story<NewsletterProps> = () => {
  const [value, setValue] = useState('')

  const handlerSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // eslint-disable-next-line no-alert
    alert(value)
  }

  return (
    <Component
      onSubmit={handlerSubmitForm}
      title={<h1>Composing Newsletter</h1>}
      message={
        <h1>
          Receive our news and promotions in advance. Enjoy and get
          <b> 10% off</b> your first purchase. For more information
          <a href="/."> click here</a>
        </h1>
      }
    >
      <Label htmlFor="input">Input Form</Label>
      <Input
        id="input"
        value={value}
        onChange={(e) => setValue(e.target.value)}
      />
      <Button>Notify me</Button>
    </Component>
  )
}

export default {
  title: 'Organisms/Newsletter',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  args: {
    title: 'Get news and special offers',
    message:
      'Receive our news and promotions in advance. Enjoy and get 10% off your first purchase. For more information click here',
  },
} as Meta

ComposingNewsletter.args = {}
