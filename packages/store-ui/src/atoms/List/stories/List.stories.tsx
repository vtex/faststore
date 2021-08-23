import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { ListProps } from '../List'
import Component from '../List'
import mdx from './List.mdx'

type ListStoryProps = ListProps & { options: string[] }

const ListTemplate: Story<ListStoryProps> = ({ options, ...props }) => {
  return (
    <Component {...props}>
      {options.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </Component>
  )
}

export const List = ListTemplate.bind({})

const argTypes: ComponentArgTypes<ListStoryProps> = {
  options: {
    control: { type: 'array' },
    defaultValue: ['Great', 'Ok', 'Bad'],
  },
  variant: {
    options: ['default', 'description', 'ordered', 'unordered'],
    control: { type: 'select' },
    defaultValue: 'default',
  },
}

export default {
  title: 'Atoms/List',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
