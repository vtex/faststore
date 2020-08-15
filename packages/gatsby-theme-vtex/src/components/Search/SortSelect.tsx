import React, { FC } from 'react'
import { SortSelect as StoreUISortSelect } from '@vtex/store-ui'

import { useSearchFilters } from '../../sdk'

const searchFilterControler = () => import('../../sdk')

interface Props {
  variant: string
}

const SortSelect: FC<Props> = ({ variant }) => {
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

export default SortSelect
