import type { Story } from '@storybook/react'
import React from 'react'
import type { ComponentArgTypes } from 'typings/utils'

import type { SearchInputProps } from '../SearchInput'
import Component from '../SearchInput'
import Icon from './assets/CustomIcon'
import mdx from './SearchInput.mdx'

const DefaultTemplate: Story<SearchInputProps> = ({
  onSubmit,
  placeholder,
}) => <Component onSubmit={onSubmit} placeholder={placeholder} />

export const Default = DefaultTemplate.bind({})

const CustomIconTemplate: Story<SearchInputProps> = ({
  onSubmit,
  placeholder,
}) => (
  <Component icon={<Icon />} onSubmit={onSubmit} placeholder={placeholder} />
)

export const CustomIcon = CustomIconTemplate.bind({})

const argTypes: ComponentArgTypes<SearchInputProps> = {
  placeholder: {
    control: { type: 'text' },
    defaultValue: 'Search',
  },
  onSubmit: {
    action: 'SearchInput submitted!',
    table: { disable: true },
  },
}

export default {
  title: 'Molecules/SearchInput',
  argTypes,
  parameters: {
    docs: {
      page: mdx,
    },
  },
}
