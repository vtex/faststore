import React from 'react'
import type { FC, ComponentPropsWithoutRef } from 'react'

import Provider from './base/Provider'
import SuspenseDevice from '../Suspense/Device'
import SearchSuggestionMobile from './Mobile'
import SearchSuggestionDesktop from './Desktop'

type Props = ComponentPropsWithoutRef<typeof SearchSuggestionMobile> &
  ComponentPropsWithoutRef<typeof SearchSuggestionDesktop>

const SearchSuggestions: FC<Props> = (props) => (
  <Provider>
    <SuspenseDevice device="mobile" fallback={null}>
      <SearchSuggestionMobile {...props} />
    </SuspenseDevice>
    <SuspenseDevice device="desktop" fallback={null}>
      <SearchSuggestionDesktop {...props} />
    </SuspenseDevice>
  </Provider>
)

export default SearchSuggestions
