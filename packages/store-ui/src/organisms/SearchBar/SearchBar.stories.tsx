/* eslint-disable no-alert */
import type { Meta, Story } from '@storybook/react'
import React from 'react'

import type { SearchBarProps } from './SearchBar'
import Root from './SearchBar'

export default {
  title: 'Organisms/SearchBar',
} as Meta

const SearchBarTemplate: Story<SearchBarProps> = (args) => <Root {...args} />

export const SearchBar = SearchBarTemplate.bind({})
SearchBar.args = {
  placeholder: 'Search',
  onSubmit: (value: string) => alert(`[search-bar]: ${value}`),
  children: <div>Sugestions</div>,
}
