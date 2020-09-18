import React, { FC, lazy } from 'react'

import SuspenseDevice from '../Suspense/Device'
import SuspenseSSR from '../Suspense/SSR'

const SearchSuggestionMobile = lazy(() => import('./Mobile'))
const SearchSuggestionDesktop = lazy(() => import('./Desktop'))
const SearchSuggestionsProvider = lazy(() => import('./base/Provider'))

const SearchSuggestions: FC = () => (
  <SuspenseSSR fallback={null}>
    <SearchSuggestionsProvider>
      <SuspenseDevice device="mobile" fallback={null}>
        <SearchSuggestionMobile />
      </SuspenseDevice>
      <SuspenseDevice device="desktop" fallback={null}>
        <SearchSuggestionDesktop />
      </SuspenseDevice>
    </SearchSuggestionsProvider>
  </SuspenseSSR>
)

export default SearchSuggestions
