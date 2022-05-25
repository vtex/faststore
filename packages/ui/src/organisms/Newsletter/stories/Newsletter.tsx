import type { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'

import Button from '../../../atoms/Button'
import Input from '../../../atoms/Input'
import type { NewsletterProps } from '../Newsletter'
import Component from '../Newsletter'
import mdx from './Newsletter.mdx'

const NewsletterTemplate: Story<NewsletterProps> = ({ ...props }) => {
  const [value, setValue] = useState('')

  const handlerSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // eslint-disable-next-line no-alert
    alert(value)
  }

  return (
    <Component onSubmit={handlerSubmitForm} {...props}>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button>Notify me</Button>
    </Component>
  )
}

export const Newsletter = NewsletterTemplate.bind({})
Newsletter.storyName = 'Newsletter'

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
