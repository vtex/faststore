import React, { FC, lazy } from 'react'

import SuspenseSSR from '../Suspense/SSR'
import SearchBarContainer from './Container'

const SearchBarButton = lazy(() => import('./Button'))
const SearchBarInput = lazy(() => import('./Input'))
const SearchSuggestions = lazy(() => import('../SearchSuggestions'))
const SearchBarProvider = lazy(() => import('./Provider'))

interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
}

const SearchBar: FC<Props> = ({
  variant = 'searchbar',
  placeholder,
  'aria-label': label,
}) => (
  <SearchBarContainer>
    <SuspenseSSR fallback={null}>
      <SearchBarProvider>
        <SearchBarInput
          variant={variant}
          aria-label={`${label} input`}
          placeholder={placeholder}
          popoverState={{ placement: 'bottom-start' }}
        >
          <SearchSuggestions />
        </SearchBarInput>
        <SearchBarButton variant={variant} aria-label={`${label} button`} />
      </SearchBarProvider>
    </SuspenseSSR>
  </SearchBarContainer>
)

export default SearchBar
