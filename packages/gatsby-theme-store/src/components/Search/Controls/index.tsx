import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { SearchControls, SearchControlsTotalCount } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import { SearchControlsFiltersButton } from './FiltersButton'
import SearchControlsSelect from './SortSelect'
import type { BrowserCollectionPageQueryQuery } from '../../../{StoreCollection.slug}/__generated__/BrowserCollectionPageQuery.graphql'
import type { ServerCollectionPageQueryQuery } from '../../../{StoreCollection.slug}/__generated__/ServerCollectionPageQuery.graphql'

interface Props {
  data: BrowserCollectionPageQueryQuery | ServerCollectionPageQueryQuery
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
