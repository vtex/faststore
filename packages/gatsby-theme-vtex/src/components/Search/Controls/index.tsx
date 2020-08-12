import React, { FC } from 'react'
import { SearchControls, SearchControlsTotalCount } from '@vtex/store-ui'

import SearchControlsSelect from './SortSelect'
import { SearchPageQueryQuery } from '../../../templates/__generated__/SearchPageQuery.graphql'
import { SearchControlsFiltersButton } from './FiltersButton'

interface Props {
  data: SearchPageQueryQuery
}

const Controls: FC<Props> = ({ data }) => (
  <SearchControls>
    <SearchControlsFiltersButton {...(data.vtex.facets as any)} />
    <SearchControlsSelect />
    <SearchControlsTotalCount
      label=" PRODUCTS"
      totalCount={data.vtex.productSearch!.recordsFiltered!}
    />
  </SearchControls>
)

export default Controls
