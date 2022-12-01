import type { Story, Meta } from '@storybook/react'
import React, { useState } from 'react'

import type {
  OutOfStockMessageProps,
  OutOfStockTitleProps,
  OutOfStockProps,
} from '..'
import Component, { OutOfStockTitle, OutOfStockMessage } from '..'
import { Button, Input } from '@faststore/components'
import mdx from './OutOfStock.mdx'

type OutOfStockTemplateProps = {
  title: string
  message: string
  titleAs: OutOfStockTitleProps['as']
  messageAs: OutOfStockMessageProps['as']
} & OutOfStockProps

const OutOfStockTemplate: Story<OutOfStockTemplateProps> = ({
  title,
  message,
  titleAs,
  messageAs,
  ...props
}) => {
  const [value, setValue] = useState('')

  const handlerSubmitForm = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // eslint-disable-next-line no-alert
    alert(value)
  }

  return (
    <Component onSubmit={handlerSubmitForm} {...props}>
      <OutOfStockTitle as={titleAs}>{title}</OutOfStockTitle>
      <OutOfStockMessage as={messageAs}>{message}</OutOfStockMessage>
      <Input value={value} onChange={(e) => setValue(e.target.value)} />
      <Button>Notify me</Button>
    </Component>
  )
}

export const OutOfStock = OutOfStockTemplate.bind({})
OutOfStock.storyName = 'OutOfStock'

export default {
  title: 'Organisms/OutOfStock',
  parameters: {
    docs: {
      page: mdx,
    },
  },
  args: {
    title: 'Notify me',
    message: 'Notify me when available',
  },
  argTypes: {
    titleAs: {
      defaultValue: 'h2',
      options: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p'],
      control: { type: 'select' },
    },
    messageAs: {
      defaultValue: 'p',
      options: ['h2', 'h3', 'h4', 'h5', 'h6', 'p', 'div', 'span'],
      control: { type: 'select' },
    },
  },
} as Meta
