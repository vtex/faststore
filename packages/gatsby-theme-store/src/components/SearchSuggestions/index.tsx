import React, { lazy } from 'react'
import type { FC } from 'react'
import { SuspenseDevice } from '@vtex/store-ui'

import SearchSuggestionsProvider from './base/Provider'

const SearchSuggestionMobile = lazy(() => import('./Mobile'))
const SearchSuggestionDesktop = lazy(() => import('./Desktop'))

const SearchSuggestions: FC = () => (
  <SearchSuggestionsProvider>
    <SuspenseDevice device="mobile" fallback={null}>
      <SearchSuggestionMobile />
    </SuspenseDevice>
    <SuspenseDevice device="desktop" fallback={null}>
      <SearchSuggestionDesktop />
    </SuspenseDevice>
  </SearchSuggestionsProvider>
)

export default SearchSuggestions
