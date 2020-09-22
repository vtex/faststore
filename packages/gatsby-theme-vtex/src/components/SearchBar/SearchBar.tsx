/** @jsx jsx */
import { FC, Suspense, lazy } from 'react'
import { PopoverInitialState, jsx } from '@vtex/store-ui'

import SearchBarButton from './Button'
import SearchBarInput from './Input'
import SearchBarProvider from './Provider'

const SearchSuggestions = lazy(() => import('../SearchSuggestions'))

export interface Props {
  variant?: string
  placeholder: string
  'aria-label': string
  popoverState?: PopoverInitialState
}

const SearchBar: FC<Props> = ({
  popoverState = { placement: 'bottom-start', unstable_flip: true },
  variant = 'searchbar',
  'aria-label': label,
  placeholder,
}) => (
  <SearchBarProvider>
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
    <SearchBarButton variant={variant} aria-label={`${label} button`} />
  </SearchBarProvider>
)

export default SearchBar
