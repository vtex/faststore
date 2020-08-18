import React, { FC } from 'react'
import { SearchControlsSelect as StoreUISortSelect } from '@vtex/store-ui'

import { useSearchFilters } from '../../../sdk'

const searchFilterControler = () => import('../../../sdk/search/controler')

interface Props {
  variant?: string
}

const SearchControlsSelect: FC<Props> = ({ variant }) => {
  const filters = useSearchFilters()

  return (
    <StoreUISortSelect
      variant={variant}
      defaultValue={filters.orderBy as any}
      onChange={async (orderBy: string) => {
        const { setSearchFilters } = await searchFilterControler()

        setSearchFilters({
          ...filters,
          orderBy,
        })
      }}
    />
  )
}

export default SearchControlsSelect
