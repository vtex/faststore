import React, { FC } from 'react'
import { SearchControls, SearchControlsTotalCount } from '@vtex/store-ui'
import { useIntl } from '@vtex/gatsby-plugin-i18n'

import SearchControlsSelect from './SortSelect'
import { SearchPageQueryQuery } from '../../../templates/__generated__/SearchPageQuery.graphql'
import { SearchControlsFiltersButton } from './FiltersButton'

interface Props {
  data: SearchPageQueryQuery
}

const Controls: FC<Props> = ({ data }) => {
  const { formatMessage } = useIntl()
  const totalCount = data.vtex.productSearch!.recordsFiltered!

  return (
    <SearchControls>
      <SearchControlsFiltersButton {...(data.vtex.facets as any)} />
      <SearchControlsSelect />
      <SearchControlsTotalCount
        label={formatMessage(
          { id: 'searchControls.totalCount' },
          { count: totalCount }
        )}
        totalCount={totalCount}
      />
    </SearchControls>
  )
}

export default Controls
