import { useIntl } from '@vtex/gatsby-plugin-i18n'
import { SearchControlsSelect as StoreUISortSelect } from '@vtex/store-ui'
import React from 'react'
import type { FC } from 'react'

import { useFilters } from '../../../sdk/search/useFilters'

const searchFilterControler = () => import('../../../sdk/search/controller')

interface Props {
  variant?: string
}

const SearchControlsSelect: FC<Props> = ({ variant }) => {
  const { formatMessage } = useIntl()
  const filters = useFilters()

  return (
    <StoreUISortSelect
      variant={variant}
      defaultValue={filters.orderBy}
      onChange={async (orderBy) => {
        const controller = await searchFilterControler()

        controller.setSearchFilters({
          ...filters,
          orderBy,
        })
      }}
      formatLabel={(label: string) => formatMessage({ id: label })}
    />
  )
}

export default SearchControlsSelect
