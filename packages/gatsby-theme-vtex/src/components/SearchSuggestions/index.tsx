import React, { FC, lazy } from 'react'

import SuspenseDevice from '../Suspense/Device'

const SearchSuggestionMobile = lazy(() => import('../SearchSuggestions/Mobile'))
const SearchSuggestionDesktop = lazy(() =>
  import('../SearchSuggestions/Desktop')
)

const SearchSuggestions: FC = () => (
  <>
    <SuspenseDevice device="mobile" fallback={null}>
      <SearchSuggestionMobile />
    </SuspenseDevice>
    <SuspenseDevice device="desktop" fallback={null}>
      <SearchSuggestionDesktop />
    </SuspenseDevice>
  </>
)

export default SearchSuggestions
