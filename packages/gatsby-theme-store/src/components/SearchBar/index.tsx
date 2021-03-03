/** @jsx jsx */
import { Suspense, lazy } from 'react'
import {
  jsx,
  SearchBarButton,
  SearchBarInput,
  SearchBarProvider,
  SearchBarContainer,
} from '@vtex/store-ui'
import type { FC } from 'react'
import type { PopoverInitialState } from '@vtex/store-ui'

import { search } from '../../sdk/search/controller'

const SearchSuggestions = lazy(() => import('../SearchSuggestions'))

export interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
  popoverState?: PopoverInitialState
  icon?: Element
}

const SearchBar: FC<Props> = ({
  popoverState = { placement: 'bottom-start', unstable_flip: true },
  variant = 'searchbar',
  'aria-label': label,
  placeholder,
  icon,
}) => (
  <SearchBarContainer>
    <SearchBarProvider onSearch={search}>
      <SearchBarInput
        variant={variant}
        aria-label={label}
        placeholder={placeholder}
        popoverState={popoverState}
      >
        <Suspense fallback={null}>
          <SearchSuggestions />
        </Suspense>
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
