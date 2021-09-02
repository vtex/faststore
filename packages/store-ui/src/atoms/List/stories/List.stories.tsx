import type { Story } from '@storybook/react'
import React from 'react'

import type { ComponentArgTypes } from '../../../typings/utils'
import type { ListProps } from '../List'
import Component from '../List'
import mdx from './List.mdx'

type ListStoryProps = ListProps & { options: string[] }
type DescriptionListStoryProps = ListProps & { options: string[][] }

const ListTemplate: Story<ListStoryProps> = ({ options, ...props }) => {
  return (
    <Component {...props}>
      {options.map((value) => (
        <li key={value}>{value}</li>
      ))}
    </Component>
  )
}

const DescriptionListTemplate: Story<DescriptionListStoryProps> = ({
  options,
  ...props
}) => {
  return (
    <Component {...props}>
      {options.map(([title, value]) => [
        <dt key={title}>{title}</dt>,
        <dd key={value}>{value}</dd>,
      ])}
    </Component>
  )
}

export const UnorderedList = ListTemplate.bind({})

export const OrderedList = ListTemplate.bind({})
OrderedList.args = {
  variant: 'ordered',
}

export const DescriptionList = DescriptionListTemplate.bind({})
DescriptionList.args = {
  options: [
    ['Ok', 'An ok item'],
    ['Good', 'A good item'],
    ['Bad', 'A bad item'],
  ],
  variant: 'description',
}

const argTypes: ComponentArgTypes<ListStoryProps> = {
  options: {
    control: { type: 'array' },
    defaultValue: ['Great', 'Ok', 'Bad'],
  },
  variant: {
    options: ['description', 'ordered', 'unordered'],
    control: { type: 'select' },
    defaultValue: 'unordered',
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
