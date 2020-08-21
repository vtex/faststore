import React, { FC } from 'react'
import { SearchControlsSelect as StoreUISortSelect } from '@vtex/store-ui'

import { useFilters } from '../../../sdk/search/useFilters'

const searchFilterControler = () => import('../../../sdk/search/controller')

interface Props {
  variant?: string
}

const SearchControlsSelect: FC<Props> = ({ variant }) => {
  const filters = useFilters()

  return (
    <StoreUISortSelect
      variant={variant}
      defaultValue={filters.orderBy as any}
      onChange={async (orderBy: string) => {
        const controller = await searchFilterControler()

        controller.setSearchFilters({
          ...filters,
          orderBy,
        })
      }}
    />
  )
}

export default SearchControlsSelect
