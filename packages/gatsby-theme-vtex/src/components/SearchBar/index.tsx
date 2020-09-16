import React, { FC, lazy } from 'react'

import SearchBarContainer from './Container'
import SuspenseSSR from '../Suspense/SSR'
import { Props } from './SearchBar'

const SearchBarComponent = lazy(() => import('./SearchBar'))

const SearchBar: FC<Props> = (props) => (
  <SearchBarContainer>
    <SuspenseSSR fallback={null}>
      <SearchBarComponent {...props} />
    </SuspenseSSR>
  </SearchBarContainer>
)

export default SearchBar
