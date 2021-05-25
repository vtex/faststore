/* eslint-disable no-alert */
import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { SearchInputProps } from './SearchInput'
import Root from './SearchInput'

export default {
  title: 'Molecules/SearchInput',
} as Meta

const SearchInputTemplate: Story<SearchInputProps> = (args) => (
  <Root {...args} />
)

// icon by feathericons
const Icon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="1em"
    height="1em"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <line x1="15" y1="9" x2="9" y2="15" />
    <line x1="9" y1="9" x2="15" y2="15" />
  </svg>
)

export const Default = SearchInputTemplate.bind({})
Default.args = {
  placeholder: 'Search',
  onSubmit: (value: string) => alert(`[search]: ${value}`),
}

export const CustomIcon = SearchInputTemplate.bind({})
CustomIcon.args = {
  placeholder: 'Search',
  onSubmit: (value: string) => alert(`[search]: ${value}`),
  icon: <Icon />,
}
