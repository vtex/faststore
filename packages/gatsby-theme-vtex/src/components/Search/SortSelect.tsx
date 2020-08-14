import React, { FC } from 'react'
import { SortSelect as StoreUISearchSelect } from '@vtex/store-ui'

import { useSearchFilters, DEFAULT_ORDER_BY } from '../../sdk'

const searchFilterControler = () => import('../../sdk')

interface Props {
  variant: string
}

const SortSelect: FC<Props> = ({ variant }) => {
  const filters = useSearchFilters()

  return (
    <StoreUISearchSelect
      variant={variant}
      defaultValue={DEFAULT_ORDER_BY}
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
