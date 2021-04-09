/**
 * This is a simple version of its business logic. The intent it to have
 * an example of the hooks and components so store implementors can tweek
 * and implement their own based on their own needs. However, this should
 * cover 80% of use cases.
 */

import React from 'react'
import type { FC, ReactNode, ComponentPropsWithoutRef } from 'react'
import type { PopoverInitialState } from 'reakit/Popover'

import SearchBarContainer from './Container'
import SearchBarProvider from './hooks/Provider'
import SearchBarInput from './Input'
import SearchBarButton from './Button'

export interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
  popoverState?: PopoverInitialState
  icon?: ReactNode
  children: JSX.Element
  onSearch: ComponentPropsWithoutRef<typeof SearchBarProvider>['onSearch']
}

const SearchBar: FC<Props> = ({
  popoverState = { placement: 'bottom-start', unstable_flip: true },
  variant = 'searchbar',
  'aria-label': label,
  placeholder,
  onSearch,
  icon,
  children,
}) => (
  <SearchBarContainer>
    <SearchBarProvider onSearch={onSearch}>
      <SearchBarInput
        variant={variant}
        aria-label={label}
        placeholder={placeholder}
        popoverState={popoverState}
      >
        {children}
      </SearchBarInput>
      <SearchBarButton
        variant={variant}
        aria-label={`${label} button`}
        icon={icon}
      />
    </SearchBarProvider>
  </SearchBarContainer>
)

export default SearchBar
