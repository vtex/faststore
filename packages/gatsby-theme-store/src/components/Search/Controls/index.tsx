import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { SearchControls, SearchControlsTotalCount } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import { SearchControlsFiltersButton } from './FiltersButton'
import SearchControlsSelect from './SortSelect'
import type { BrowserSearchPageQueryQuery } from '../../../templates/__generated__/BrowserSearchPageQuery.graphql'
import type { ServerSearchPageQueryQuery } from '../../../templates/__generated__/ServerSearchPageQuery.graphql'

interface Props {
  data: BrowserSearchPageQueryQuery | ServerSearchPageQueryQuery
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
