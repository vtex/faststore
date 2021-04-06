import React, { lazy } from 'react'
import type { FC } from 'react'

import SuspenseDevice from '../Suspense/Device'
import SearchSuggestionsProvider from './base/Provider'
import { useRegion } from '../useRegion'

const SearchSuggestionMobile = lazy(() => import('./Mobile'))
const SearchSuggestionDesktop = lazy(() => import('./Desktop'))

const SearchSuggestions: FC = () => {
  const regionContext = useRegion()

  return (
    <SearchSuggestionsProvider>
      <SuspenseDevice device="mobile" fallback={null}>
        <SearchSuggestionMobile regionId={regionContext.regionId} />
      </SuspenseDevice>
      <SuspenseDevice device="desktop" fallback={null}>
        <SearchSuggestionDesktop regionId={regionContext.regionId} />
      </SuspenseDevice>
    </SearchSuggestionsProvider>
  )
}

export default SearchSuggestions
